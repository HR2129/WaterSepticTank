import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
import Table from "../../../Components/Table/Table";
import apiService from "../../../../apiService"; // ✅ Use your existing apiService

const CitizenApplicationUpdates = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract reqId from URL query params
  const queryParams = new URLSearchParams(location.search);
  const reqIdFromUrl = queryParams.get("reqId");

  const [applicationNo, setApplicationNo] = useState("RQMBMC000020");
  const [filteredData, setFilteredData] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Function to format date/time nicely
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // ✅ Fetch application tracking data
  const fetchTrackingData = async (appNo) => {
    setLoading(true);
    try {
      const response = await apiService.post("getApplicationTracking", {
        OrgId: 890,
        RequestId: parseInt(reqIdFromUrl),
      });

      if (response.data?.success && response.data?.data?.length > 0) {
        const apiData = response.data.data;

        // ✅ Convert API data for Table
        const mapped = apiData.map((item) => ({
          step: item.STEP,
          description: item.DESCRIPTION || "",
          status: (
            <span
              className={`badge ${
                item.STATUS === "Done" ? "bg-success" : "bg-secondary"
              }`}
            >
              {item.STATUS}
            </span>
          ),
          date: formatDateTime(item.DATETIME),
        }));
        setFilteredData(mapped);

        // ✅ Convert API data for Timeline
        const timeline = apiData.map((item) => ({
          label: item.STEP,
          time: formatDateTime(item.DATETIME),
          status: item.STATUS,
        }));
        setTimelineItems(timeline);
      } else {
        setFilteredData([]);
        setTimelineItems([]);
        alert("No tracking data found for this application.");
      }
    } catch (err) {
      console.error("❌ Error fetching tracking data:", err);
      alert("Error while fetching application updates.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load (use reqId from URL)
  useEffect(() => {
    if (reqIdFromUrl) {
      fetchTrackingData(applicationNo);
    }
  }, [reqIdFromUrl]);

  const handleSearch = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setApplicationNo(values.applicationNo || "");
    await fetchTrackingData(values.applicationNo);
    setSubmitting(false);
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <NavbarCitizen />
      <div className="container-fluid mt-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white fw-bold text-center">
            Track Application
          </div>

          <div className="card-body">
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/CitizenTrackApplication?@=1")}
              >
                Back
              </button>
            </div>
            {/* Application Info */}
            <div className="mb-3">
              <small className="text-muted">Application No :</small>{" "}
              <span className="fw-semibold">{applicationNo || "—"}</span>
            </div>

            {/* Table + Timeline */}
            <div className="row">
              {/* ✅ Table */}
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body p-0">
                    <Table
                      headers={["Step", "Description", "Status", "Date"]}
                      data={filteredData}
                      keyMapping={{
                        Step: "step",
                        Description: "description",
                        Status: "status",
                        Date: "date",
                      }}
                      noDataMessage={
                        loading ? "Loading data..." : "No tracking data found."
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Timeline */}
              <div className="col-lg-4">
                <div
                  className="position-relative"
                  style={{ minHeight: "460px", paddingLeft: "40px" }}
                >
                  {/* Vertical Line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "22px",
                      top: "5px",
                      bottom: "5px",
                      width: "4px",
                      backgroundColor: "#2b6fb2",
                      borderRadius: "2px",
                    }}
                  ></div>

                  {/* Timeline Items */}
                  <div style={{ marginTop: "10px" }}>
                    {timelineItems.map((it, idx) => (
                      <div key={idx} className="position-relative mb-3">
                        {/* Circle */}
                        <div
                          style={{
                            position: "absolute",
                            left: "-22px",
                            top: "6px",
                            width: "14px",
                            height: "14px",
                            border: "2px solid #f3a24c",
                            backgroundColor:
                              it.status === "Done" ? "#28a745" : "#fff",
                            borderRadius: "50%",
                            zIndex: 2,
                          }}
                        ></div>

                        {/* Step Label */}
                        <div>
                          <div
                            style={{
                              backgroundColor:
                                it.status === "Done" ? "#28a745" : "#f9f9f9",
                              color: it.status === "Done" ? "#fff" : "#000",
                              borderRadius: "5px",
                              padding: "6px 10px",
                              display: "inline-block",
                              fontWeight: "500",
                              fontSize: "14px",
                              lineHeight: "1.3",
                              minWidth: "250px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                            }}
                          >
                            {it.label}{" "}
                            <span style={{ fontSize: "12px", opacity: 0.9 }}>
                              {it.time ? `(${it.time})` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3" />
          </div>
        </div>
      </div>

      <style>{`
        .table-container { overflow-x: auto; }
        .custom-thead { background: #f3f6f9; }
        .table-header { font-weight: 600; }
        .table-cell { vertical-align: middle; }
      `}</style>
    </div>
  );
};

export default CitizenApplicationUpdates;
