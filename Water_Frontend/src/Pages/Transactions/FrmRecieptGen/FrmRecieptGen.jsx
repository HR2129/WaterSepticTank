import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import apiService from "../../../../apiService";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import Button from "../../../Components/Button/button";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";
import { useAuth } from "../../../Context/AuthContext";
import CalendarIcon from "../../../Components/Calendar/CalendarIcon";
// CHANGE 1: Import the function instead of the component
import { FrmRecieptGenPdf } from "../FrmRecieptGenPdf/FrmRecieptGenPdf";

// SweetAlert2
import Swal from "sweetalert2";

const useLanguage = () => ({ translate: (text) => text });
const useNavigate = () => (pathOrDelta) => {
  if (typeof pathOrDelta === "number")
    console.log(`Navigating back by ${Math.abs(pathOrDelta)} steps.`);
  else console.log(`Navigating to: ${pathOrDelta}`);
};

const initialValues = {
  billNo: "",
  ownerName: "",
  mobileNumber: "",
  email: "",
  address: "",
  billAmount: "",
  billDate: new Date().toISOString().split("T")[0],
  prabhag: "",
  zone: "",
  paymentMode: "1",
  checkDate: new Date().toISOString().split("T")[0],
  paidAmount: "",
  bankName: "",
  receiptDate: new Date().toISOString().split("T")[0],
  referenceNo: "",
  checkNo: "",
  remark: "",
  numRequestId: "",
  numRequestTnkId: "",
  billId: "",
};

