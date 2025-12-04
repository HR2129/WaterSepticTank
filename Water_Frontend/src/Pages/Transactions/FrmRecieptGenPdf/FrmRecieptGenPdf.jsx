import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiService from "../../../../apiService";
import fontUrl from "/fonts/NotoSansDevanagari-Regular.ttf";

// -------------------------------------------------------------
// ✅ Load Marathi Font
// -------------------------------------------------------------
const loadMarathiFont = async (doc) => {
  try {
    const res = await fetch(fontUrl);
    const buffer = await res.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    let binary = "";
    uint8Array.forEach((b) => (binary += String.fromCharCode(b)));
    const base64Font = btoa(binary);

    doc.addFileToVFS("NotoSansDevanagari-Regular.ttf", base64Font);
    doc.addFont(
      "NotoSansDevanagari-Regular.ttf",
      "NotoSansDevanagari",
      "normal"
    );
  } catch (err) {
    console.error("Marathi font loading error:", err);
  }
};

// -------------------------------------------------------------
// FETCH LOGO + ULB NAME
// -------------------------------------------------------------
const getLogoAndUlbName = async (ulbId) => {
  try {
    const res = await apiService.get(`textlogo/${ulbId}`);

    const nameFromApi =
      res?.data?.data?.ABC_MUNICIPAL_TEXT ||
      res?.data?.data?.ULB_TEXT ||
      res?.data?.data?.ULBNAME ||
      null;

    return {
      logo: res?.data?.data?.ULBLOGO || null,
      ulbName: nameFromApi
        ? String(nameFromApi).normalize("NFC")
        : "नगर परिषद",
    };
  } catch (err) {
    console.error("ULB fetch error:", err);
    return { logo: null, ulbName: "नगर परिषद" };
  }
};

// -------------------------------------------------------------
// MAIN PDF FUNCTION
// -------------------------------------------------------------
export const FrmRecieptGenPdf = async (recNo, orgId) => {
  if (!recNo || !orgId) return;

  try {
    const res = await apiService.post("GetTankReceiptByRecNo", {
      recNo,
      orgId,
    });

    const data = res?.data?.data?.[0];
    if (!data) return alert("No receipt data found");

    const { logo, ulbName } = await getLogoAndUlbName(orgId);

    const doc = new jsPDF("p", "mm", "a4");

    await loadMarathiFont(doc);

    // -------------------------------------------------------------
    // HEADER (Professional Design)
    // -------------------------------------------------------------
    let headerY = 15;
    const logoSize = 28;

    if (logo) {
      const match = logo.match(/^data:image\/(\w+);base64,/);
      const format = match ? match[1].toUpperCase() : "PNG";
      doc.addImage(logo, format, 20, headerY, logoSize, logoSize);
    }

    // ULB NAME - Adjusted Font Size to 20 for better fit and centering
    doc.setFont("NotoSansDevanagari", "normal");
    doc.setFontSize(20);
    doc.text(ulbName, 105, headerY + 12, { align: "center" });

    // Receipt Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("RECEIPT", 105, headerY + 22, { align: "center" });

    // Divider Line
    doc.setDrawColor(180);
    doc.setLineWidth(0.4);
    doc.line(15, headerY + 32, 195, headerY + 32);

    // -------------------------------------------------------------
    // RECEIPT BASIC DETAILS
    // -------------------------------------------------------------
    let receiptY = headerY + logoSize + 18;

    doc.setFillColor(240); // Light grey box
    doc.rect(15, receiptY - 6, 180, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Receipt Details", 20, receiptY - 1);

    doc.setFont("helvetica", "normal");

    doc.text(`Receipt No: ${data.RECNO}`, 20, receiptY + 8);
    doc.text(
      `Date: ${new Date(data.RECEIPTDT).toLocaleDateString()}`,
      180,
      receiptY + 8,
      { align: "right" }
    );

    doc.setDrawColor(200);
    doc.line(15, receiptY + 12, 195, receiptY + 12);

    // -------------------------------------------------------------
    // CUSTOMER INFO
    // -------------------------------------------------------------
    const startY = receiptY + 20;
    const h = 7;

    doc.setFillColor(240);
    doc.rect(15, startY - 6, 180, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 20, startY - 1);

    doc.setFont("helvetica", "normal");
    doc.text(`Owner Name:  ${data.OWNERNAME}`, 20, startY + h);
    doc.text(`Mobile:           ${data.MOBILE}`, 20, startY + 2 * h);
    doc.text(`Email:               ${data.EMAILID}`, 20, startY + 3 * h);
    doc.text(`Address:          ${data.ADDRESS}`, 20, startY + 4 * h);

    // -------------------------------------------------------------
    // PAYMENT TABLE
    // -------------------------------------------------------------
    autoTable(doc, {
      startY: startY + 7 * h,
      head: [["Description", "Details"]],
      body: [
        ["Bill Amount", data.AMOUNT?.toString()],
        ["Payment Mode", data.RECMODNAME],
        ["Bank Name", data.BANK_NAME],
        ["Check No", data.CHEQNO],
        [
          "Check Date",
          data.CHECKDT
            ? new Date(data.CHECKDT).toLocaleDateString()
            : "",
        ],
        ["Reference No", data.REFNO],
      ],
      theme: "grid",
      margin: { left: 20, right: 20 },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontSize: 11,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 11,
        lineColor: 200,
        lineWidth: 0.2,
        cellPadding: 3,
      },
    });

    // -------------------------------------------------------------
    // FOOTER
    // -------------------------------------------------------------
    const pageHeight = doc.internal.pageSize.height;

    doc.setDrawColor(180);
    doc.line(40, pageHeight - 25, 170, pageHeight - 25);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for your payment", 105, pageHeight - 20, {
      align: "center",
    });

    doc.text(
      "(This is a system generated receipt and does not require signature)",
      105,
      pageHeight - 14,
      { align: "center" }
    );

    // -------------------------------------------------------------
    // OPEN PDF
    // -------------------------------------------------------------
    const pdfBlob = doc.output("blob");
    window.open(URL.createObjectURL(pdfBlob), "_blank");
  } catch (e) {
    console.error("PDF Error:", e);
    alert("Failed to generate PDF");
  }
};