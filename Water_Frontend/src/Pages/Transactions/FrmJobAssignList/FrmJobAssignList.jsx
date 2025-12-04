import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";

function FrmJobAssignList() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orgId, setOrgId] = useState(null);
  const [tankRequests, setTankRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get orgId
  useEffect(() => {
    if (user?.ulbId) {
      setOrgId(parseInt(user.ulbId));
    } else {
      const storedId = localStorage.getItem("ulbId");
      if (storedId) setOrgId(parseInt(storedId));
    }
  }, [user]);

  // Fetch Tank Requests
  useEffect(() => {
    if (!orgId) return;
    const fetchTankRequests = async () => {
      try {
        setLoading(true);
        const payload = { orgId, status: "IA" };
        const response = await apiService.post("GetTankRequests", payload);
        
        const data = response?.data?.data || [];
        console.log("response:",response)
        console.log("payload:",payload)

        const formatted = data.map((item) => ({
          requestID: item.REQSTID,
          requestNo: item.VAR_REQUEST_NO,
          tankNo: item.TANK_NO,
          ownerName: item.TANK_OWNERNAME,
          mobile: item.TANK_MOBILE,
          tankType: item.TYPENAME,
          serviceType: item.SERVTYPE_NAME,
          address: item.TANK_ADDRESS,
          status: item.REQUEST_STATUS,
        }));

        setTankRequests(formatted);
      } catch (error) {
        console.error("Error:", error);
        alert(translate("Failed to load tank requests."));
      } finally {
        setLoading(false);
      }
    };

    fetchTankRequests();
  }, [orgId]);

  const headers = [
    "Request No",
    "Tank No",
    "Owner Name",
    "Mobile",
    "Tank Type",
    "Service Type",
    "Address",
    "Status",
    "Actions",
  ];

  const keyMapping = {
    "Request No": "requestNo",
    "Tank No": "tankNo",
    "Owner Name": "ownerName",
    Mobile: "mobile",
    "Tank Type": "tankType",
    "Service Type": "serviceType",
    Address: "address",
    Status: "status",
    Actions: "actions",
  };

  return (
    <div className="main-wrapper">
      <div className="max-w-7xl mx-auto mt-4">
        <HeaderLabel text={translate("Job Assignment List")} />
        <hr className="my-3" />

        <Formik initialValues={{}}>
          {() => (
            <Form>
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
                              {translate(h)}
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
                              {translate("Loading...")}
                            </td>
                          </tr>
                        ) : tankRequests.length === 0 ? (
                          <tr>
                            <td
                              colSpan={headers.length}
                              className="text-center py-6 text-gray-500 text-sm italic"
                            >
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-lg font-semibold text-gray-700">
                                  {translate("No Records Found")}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                  {translate("No tank requests available.")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          tankRequests.map((row, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              {headers.map((h) => (
                                <td
                                  key={h}
                                  className="px-3 py-2 text-sm text-gray-700 min-w-[120px] whitespace-normal align-top"
                                >
                                  {h === "Actions" ? (
                                    <button
                                      type="button"
                                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 whitespace-nowrap"
                                      onClick={() =>
                                        navigate(
                                          `/Transaction/FrmJobAssignMst?tankrqstid=${row.requestID}`
                                        )
                                      }
                                    >
                                      {translate("View")}
                                    </button>
                                  ) : (
                                    row[keyMapping[h]] ?? "-"
                                  )}
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmJobAssignList;