function FrmRecieptGen() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [prabhagOptions, setPrabhagOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [paymodeOptions, setPaymodeOptions] = useState([]);
  const [searchStatus, setSearchStatus] = useState(null);

  // New state to store the payment mode pay code
  const [paymentPayCode, setPaymentPayCode] = useState(null);

  const ulbid = user?.ulbId;
  const orgId = user?.ulbId;

  // Dropdowns
  const fetchPrabhagDropdown = async () => {
    if (!ulbid) return;
    try {
      const response = await apiService.post("prabhagDropdown", { ulbid });
      if (response?.data?.success && Array.isArray(response.data.data)) {
        const data = response.data.data.map((item) => ({
          label: item.PRABHAGNAME,
          value: String(item.PRABHAGID),
        }));
        setPrabhagOptions(data);
      } else {
        setPrabhagOptions([]);
        console.warn("No prabhag data returned from API.");
      }
    } catch (error) {
      console.error("Error fetching prabhag dropdown:", error);
      setPrabhagOptions([]);
    }
  };

  const fetchZoneDropdown = async (prabhagId) => {
    if (!prabhagId || !orgId) return;
    try {
      const response = await apiService.post("ZoneDropdown", { orgId, prabhagId });
      if (response?.data?.success && Array.isArray(response.data.data)) {
        const data = response.data.data.map((z) => ({
          label: z.ZONENAME || z.WARDNAME,
          value: String(z.ZONEID || z.WARDID),
        }));
        setZoneOptions(data);
      } else setZoneOptions([]);
    } catch (err) {
      console.error("ZoneDropdown error:", err);
      setZoneOptions([]);
    }
  };

  const fetchPaymodeDropdown = async () => {
    if (!ulbid) return;
    try {
      const response = await apiService.post("paymodeDropdown", { ulbid });
      if (response?.data?.success) {
        const data = response.data.data.map((item) => ({
          label: item.RECMODNAME,
          value: String(item.RECMODEID),
        }));
        setPaymodeOptions(data);
      }
    } catch (err) {
      console.error("paymodeDropdown error:", err);
    }
  };

  const fetchBankDropdown = async () => {
    if (!ulbid) return;
    try {
      const response = await apiService.post("BankNameDropdown", { ulbid });
      if (response?.data?.success) {
        const data = response.data.data.map((item) => ({
          label: item.BANK_NAME,
          value: String(item.BANK_ID),
        }));
        setBankOptions(data);
      }
    } catch (err) {
      console.error("BankNameDropdown error:", err);
    }
  };

  // New: Fetch pay code by payment mode (used to decide whether bank/check fields are required)
  const fetchPayCode = async (paymentModeId) => {
    if (!ulbid || !paymentModeId) {
      setPaymentPayCode(null);
      return;
    }
    try {
      const payload = { payId: Number(paymentModeId), ulbId: Number(ulbid) };
      const response = await apiService.post("GetPayCodeByPayMode", payload);

      if (
        response?.data?.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        setPaymentPayCode(response.data.data[0].VAR_RECMODE_PAYCODE);
      } else {
        setPaymentPayCode(null);
      }
    } catch (error) {
      console.error("Error fetching payment pay code:", error);
      setPaymentPayCode(null);
    }
  };

  const fetchTankDetails = async (tankrqstid, setValues) => {
    try {
      const payload = { orgId, tankrqstid };
      const response = await apiService.post("getTankDetailsByRequestId", payload);
      if (
        response?.data?.success &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const d = response.data.data[0];
        setValues((prev) => ({
          ...prev,
          ownerName: d.TANK_OWNERNAME || "",
          mobileNumber: d.TANK_MOBILE != null ? String(d.TANK_MOBILE) : prev.mobileNumber,
          email: d.TANK_EMAILID || "",
          address: d.TANK_ADDRESS || "",
          billAmount: d.NUM_BILL_TOTAL != null ? String(d.NUM_BILL_TOTAL) : prev.billAmount,
          prabhag: d.TANK_PRABHAGID != null ? String(d.TANK_PRABHAGID) : prev.prabhag,
          zone: d.TANK_ZONEID != null ? String(d.TANK_ZONEID) : prev.zone,
          numRequestTnkId: d.TANK_ID != null ? String(d.TANK_ID) : prev.numRequestTnkId,
          paidAmount: d.NUM_BILL_TOTAL != null ? String(d.NUM_BILL_TOTAL) : prev.paidAmount,
        }));

        if (d.TANK_PRABHAGID) await fetchZoneDropdown(d.TANK_PRABHAGID);

        setIsDataLoaded(true);
        setSearchStatus("BG");

        await Swal.fire({
          icon: "success",
          title: "Tank Found",
          text: "Tank details loaded successfully.",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "Tank details not found for this Bill.",
        });
      }
    } catch (error) {
      console.error("Error fetching Tank details:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching tank details.",
      });
    }
  };

  useEffect(() => {
    fetchPrabhagDropdown();
    fetchBankDropdown();
    fetchPaymodeDropdown();
  }, [ulbid]);

  const handleReset = (resetForm) => {
    setIsDataLoaded(false);
    setSearchStatus(null);
    setPaymentPayCode(null);
    resetForm({ values: { ...initialValues } });
    setZoneOptions([]);
  };

  const onSubmit = async (values, { setSubmitting, setValues, resetForm }) => {
    setIsSubmitting(true);
    try {
      // Step 1: Search Bill Details
      if (!isDataLoaded) {
        const billNo = (values.billNo || "").trim();
        if (!billNo) {
          await Swal.fire({
            icon: "warning",
            title: "Bill Number required",
            text: "Please enter a Bill Number to search.",
          });
          setIsSubmitting(false);
          setSubmitting(false);
          return;
        }

        const bgResponse = await apiService.post("GetBillDetailsByBillNoBG", { billNo });
        if (bgResponse?.data?.success && bgResponse.data.data.length > 0) {
          const bill = bgResponse.data.data[0];
          if (bill.VAR_REQUEST_STATUS === "BG") {
            setValues((prev) => ({
              ...prev,
              billAmount: bill.NUM_BILL_TOTAL != null ? String(bill.NUM_BILL_TOTAL) : prev.billAmount,
              numRequestId: bill.NUM_REQUEST_ID != null ? String(bill.NUM_REQUEST_ID) : prev.numRequestId,
              billId: bill.NUM_BILL_ID != null ? String(bill.NUM_BILL_ID) : prev.billId,
            }));

            await fetchTankDetails(bill.NUM_REQUEST_ID, setValues);
          } else {
            await Swal.fire({
              icon: "warning",
              title: "Cannot Proceed",
              text: `Bill found with status: ${bill.VAR_REQUEST_STATUS}, cannot proceed.`,
            });
          }
        } else {
          await Swal.fire({
            icon: "info",
            title: "No pending bill",
            text: "No pending bill found for this Bill Number.",
          });
        }

        setIsSubmitting(false);
        setSubmitting(false);
        return;
      }

      // Step 2: Insert Receipt
      if (searchStatus === "BG") {
        const userId = user?.userId;
        const ulb = user?.ulbId;

        const missing = [];
        if (!values.numRequestId) missing.push("numRequestId");
        if (!values.numRequestTnkId) missing.push("numRequestTnkId");
        if (!values.billId) missing.push("billId");

        // Determine whether prabhag/zone are required based on paymentPayCode
        // if paymentPayCode === "ADJ" then it's adjustment and location may not be required
        const isNonCashLike = paymentPayCode !== null && paymentPayCode !== "ADJ";
        if (isNonCashLike) {
          if (!values.prabhag) missing.push("prabhag");
          if (!values.zone) missing.push("zone");
        }

        if (missing.length > 0) {
          await Swal.fire({
            icon: "warning",
            title: "Missing required fields",
            text: `Missing required IDs for receipt insert: ${missing.join(", ")}`,
          });
          setIsSubmitting(false);
          setSubmitting(false);
          return;
        }

        // Confirmation before insert
        const confirm = await Swal.fire({
          title: "Confirm",
          text: "Are you sure you want to generate the receipt?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, generate",
        });

        if (!confirm.isConfirmed) {
          setIsSubmitting(false);
          setSubmitting(false);
          return;
        }

        const payload = {
          userid: userId,
          request_id: Number(values.numRequestId),
          tankid: Number(values.numRequestTnkId),
          billid: Number(values.billId),
          prabhagid: Number(values.prabhag || 0),
          zoneid: Number(values.zone || 0),
          refno: values.referenceNo?.trim(),
          paymode: Number(values.paymentMode),
          bankname: values.bankName,
          checkno: values.checkNo || "",
          checkdt: values.checkDate ? new Date(values.checkDate).toISOString() : null,
          recdt: values.receiptDate ? new Date(values.receiptDate).toISOString() : null,
          remark: values.remark?.trim() || "Payment received",
          amount: Number(values.paidAmount || 0),
          ulbid: Number(ulb),
          source: "WEB",
        };

        const res = await apiService.post("TankReceiptInsert", payload);

        if (res?.data?.success || (res?.data?.message && res.data.message.includes("Receipt Generated"))) {
          await Swal.fire({
            icon: "success",
            title: "Receipt Generated",
            text: res.data.message || "Receipt Generated",
          });

          const generatedRecNo = res.data.recNo || values.referenceNo;

          // Automatically generate PDF (function returns/persists file)
          try {
            await FrmRecieptGenPdf(generatedRecNo, user?.ulbId);
            await Swal.fire({
              icon: "success",
              title: "PDF Generated",
              text: "Receipt PDF has been generated.",
            });
          } catch (pdfErr) {
            console.error("PDF generation error:", pdfErr);
            await Swal.fire({
              icon: "warning",
              title: "PDF Error",
              text: "Receipt was generated but PDF creation failed.",
            });
          }

          handleReset(resetForm);
        } else {
          await Swal.fire({
            icon: "error",
            title: "Failed",
            text: res?.data?.message || "Failed to generate receipt. Please check response.",
          });
        }
      }
    } catch (error) {
      console.error("Error during submit:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while inserting receipt.",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const renderField = (
    field,
    label,
    type = "text",
    required = false,
    readOnly = false,
    isTextArea = false,
    colSpan = 1,
    isSelect = false,
    selectOptions = []
  ) => {
    const editableFields = [
      "paymentMode",
      "bankName",
      "receiptDate",
      "paidAmount",
      "referenceNo",
      "checkNo",
      "checkDate",
      "remark",
    ];
    const isLocked = readOnly || isSubmitting || (isDataLoaded && !editableFields.includes(field));

    return (
      <div className={`mb-4 col-span-${colSpan}`} key={field}>
        <Label text={`${translate(label)}:`} required={required} />
        {isSelect ? (
          <Field
            as="select"
            name={field}
            disabled={isLocked}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
          >
            <option value="">{translate("-- Select --")}</option>
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        ) : isTextArea ? (
          <Field
            as="textarea"
            name={field}
            readOnly={isLocked}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
          />
        ) : (
          <Field name={field} type={type} component={InputField} readOnly={isLocked} />
        )}
        <ErrorMessage name={field} component="div" className="text-red-500 text-xs mt-1" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full mx-auto bg-white shadow-xl rounded-lg p-6 max-w-7xl">
        <HeaderLabel text={translate("Receipt/Bill Generation")} />
        <hr className="mb-6" />

        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
          {({ resetForm, values, setFieldValue }) => {
            const showReceiptForm = isDataLoaded && searchStatus === "BG";

            // Determine if bank/check details required based on paymentPayCode
            const requiresBankDetails = paymentPayCode !== null && paymentPayCode !== "ADJ";

            return (
              <Form>
                {/* Bill Search */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
                  <div className="flex flex-wrap items-end gap-x-4">
                    <div className="w-full sm:w-1/4  sm:mb-0">
                      <Label text={translate("Bill Number:")} required />
                      <Field
                        name="billNo"
                        component={InputField}
                        placeholder="Enter Bill Number"
                        readOnly={isDataLoaded}
                      />
                      <ErrorMessage name="billNo" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="w-full sm:w-auto">
                      <Button
                        type={isDataLoaded ? "button" : "submit"}
                        text={translate(isDataLoaded ? "New Search" : "Search")}
                        disabled={isSubmitting}
                        onClick={isDataLoaded ? () => handleReset(resetForm) : null}
                        className={
                          isDataLoaded ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Form */}
                {showReceiptForm && (
                  <>
                    {/* Customer Info */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-blue-200">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {translate("Customer Information")}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                        {renderField("ownerName", "Owner Name", "text", true)}
                        {renderField("mobileNumber", "Mobile Number", "text", true)}
                        {renderField("email", "Email", "email")}
                        {renderField("billAmount", "Bill Amount", "number", true)}
                        {renderField("address", "Address", "text", true, false, true, 3)}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-green-200">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {translate("Payment & Receipt Details")}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                        {renderField(
                          "prabhag",
                          "Prabhag",
                          "text",
                          true,
                          false,
                          false,
                          1,
                          true,
                          prabhagOptions
                        )}
                        {renderField("zone", "Zone", "text", true, false, false, 1, true, zoneOptions)}

                        {/* Payment Mode select with onChange that fetches pay code */}
                        <div className="mb-4 col-span-1">
                          <Label text={`${translate("Payment Mode")}:`} required />
                          <Field
                            as="select"
                            name="paymentMode"
                            value={values.paymentMode}
                            onChange={async (e) => {
                              const val = e.target.value;
                              setFieldValue("paymentMode", val);
                              // Fetch pay code for this payment mode
                              await fetchPayCode(val);
                            }}
                            disabled={isSubmitting}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                          >
                            <option value="">{translate("-- Select --")}</option>
                            {paymodeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="paymentMode" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Bank Name - disabled if not required */}
                        <div className="mb-4 col-span-1">
                          <Label text={`${translate("Bank Name")}:`} required={false} />
                          <Field
                            as="select"
                            name="bankName"
                            disabled={isSubmitting || (isDataLoaded && !requiresBankDetails)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                          >
                            <option value="">{translate("-- Select --")}</option>
                            {bankOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="bankName" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Receipt Date using CalendarIcon */}
                        <div className="mb-4 col-span-1">
                          <Label text={`${translate("Receipt Date")}:`} required />
                          <CalendarIcon
                            selectedDate={values.receiptDate}
                            setSelectedDate={(date) => setFieldValue("receiptDate", date)}
                            placeholder="Select date"
                          />
                          <ErrorMessage name="receiptDate" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {renderField("paidAmount", "Paid Amount", "number", true)}

                        {/* Check Date using CalendarIcon (conditionally enabled) */}
                        <div className="mb-4 col-span-1">
                          <Label text={`${translate("Check Date")}:`} required={false} />
                          <CalendarIcon
                            selectedDate={values.checkDate}
                            setSelectedDate={(date) => setFieldValue("checkDate", date)}
                            placeholder="Select check date"
                            
                          />
                          <ErrorMessage name="checkDate" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Check Number */}
                        <div className="mb-4 col-span-1">
                          <Label text={`${translate("Check Number")}:`} required={false} />
                          <Field
                            name="checkNo"
                            component={InputField}
                            readOnly={isSubmitting || (isDataLoaded && !requiresBankDetails)}
                          />
                          <ErrorMessage name="checkNo" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {renderField("referenceNo", "Reference Number")}
                        {renderField("remark", "Remark", "text", false, false, true, 3)}
                      </div>

                      <div className="mt-6 flex justify-end gap-4">
                        <SaveButton text={translate("Submit")} disabled={isSubmitting} type="submit" />
                      </div>
                    </div>
                  </>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default FrmRecieptGen;
