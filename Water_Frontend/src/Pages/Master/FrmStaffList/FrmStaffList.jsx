// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";
// import { useMasterData } from "../../../Context/MasterDataContext.jsx"; // ✅ using your updated context

// function FrmStaffList() {
//   const { translate } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { setSelectedStaff, clearAllSelected } = useMasterData();

//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🟢 Fetch Staff List
//   useEffect(() => {
//     const fetchStaffList = async () => {
//       console.group("📡 API DEBUG LOG — FetchStaffList");
//       try {
//         setLoading(true);

//         const payload = { orgId: user?.ulbId || 890 };
//         console.log("➡️ Request Payload:", payload);

//         const response = await apiService.post("GetStaffListDtls", payload);
//         console.log("✅ Raw API Response:", response);

//         let dataList = [];
//         if (Array.isArray(response?.data?.data)) dataList = response.data.data;
//         else if (Array.isArray(response?.data)) dataList = response.data;
//         else if (response?.data?.Table) dataList = response.data.Table;
//         else console.warn("⚠️ Unexpected API format:", response?.data);

//         setStaffList(dataList || []);
//         console.log("🏁 Fetch complete. Total records:", dataList.length);
//       } catch (error) {
//         console.error("❌ Error fetching staff list:", error);
//         setStaffList([]);
//       } finally {
//         setLoading(false);
//         console.groupEnd();
//       }
//     };

//     fetchStaffList();
//   }, [user]);

//   // 🟢 Handle Edit Click
//   const handleEditClick = (row) => {
//     console.group("🖱️ Edit Staff Clicked");
//     console.log("Selected Row:", row);

//     // Store in shared context
//     setSelectedStaff(row);
//     console.log("✅ Stored staff in context. Navigating to edit form...");

//     navigate("/Masters/FrmStaffMst.aspx");
//     console.groupEnd();
//   };

//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel text={translate("Staff Master")} />
//         <hr className="mb-4" />

//         <div className="card shadow-sm p-3 rounded-3">
//           {/* Header Actions */}
//           <div className="d-flex justify-content-end mb-3">
//             <SaveButton
//               type="button"
//               text={translate("नवीन जोडा")}
//               onClick={() => {
//                 console.log("🆕 Add New Staff Clicked");
//                 clearAllSelected(); // clear old data before new entry
//                 navigate("/Masters/FrmStaffMst.aspx");
//               }}
//             />
//           </div>

//           {/* Table Section */}
//           <div className="table-responsive">
//             {loading ? (
//               <p className="text-center my-3">⏳ Loading staff records...</p>
//             ) : staffList.length > 0 ? (
//               <table className="table table-bordered table-striped align-middle text-center">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Staff ID</th>
//                     <th>Staff Name</th>
//                     <th>Code</th>
//                     <th>Mobile</th>
//                     <th>Address</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {staffList.map((staff, idx) => (
//                     <tr key={idx}>
//                       <td>{staff.STAFFID}</td>
//                       <td>{staff.STAFFNAME}</td>
//                       <td>{staff.STAFFCODE}</td>
//                       <td>{staff.STAFFMOBNO}</td>
//                       <td>{staff.STAFFADDRESS}</td>
//                       <td>{staff.STATUS}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-primary"
//                           onClick={() => handleEditClick(staff)}
//                         >
//                           ✏️ Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-center my-3 text-muted">
//                 ⚠️ No staff data available.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FrmStaffList;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { useMasterData } from "../../../Context/MasterDataContext.jsx";
import { Pencil } from "lucide-react";

function FrmStaffList() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setSelectedStaff, clearAllSelected } = useMasterData();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch Staff List
  useEffect(() => {
    const fetchStaffList = async () => {
      console.group("📡 FetchStaffList API Log");
      try {
        setLoading(true);
        const payload = { orgId: user?.ulbId || 890 };
        console.log("➡️ Request Payload:", payload);

        const response = await apiService.post("GetStaffListDtls", payload);
        console.log("✅ Raw Response:", response);

        let dataList = [];
        if (Array.isArray(response?.data?.data)) dataList = response.data.data;
        else if (Array.isArray(response?.data)) dataList = response.data;
        else if (response?.data?.Table) dataList = response.data.Table;

        setStaffList(dataList || []);
        console.log("🏁 Staff Records Fetched:", dataList.length);
      } catch (error) {
        console.error("❌ Error fetching staff list:", error);
        setStaffList([]);
      } finally {
        setLoading(false);
        console.groupEnd();
      }
    };

    fetchStaffList();
  }, [user?.ulbId]);

  // 🟢 Edit Button Click
  const handleEditClick = (row) => {
    console.group("🖱️ Edit Staff Clicked");
    console.log("Selected Staff Row:", row);
    setSelectedStaff(row);
    navigate("/Masters/FrmStaffMst");
    console.groupEnd();
  };

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <div className="card shadow-sm rounded-3 p-3">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <HeaderLabel text={translate("Staff Master")} />
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => {
                clearAllSelected();
                navigate("/Masters/FrmStaffMst");
              }}
            >
              <i className="bi bi-plus-lg"></i> {translate("Add New")}
            </button>
          </div>

          {/* ✅ Table */}
          <div className="table-responsive">
            {loading ? (
              <p className="text-center my-3">⏳ Loading staff records...</p>
            ) : staffList.length > 0 ? (
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>{translate("Name")}</th>
                    <th>{translate("Mobile No.")}</th>
                    <th>{translate("Address")}</th>
                    <th>{translate("Flag")}</th>
                    <th>{translate("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff, idx) => (
                    <tr key={idx}>
                      <td>{staff.STAFFNAME || "-"}</td>
                      <td>{staff.STAFFMOBNO || "-"}</td>
                      <td>{staff.STAFFADDRESS || "-"}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 fw-semibold rounded-pill ${
                            staff.STATUS === "Y" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {staff.STATUS === "Y"
                            ? translate("Active")
                            : translate("Inactive")}
                        </span>
                      </td>
                      <td>
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
                            handleEditClick(staff);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted my-3">
                ⚠️ {translate("No staff records available.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrmStaffList;
