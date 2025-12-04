import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
import InputField from "../../../Components/InputField/InputField";
import Label from "../../../Components/Label/Label";
import Table from "../../../Components/Table/Table";
import apiService from "../../../../apiService";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const FrmTrackApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const mode = new URLSearchParams(location.search).get("@");

  const initialValues = {
    applicationNo: "",
    mobileNo: "",
  };

  const tableHeaders = [
    "Select",
    "Tank No",
    "Owner Name",
    "Mobile No",
    "Address",
    "Request No",
    "Date",
    "Service Type",
    "Remark",
    "Request Status",
  ];

  const keyMapping = {
    Select: "selects",
    "Tank No": "TANK_NO",
    "Owner Name": "TANK_OWNERNAME",
    "Mobile No": "TANK_MOBILE",
    Address: "TANK_ADDRESS",
    "Request No": "VAR_REQUEST_NO",
    Date: "DAT_REQUEST_DATE",
    "Service Type": "SERVTYPE_NAME",
    Remark: "VAR_REQUEST_REMARK",
    "Request Status": "REQUEST_STATUS",
  };

  // ✅ Handle row click navigation
  const handleSelect = (item) => {
    navigate(`/CitizenApplicationUpdates?reqId=${item.REQSTID}`, {
      state: { requestData: item },
    });
  };

  // ✅ Handle search submit
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);
    setRecords([]);

    let inputValue = mode === "1" ? values.applicationNo : values.mobileNo;

    if (!inputValue || inputValue.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text:
          mode === "1"
            ? "Please enter Application Number"
            : "Please enter Mobile Number",
      });
      setLoading(false);
      setSubmitting(false);
      return;
    }

    // Mobile No Validation
    if (mode === "2" && !/^[6-9]\d{9}$/.test(inputValue)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile No",
        text: "Please enter a valid 10-digit mobile number starting with 6/7/8/9",
      });
      setLoading(false);
      setSubmitting(false);
      return;
    }

    try {
      const payload =
        mode === "1"
          ? { OrgId: 890, RequestNo: values.applicationNo }
          : { OrgId: 890, MobileNo: values.mobileNo };

      const url =
        mode === "1" ? "getTankRequestByRequestNo" : "getTankRequestByMobile";

      const response = await apiService.post(url, payload);

      if (response?.data?.success && response?.data?.data?.length > 0) {
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          const d = new Date(dateStr);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        };

        const mappedData = response.data.data.map((item) => ({
          selects: (
            <a
              style={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#007bff",
              }}
              onClick={() => handleSelect(item)}
            >
              Select
            </a>
          ),
          TANK_NO: item.TANK_NO,
          TANK_OWNERNAME: item.TANK_OWNERNAME,
          TANK_MOBILE: item.TANK_MOBILE,
          TANK_ADDRESS: item.TANK_ADDRESS,
          VAR_REQUEST_NO: item.VAR_REQUEST_NO,
          DAT_REQUEST_DATE: formatDate(item.DAT_REQUEST_DATE),
          SERVTYPE_NAME: item.SERVTYPE_NAME,
          VAR_REQUEST_REMARK: item.VAR_REQUEST_REMARK,
          REQUEST_STATUS: item.REQUEST_STATUS,
        }));

        setRecords(mappedData);
      } else {
        // ✅ SweetAlert - No records found
        Swal.fire({
          icon: "info",
          title: "No Records Found",
          text: "No records found for your input. ",
          confirmButtonColor: "#0d6efd",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);

      // ✅ SweetAlert - Error
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "Something went wrong while fetching data. Please try again later.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <NavbarCitizen />
      <div className="container-fluid py-4">
        <div
          className="card shadow-lg border-0 mx-auto"
          style={{ width: "90%" }}
        >
          <div className="card-header text-white fw-bold fs-5" style={{ backgroundColor: "#97c1f7" }}>
            {mode === "2"
              ? "Track Application by Mobile No"
              : "Track Application by Application No"}
          </div>

          <div className="card-body p-4 bg-white rounded-bottom">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ isSubmitting, resetForm }) => (
                <Form>
                  <div className="row justify-content-center align-items-center mb-4">
                    <div className="col-md-2 text-md-end text-center mb-2 mb-md-0">
                      <Label
                        text={mode === "2" ? "Mobile No" : "Application No"}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      {mode === "1" && (
                        <Field
                          name="applicationNo"
                          component={InputField}
                          placeholder="Enter Application Number"
                        />
                      )}

                      {mode === "2" && (
                        <Field
                          name="mobileNo"
                          component={InputField}
                          type="tel"
                          placeholder="Enter Mobile Number"
                        />
                      )}
                    </div>

                    <div className="col-md-4 d-flex justify-content-start gap-2 mt-3 mt-md-0">
                      <button
                        type="submit"
                        className="btn btn-primary fw-semibold px-4"
                        disabled={isSubmitting || loading}
                      >
                        {loading ? "Searching..." : "Search"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary text-white fw-semibold px-4"
                        onClick={() => resetForm()}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary fw-semibold px-4"
                        onClick={() => navigate("/FrmCitizenDashboard")}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            {/* ✅ Table Section (visible only when records exist) */}
            {records.length > 0 && (
              <div className="mt-4">
                <div className="table-responsive">
                <Table
                  headers={tableHeaders}
                  data={records}
                  keyMapping={keyMapping}
                  noDataMessage="No application records found."
                />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrmTrackApplication;
