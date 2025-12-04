import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderLabel from "../../Components/HeaderLabel/HeaderLabel";
import apiService from "../../../apiService";
import { useLanguage } from "../../Context/LanguageProvider";
import { useAuth } from "../../Context/AuthContext";

function TransactionList() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // 1,2,3 from URL

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const orgId = Number(user?.ulbId) || 890;

  const pageTitles = {
    "1": "Assign For Inspection",
    "2": "Inspection Entry",
    "3": "Cleaning Execution",
  };

  const headers = [
    "Tank No",
    "Owner Name",
    "Mobile No.",
    "Address",
    "Request No",
    "Date",
    "Service Type",
    "Remark",
    "Request Status",
    "Actions",
  ];

  const keyMapping = {
    "Tank No": "TANK_NO",
    "Owner Name": "TANK_OWNERNAME",
    "Mobile No.": "TANK_MOBILE",
    Address: "TANK_ADDRESS",
    "Request No": "VAR_REQUEST_NO",
    Date: "DAT_REQUEST_DATE",
    "Service Type": "SERVTYPE_NAME",
    Remark: "VAR_REQUEST_REMARK",
    "Request Status": "REQUEST_STATUS",
    Actions: "actions",
  };

  const resolveApi = () => {
    const statusMap = { "1": "R", "2": "AI", "3": "JA" };
    return {
      endpoint: "GetTankRequests",
      payload: { orgId, status: statusMap[id] },
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
  };

  const fetchData = async () => {
    console.log("🔵 fetchData() CALLED. Mode (id):", id);
    try {
      setLoading(true);
      const { endpoint, payload } = resolveApi();
      console.log("🔵 API Calling:", endpoint, "Payload:", payload);
      const response = await apiService.post(endpoint, payload);
      const result = response?.data?.data || [];
      console.log("🟢 API RESPONSE (List):", result);

      const updated = result.map((item) => ({
        ...item,
        DAT_REQUEST_DATE: formatDate(item.DAT_REQUEST_DATE),
        actions: (
          <button
            type="button"
            className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              console.log("🟦 View Button Clicked:", item);
              console.log("🟦 requestId:", item.REQSTID);
              console.log("🟦 mode/id from URL:", id);

              // ⭐ ENSURE mode is a string ("1","2","3")
              const mode = String(id);

              let targetPath = "";

              // ⭐ Combined component for Assign (1) + Inspection (2)
              if (mode === "1" || mode === "2") {
                targetPath = "/Transaction/FrmAssignInspectionCombined";
              }

              // ⭐ Cleaning separate screen
              else if (mode === "3") {
                targetPath = "/Transaction/FrmCleaningExecution";
              }

              else {
                console.error("❌ Unknown ID:", mode);
                return;
              }

              console.log("🚀 Navigating To:", targetPath);

              navigate(targetPath, {
                state: {
                  requestId: item.REQSTID,
                  summary: item,
                  mode,  // ⭐ Sending mode correctly
                },
              });
            }}

          >
            {translate("View")}
          </button>
        ),
      }));
      console.log("🟢 Final Table Rows:", updated);
      setData(updated);
    } catch (err) {
      console.error("🔴 ERROR FETCHING LIST:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔵 useEffect Triggered. id:", id, "orgId:", orgId);
    fetchData();
  }, [id, user?.ulbId]);

  return (
    <div className="main-wrapper">
      <div className="max-w-7xl mx-auto mt-4">
        <HeaderLabel text={translate(pageTitles[id] || "")} />
        <hr className="my-3" />
        <div className="w-full overflow-hidden">
          <div className="inline-block min-w-full max-lg:w-[375px]">
            <div className="overflow-x-auto bg-white max-md:w-[375px]">
              <table className="w-full border-collapse table-auto">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="text-center py-4 text-gray-600 text-sm"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    // ⭐ Fallback UI if no data
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="text-center py-6 text-gray-500 text-sm italic"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold text-gray-700">
                            No Records Found
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            No tank requests available for this section.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        {headers.map((h) => (
                          <td
                            key={h}
                            className="px-3 py-2 text-sm text-gray-700 min-w-[120px] whitespace-normal align-top"
                          >
                            {row[keyMapping[h]] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TransactionList;

