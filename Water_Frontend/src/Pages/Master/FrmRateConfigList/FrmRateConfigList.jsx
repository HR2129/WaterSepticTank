// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";
// import { useMasterData } from "../../../Context/MasterDataContext";

// function FrmRateConfigList() {
//   const { translate } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { setSelectedRate } = useMasterData();

//   const [rateList, setRateList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🟢 EDIT HANDLER
//   const handleEditClick = async (row) => {
//     console.group("🖱️ Edit Button Clicked");
//     console.log("Clicked row data:", row);
//     console.log("User ULB ID:", user?.ulbId);

//     try {
//       const payload = {
//         rateId: row.RATE_ID,
//         orgId: parseInt(user?.ulbId),
//       };

//       console.log("📤 Sending API Request:", payload);
//       const response = await apiService.post("GetRateById", payload);
//       console.log("📥 API Response:", response);

//       const rateDetails = response?.data?.data;
//       console.log("🧾 Parsed Rate Details:", rateDetails);

//       if (!rateDetails) {
//         alert("⚠️ No rate details found.");
//         console.groupEnd();
//         return;
//       }

//       setSelectedRate(rateDetails);
//       console.log("✅ Stored rate details in context. Navigating...");
//       navigate("/Masters/FrmRateConfigMst.aspx");
//     } catch (error) {
//       console.error("❌ Error fetching rate details:", error);
//       alert("Failed to fetch rate details. Please try again.");
//     } finally {
//       console.groupEnd();
//     }
//   };

//   // 🟣 Fetch Rate Config List
//   const fetchRateList = async () => {
//     console.group("📡 FetchRateList");
//     if (!user?.ulbId) {
//       console.warn("⚠️ No ULB ID found — skipping fetch");
//       console.groupEnd();
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = { orgid: parseInt(user.ulbId) };
//       console.log("➡️ Fetch payload:", payload);

//       const response = await apiService.post("GetRateListDtls", payload);
//       console.log("✅ API Response:", response);

//       let list = [];
//       if (Array.isArray(response?.data?.data)) list = response.data.data;
//       else if (Array.isArray(response?.data)) list = response.data;
//       else if (response?.data?.Table) list = response.data.Table;

//       console.log("📋 Rate list length:", list.length);
//       setRateList(list);
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       setRateList([]);
//     } finally {
//       setLoading(false);
//       console.groupEnd();
//     }
//   };

//   useEffect(() => {
//     console.log("🔁 useEffect triggered — user.ulbId:", user?.ulbId);
//     if (user?.ulbId) fetchRateList();
//   }, [user?.ulbId]);

//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel text={translate("Rate Config Master")} />
//         <hr className="mb-4" />

//         <div className="card shadow-sm p-3 rounded-3">
//           <div className="d-flex justify-content-end mb-3">
//             <SaveButton
//               type="button"
//               text={translate("नवीन जोडा")}
//               onClick={() => {
//                 console.log("➕ Add New clicked — clearing selectedRate");
//                 setSelectedRate(null);
//                 navigate("/Masters/FrmRateConfigMst.aspx");
//               }}
//             />
//           </div>

//           <div className="table-responsive">
//             {loading ? (
//               <p className="text-center my-3">⏳ Loading...</p>
//             ) : rateList.length > 0 ? (
//               <table className="table table-bordered table-hover">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Rate ID</th>
//                     <th>Rate Type</th>
//                     <th>Slab From</th>
//                     <th>Slab To</th>
//                     <th>Rate Amount</th>
//                     <th>Flag</th>
//                     <th>Insert Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rateList.map((row, index) => (
//                     <tr key={index}>
//                       <td>{row.RATE_ID}</td>
//                       <td>{row.RATE_TYPE}</td>
//                       <td>{row.RATE_SLABFROM}</td>
//                       <td>{row.RATE_SLABTO}</td>
//                       <td>{row.RATE_AMOUNT}</td>
//                       <td>{row.FLAG}</td>
//                       <td>{row.RATE_INSDATE}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-primary"
//                           onClick={() => {
//                             console.log("🖱️ Edit button clicked for Rate ID:", row.RATE_ID);
//                             handleEditClick(row);
//                           }}
//                         >
//                           {translate("Edit")}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-center my-3 text-muted">⚠️ No data available.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FrmRateConfigList;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { useMasterData } from "../../../Context/MasterDataContext";
import { Pencil } from "lucide-react";

function FrmRateConfigList() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setSelectedRate } = useMasterData();

  const [rateList, setRateList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟣 Fetch Rate Config List
  const fetchRateList = async () => {
    console.group("📡 FetchRateList");
    if (!user?.ulbId) {
      console.warn("⚠️ No ULB ID found — skipping fetch");
      console.groupEnd();
      return;
    }

    try {
      setLoading(true);
      const payload = { orgid: parseInt(user.ulbId) };
      console.log("➡️ Fetch payload:", payload);

      const response = await apiService.post("GetRateListDtls", payload);
      console.log("✅ API Response:", response);

      let list = [];
      if (Array.isArray(response?.data?.data)) list = response.data.data;
      else if (Array.isArray(response?.data)) list = response.data;
      else if (response?.data?.Table) list = response.data.Table;

      setRateList(list || []);
      console.log("📋 Rate list length:", list.length);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setRateList([]);
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  // 🟢 Edit Handler
  const handleEditClick = async (row) => {
    console.group("🖱️ Edit Button Clicked");
    try {
      const payload = {
        rateId: row.RATE_ID,
        orgId: parseInt(user?.ulbId),
      };

      console.log("📤 Sending API Request:", payload);
      const response = await apiService.post("GetRateById", payload);
      const rateDetails = response?.data?.data;

      if (!rateDetails) {
        alert("⚠️ No rate details found.");
        return;
      }

      setSelectedRate(rateDetails);
      navigate("/Masters/FrmRateConfigMst");
    } catch (error) {
      console.error("❌ Error fetching rate details:", error);
      alert("Failed to fetch rate details. Please try again.");
    } finally {
      console.groupEnd();
    }
  };

  useEffect(() => {
    if (user?.ulbId) fetchRateList();
  }, [user?.ulbId]);

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        {/* Header */}
        <div className="card shadow-sm rounded-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <HeaderLabel text={translate("Rate Config Master")} />
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => {
                setSelectedRate(null);
                navigate("/Masters/FrmRateConfigMst");
              }}
            >
              <i className="bi bi-plus-lg"></i> {translate("Add New")}
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive">
            {loading ? (
              <p className="text-center my-3">⏳ Loading rate configurations...</p>
            ) : rateList.length > 0 ? (
              <table className="table table-bordered align-middle">
                <thead
                  style={{
                    backgroundColor: "#d9e6f2",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                  }}
                >
                  <tr>
                    <th>{translate("Rate Type")}</th>
                    <th>{translate("Slab From")}</th>
                    <th>{translate("Slab To")}</th>
                    <th>{translate("Amount")}</th>
                    <th>{translate("Flag")}</th>
                    <th>{translate("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rateList.map((rate, idx) => (
                    <tr key={idx}>
                      <td>{rate.RATE_TYPE || "-"}</td>
                      <td>{rate.RATE_SLABFROM || "-"}</td>
                      <td>{rate.RATE_SLABTO || "-"}</td>
                      <td>{rate.RATE_AMOUNT || "-"}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 fw-semibold rounded-pill ${
                            rate.FLAG === "Active" || rate.FLAG === "Y"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {rate.FLAG === "Active" || rate.FLAG === "Y"
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
                            handleEditClick(rate);
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
                ⚠️ {translate("No rate configurations found.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrmRateConfigList;
