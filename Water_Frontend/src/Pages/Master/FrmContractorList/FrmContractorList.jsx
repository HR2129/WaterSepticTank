// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import Table from "../../../Components/Table/Table";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";
// import { useMasterData } from "../../../Context/MasterDataContext"; // ✅ shared context

// function FrmContractorList() {
//   const { translate } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { setSelectedContractor, clearAllSelected } = useMasterData();

//   const [contractorList, setContractorList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const headers = [
//     "Contractor ID",
//     "Contractor Name",
//     "Mobile No",
//     "Address",
//     "Status",
//     "Insert Date",
//     "Actions",
//   ];

//   const keyMapping = {
//     "Contractor ID": "CONTRACTORID",
//     "Contractor Name": "CONTRACTORNAME",
//     "Mobile No": "CONTRACTORMOBNO",
//     Address: "CONTRACTORADDRESS",
//     Status: "STATUS",
//     "Insert Date": "CONTRACTORINSDATE",
//     Actions: "actions",
//   };

//   // 🧩 Fetch Contractor List
//   useEffect(() => {
//     const fetchContractorList = async () => {
//       console.group("📡 FetchContractorList API");
//       try {
//         setLoading(true);
//         const payload = { orgId: user?.ulbId || 890 };
//         console.log("➡️ Request Payload:", payload);

//         const response = await apiService.post("GetContractorListDtls", payload);
//         console.log("✅ Raw Response:", response);

//         const data =
//           response?.data?.data ||
//           response?.data ||
//           response?.data?.Table ||
//           [];
//         setContractorList(Array.isArray(data) ? data : []);
//         console.log("📋 Contractor Records:", data.length);
//       } catch (err) {
//         console.error("❌ Error Fetching Contractors:", err);
//         setContractorList([]);
//       } finally {
//         setLoading(false);
//         console.groupEnd();
//       }
//     };

//     fetchContractorList();
//   }, [user?.ulbId]);

//   // ✏️ Edit handler — fetch contractor details by ID and store in context
//   const handleEditClick = async (row) => {
//     console.group("✏️ Edit Contractor");
//     console.log("Clicked Row:", row);

//     try {
//       const payload = {
//         contractorid: row.CONTRACTORID,
//         orgId: user?.ulbId || 890,
//       };
//       console.log("📤 Fetching Contractor by ID:", payload);

//       const response = await apiService.post("GetContractorById", payload);
//       console.log("📥 API Response:", response);

//       if (response?.data?.success && response.data.data) {
//         const detailed = response.data.data;
//         console.log("✅ Full Contractor Data:", detailed);

//         setSelectedContractor(detailed);
//         navigate("/Masters/FrmContractorMst.aspx");
//       } else {
//         alert("⚠️ Unable to fetch contractor details");
//       }
//     } catch (err) {
//       console.error("🚨 Error fetching contractor by ID:", err);
//       alert("❌ Failed to load contractor details");
//     } finally {
//       console.groupEnd();
//     }
//   };

//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel text={translate("Contractor Master")} />
//         <hr className="mb-4" />

//         <div className="card shadow-sm p-3 rounded-3">
//           {/* Add Button */}
//           <div className="d-flex justify-content-end mb-3">
//             <SaveButton
//               type="button"
//               text={translate("नवीन जोडा")}
//               onClick={() => {
//                 clearAllSelected();
//                 console.log("🆕 Add New Contractor Clicked");
//                 navigate("/Masters/FrmContractorMst.aspx");
//               }}
//             />
//           </div>

//           {/* Table */}
//           <div className="table-responsive">
//             {loading ? (
//               <p className="text-center my-3">⏳ Loading contractors...</p>
//             ) : contractorList.length > 0 ? (
//               <Table
//                 headers={headers}
//                 data={contractorList}
//                 keyMapping={keyMapping}
//                 customRenderers={{
//                   Actions: (row) => (
//                     <button
//                       className="btn btn-sm btn-primary"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleEditClick(row);
//                       }}
//                     >
//                       {translate("Edit")}
//                     </button>
//                   ),
//                 }}
//                 noDataMessage="No contractor records found."
//               />
//             ) : (
//               <p className="text-center text-muted">
//                 ⚠️ No contractor data available.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FrmContractorList;



import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import Table from "../../../Components/Table/Table";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { Pencil } from "lucide-react";
import { useMasterData } from "../../../Context/MasterDataContext";

function FrmContractorList() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedContractor, clearAllSelected } = useMasterData();

  const [contractorList, setContractorList] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = ["Name", "Mobile No.", "Address", "Flag", "Actions"];

  const keyMapping = {
    Name: "CONTRACTORNAME",
    "Mobile No.": "CONTRACTORMOBNO",
    Address: "CONTRACTORADDRESS",
    Flag: "FLAG",
    Actions: "actions",
  };

  const customRenderers = {
    Flag: (row) => (
      <span
        className={`badge px-3 py-2 fw-semibold rounded-pill ${
          row.FLAG === "Active" ? "bg-success" : "bg-danger"
        }`}
      >
        {row.FLAG === "Active" ? translate("Active") : translate("Inactive")}
      </span>
    ),

    Actions: (row) => (
      <button
        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: "32px", height: "32px", padding: 0 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleEditClick(row);
        }}
      >
        <Pencil size={16} />
      </button>
    ),
  };

  const fetchContractorList = async () => {
    try {
      setLoading(true);
      const payload = { orgId: parseInt(user?.ulbId || 890) };
      const response = await apiService.post("GetContractorListDtls", payload);

      let data =
        response?.data?.data ||
        response?.data ||
        response?.data?.Table ||
        [];

      setContractorList(Array.isArray(data) ? data : []);
    } catch {
      setContractorList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (row) => {
    try {
      const payload = {
        contractorid: row.CONTRACTORID,
        orgId: user?.ulbId || 890,
      };

      const res = await apiService.post("GetContractorById", payload);
      if (res?.data?.success && res.data.data) {
        setSelectedContractor(res.data.data);
        navigate("/Masters/FrmContractorMst");
      }
    } catch {}
  };

  useEffect(() => {
    fetchContractorList();
  }, [user?.ulbId, location.state?.refresh]);

  return (
    <div className="main-wrapper">
      <div className="container mt-4">

        <div className="card shadow-sm rounded-3 p-3">

          {/* FIXED HEADER SECTION */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <HeaderLabel text={translate("Contractor Master")} />

            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => {
                clearAllSelected();
                navigate("/Masters/FrmContractorMst");
              }}
            >
              <i className="bi bi-plus-lg"></i> {translate("Add New")}
            </button>
          </div>

          {/* ⭐ TABLE SECTION (ONLY THIS SCROLLS HORIZONTALLY) */}
          <div className="overflow-x-auto w-full" style={{ minWidth: "100%" }}>
            {loading ? (
              <p className="text-center my-3">⏳ Loading contractors...</p>
            ) : contractorList.length > 0 ? (
              <Table
                headers={headers}
                data={contractorList}
                keyMapping={keyMapping}
                customRenderers={customRenderers}
                noDataMessage={translate("No contractor data available.")}
              />
            ) : (
              <p className="text-center text-muted my-3">
                ⚠️ {translate("No data available.")}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FrmContractorList;

