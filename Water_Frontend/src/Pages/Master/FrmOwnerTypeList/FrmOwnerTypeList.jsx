// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import Table from "../../../Components/Table/Table";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";

// function FrmOwnerTypeList() {
//   const { translate } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [ownerTypeList, setOwnerTypeList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Define table headers
//   const headers = [
//     "Ownership Type ID",
//     "Ownership Type Name",
//     "Flag",
//     "Status",
//     "Insert Date",
//     "Actions",
//   ];

//   // ✅ Key mapping
//   const keyMapping = {
//     "Ownership Type ID": "OWNERSHIPTYPEID",
//     "Ownership Type Name": "OWNERTYPENAME",
//     Flag: "FLAG",
//     Status: "STATUS",
//     "Insert Date": "OWNERTYINSDATE",
//     Actions: "actions",
//   };

//   // ✅ Custom renderers for edit
//   const customRenderers = {
//     Actions: (row) => (
//       <div onClick={(e) => e.stopPropagation()}>
//         <button
//           className="btn btn-sm btn-primary"
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             console.log("✏️ Edit clicked:", row);
//             navigate("/Masters/FrmOwnerTypeMst.aspx", {
//               state: { ownerTypeData: row },
//             });
//           }}
//         >
//           {translate("Edit")}
//         </button>
//       </div>
//     ),
//   };

//   // ✅ Fetch data from API
//   useEffect(() => {
//     const fetchOwnerTypes = async () => {
//       console.group("📡 API DEBUG LOG — GetOwnershiptypeListDtls");
//       try {
//         setLoading(true);
//         const payload = { orgId: user?.ulbId || 890 };
//         console.log("➡️ Request Payload:", payload);

//         const response = await apiService.post("GetOwnershiptypeListDtls", payload);
//         console.log("✅ Raw API Response:", response);

//         if (Array.isArray(response?.data?.data)) {
//           console.log("✅ Extracted list:", response.data.data);
//           setOwnerTypeList(response.data.data);
//         } else if (Array.isArray(response?.data)) {
//           setOwnerTypeList(response.data);
//         } else {
//           console.warn("⚠️ Unexpected API format:", response);
//           setOwnerTypeList([]);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching ownership types:", error);
//         setOwnerTypeList([]);
//       } finally {
//         setLoading(false);
//         console.groupEnd();
//       }
//     };

//     fetchOwnerTypes();
//   }, [user?.ulbId]);

//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel text={translate("Ownership Types")} />
//         <hr className="mb-4" />

//         <div className="card shadow-sm p-3 rounded-3">
//           {/* Add New Button */}
//           <div className="d-flex justify-content-end mb-3">
//             <SaveButton
//               type="button"
//               text={translate("नवीन जोडा")}
//               onClick={() => navigate("/Masters/FrmOwnerTypeMst.aspx")}
//             />
//           </div>

//           {/* Table Section */}
//           <div className="table-responsive">
//             {loading ? (
//               <p className="text-center my-3">⏳ Loading ownership types...</p>
//             ) : ownerTypeList.length > 0 ? (
//               <Table
//                 headers={headers}
//                 data={ownerTypeList}
//                 keyMapping={keyMapping}
//                 customRenderers={customRenderers}
//                 noDataMessage="No ownership records found."
//               />
//             ) : (
//               <p className="text-center my-3 text-muted">
//                 ⚠️ No ownership data available.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FrmOwnerTypeList;


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import Table from "../../../Components/Table/Table";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { Pencil } from "lucide-react";

function FrmOwnerTypeList() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [ownerTypeList, setOwnerTypeList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Table headers (same clean layout)
  const headers = ["Ownership Type Name", "Flag", "Actions"];

  // ✅ Key mapping
  const keyMapping = {
    "Ownership Type Name": "OWNERTYPENAME",
    Flag: "FLAG",
    Actions: "actions",
  };

  // ✅ Custom renderers for Flag + Actions
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
        style={{
          width: "32px",
          height: "32px",
          padding: 0,
          borderWidth: "1.5px",
        }}
        title={translate("Edit")}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("✏️ Edit clicked:", row);
          navigate("/Masters/FrmOwnerTypeMst", {
            state: { ownerTypeData: row },
          });
        }}
      >
        <Pencil size={16} />
      </button>
    ),
  };

  // ✅ Fetch data from API
  const fetchOwnerTypes = async () => {
    try {
      setLoading(true);
      const payload = { orgId: parseInt(user?.ulbId || 890) };
      console.log("📡 Fetching Ownership Types:", payload);

      const response = await apiService.post("GetOwnershiptypeListDtls", payload);
      console.log("✅ API Response:", response);

      let list = [];

      if (Array.isArray(response?.data?.data)) list = response.data.data;
      else if (Array.isArray(response?.data)) list = response.data;
      else if (response?.data?.Table) list = response.data.Table;

      setOwnerTypeList(list);
    } catch (error) {
      console.error("❌ Error fetching ownership types:", error);
      setOwnerTypeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerTypes();
  }, [user?.ulbId, location.state?.refresh]);

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <div className="card shadow-sm rounded-3 p-3">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <HeaderLabel text={translate("Ownership Types")} />
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/Masters/FrmOwnerTypeMst")}
            >
              <i className="bi bi-plus-lg"></i> {translate("Add New")}
            </button>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            {loading ? (
              <p className="text-center my-3">⏳ Loading ownership types...</p>
            ) : ownerTypeList.length > 0 ? (
              <Table
                headers={headers}
                data={ownerTypeList}
                keyMapping={keyMapping}
                customRenderers={customRenderers}
                noDataMessage={translate("No ownership types found.")}
              />
            ) : (
              <p className="text-center my-3 text-muted">
                ⚠️ {translate("No data available.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrmOwnerTypeList;
