// FrmAssignInspectionCombined.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "../../../Components/Calendar/CalendarIcon.jsx";
import Swal from "sweetalert2";
import CalendarIcon from "../../../Components/Calendar/CalendarIcon.jsx";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";

import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";

// Validation
import { getAssignInspectionValidation } from "../../../HOC/Validation/Validation.jsx";

function FrmAssignInspectionCombined() {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const { user } = useAuth();

  const mode = String(location?.state?.mode || ""); // "1" = Assign, "2" = Inspection
  const requestId = location?.state?.requestId;
  const orgId = Number(user?.ulbId) || 890;

  const [tankId, setTankId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [tankConditionList, setTankConditionList] = useState([]);
  const [accessDifficultyList, setAccessDifficultyList] = useState([]);

  // ----------------------- NULL SAFE FORMATTER -----------------------
  const safe = (v) => (v === null || v === undefined || v === "" ? "-" : v);

  const convertToInputDate = (dt) => {
    // convert "dd/MM/yyyy" or Date/string to "yyyy-MM-dd" (for input type=date and for our Calendar)
    if (!dt || dt === "-") return "";
    if (typeof dt === "string" && dt.includes("/")) {
      const [d, m, y] = dt.split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    // if already yyyy-mm-dd or ISO
    const dObj = new Date(dt);
    if (isNaN(dObj)) {
      // try if dt already in yyyy-mm-dd
      return dt;
    }
    const y = dObj.getFullYear();
    const m = String(dObj.getMonth() + 1).padStart(2, "0");
    const d = String(dObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDateForDisplay = (dt) => {
    if (!dt || dt === "-") return "-";
    if (typeof dt === "string" && dt.includes("/")) return dt;
    const x = new Date(dt);
    if (isNaN(x)) return "-";
    return `${String(x.getDate()).padStart(2, "0")}/${String(
      x.getMonth() + 1
    ).padStart(2, "0")}/${x.getFullYear()}`;
  };

  // default initial values: display fields keep "-", form fields use empty strings
  const [initialValues, setInitialValues] = useState({
    // display / readonly fields
    ownerName: "-",
    mobileNumber: "-",
    propertyID: "-",
    email: "-",
    zone: "-",
    prabhag: "-",
    ownershipType: "-",
    tankType: "-",
    longitude: "-",
    latitude: "-",
    address: "-",
    registrationDate: "-",
    tankCapacity: "-",
    status: "-",
    requestDate: "-",
    serviceType: "-",
    remarks: "-",
    requestedBy: "-",

    // form fields (for Formik)
    assignedTo: "",
    visitDate: "", // yyyy-mm-dd string
    tankCondition: "",
    accessDifficulty: "",
    wasteLevel: "",
    inspectionRemarks: "",
    statusRadio: "",
  });

  // ---------------- API FETCHERS ----------------
  const fetchStaffList = async () => {
    try {
      const res = await apiService.post("GetStaffList", { orgId, requestId });
      setStaffList(res?.data?.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch staff list", "error");
    }
  };

  const fetchTankConditionList = async () => {
    if (mode !== "2") return;
    try {
      const res = await apiService.post("GetTankConditionList", {});
      setTankConditionList(res?.data?.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch tank condition data", "error");
    }
  };

  const fetchAccessDifficultyList = async () => {
    if (mode !== "2") return;
    try {
      const res = await apiService.post("GetAccessDifficultyList", {});
      setAccessDifficultyList(res?.data?.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch access difficulty data", "error");
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await apiService.post("GetRequestDetails", {
        orgId,
        requestId,
      });

      const d = res?.data?.data?.[0];
      if (!d) {
        setLoading(false);
        return;
      }

      setTankId(d.TANK_ID);

      // prepare form-friendly values
      const assignedToVal = d.NUM_REQUEST_STAFFID ? String(d.NUM_REQUEST_STAFFID) : "";
      const visitDateVal = d.VISITDATE ? convertToInputDate(d.VISITDATE) : "";

      setInitialValues({
        ownerName: safe(d.TANK_OWNERNAME),
        mobileNumber: safe(d.TANK_MOBILE),
        propertyID: safe(d.TANK_PROPNO),
        email: safe(d.TANK_EMAILID),
        zone: safe(d.ZONENAME),
        prabhag: safe(d.PRABHAGNAME),
        ownershipType: safe(d.OWNERTYPENAMEA),
        tankType: safe(d.TYPENAME),
        longitude: safe(d.TANK_LONGITUDE),
        latitude: safe(d.TANK_LATITUDE),
        address: safe(d.TANK_ADDRESS),
        registrationDate: safe(formatDateForDisplay(d.TANK_REGDATE)),
        tankCapacity: safe(d.TANK_CAPACITY),
        status: safe(d.STATUS),
        requestDate: safe(formatDateForDisplay(d.DAT_REQUEST_DATE)),
        serviceType: safe(d.SERVTYPE_NAME),
        remarks: safe(d.VAR_REQUEST_REMARK),
        requestedBy: safe(d.VAR_REQUEST_REQSTBY),

        assignedTo: assignedToVal,
        visitDate: visitDateVal,

        tankCondition: "",
        accessDifficulty: "",
        wasteLevel: "",
        inspectionRemarks: "",
        statusRadio: "",
      });
    } catch (err) {
      Swal.fire("Error", "Failed to fetch request details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchDetails();
      fetchStaffList();
      fetchTankConditionList();
      fetchAccessDifficultyList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, orgId, mode]);

  // ---------------- SUBMIT ----------------
  const assignSubmit = async (values, { setSubmitting }) => {

    try {
      const payload = {
        userId: user?.userId,
        requestId,
        tankId,
        visitDate: values.visitDate || null,
        staffId: values.assignedTo || null,
        orgId,
      };

      await apiService.post("assignInspection", payload);

      Swal.fire({
        title: "Assigned Successfully!",
        icon: "success",
      });

      navigate(-1);
    } catch (err) {
      Swal.fire("Failed!", "Inspection assignment failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inspectionSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        userId: user?.userId,
        requestId,
        tankId,
        visitDate: values.visitDate || null,
        staffId: values.assignedTo || null,
        tnkCondition: values.tankCondition || null,
        tnkAccessDifty: values.accessDifficulty || null,
        wasteLevel: values.wasteLevel || null,
        remark: values.inspectionRemarks || null,
        status: values.statusRadio || null,
        orgId,
      };

      await apiService.post("tnkInspectionIns", payload);

      Swal.fire({
        title: "Inspection Saved!",
        icon: "success",
      });

      navigate(-1);
    } catch (err) {
      Swal.fire("Error", "Failed to save inspection", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (values, formikBag) => {

    if (mode === "1") return assignSubmit(values, formikBag);
    if (mode === "2") return inspectionSubmit(values, formikBag);
  };

  // ---------------- READONLY FIELD RENDER ----------------
  // Use Field with component InputField so Formik controls the value.
  const renderRow = (field, label) => (
    <div className="col-md-4 mb-3" key={field}>
      <Label text={label} />
      <Field name={field} component={InputField} className="form-control" readOnly />
    </div>
  );

  // helper to convert JS Date -> yyyy-mm-dd
  const dateToInputString = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // ---------------- UI ----------------
  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text={mode === "2" ? "Inspection Entry" : "Assign Inspection"} />
        <hr />

        {loading ? (
          <div className="alert alert-info">Loading...</div>
        ) : (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={getAssignInspectionValidation(mode, translate)}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Tank Details</h5>
                  <hr />
                  <div className="row">
                    {renderRow("ownerName", "Owner Name")}
                    {renderRow("mobileNumber", "Mobile No")}
                    {renderRow("propertyID", "Property ID")}
                    {renderRow("email", "Email")}
                    {renderRow("zone", "Zone")}
                    {renderRow("prabhag", "Prabhag")}
                    {renderRow("ownershipType", "Ownership Type")}
                    {renderRow("tankType", "Tank Type")}
                    {renderRow("longitude", "Longitude")}
                    {renderRow("latitude", "Latitude")}
                    {renderRow("address", "Address")}
                    {renderRow("registrationDate", "Registration Date")}
                    {renderRow("tankCapacity", "Tank Capacity")}
                    {renderRow("status", "Status")}
                  </div>
                </div>

                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Request Details</h5>
                  <hr />
                  <div className="row">
                    {renderRow("requestDate", "Request Date")}
                    {renderRow("serviceType", "Service Type")}
                    {renderRow("remarks", "Remarks")}
                    {renderRow("requestedBy", "Requested By")}
                  </div>
                </div>

                <div className="card p-4 mb-4 shadow-sm">
                  <h5>{mode === "2" ? "Inspection Entry" : "Assign Inspection"}</h5>
                  <hr />

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <Label text="Assigned To" required />
                      <Field
                        as="select"
                        name="assignedTo"
                        className="form-control"
                        disabled={mode === "2"} // read-only during inspection entry
                      >
                        <option value="">-- Select Option --</option>
                        {staffList.map((s) => (
                          <option key={s.STAFFID} value={String(s.STAFFID)}>
                            {s.STAFF_NAME}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="assignedTo" component="div" className="text-danger small" />
                    </div>

                    <div className="col-md-4">
                      <Label text={mode === "2" ? "Inspection Date" : "Visit Date"} required />
                      {/* Use the Calendar component for visitDate */}
                      <div>
                        <Calendar
                          selectedDate={values.visitDate ? new Date(values.visitDate) : null}
                          setSelectedDate={(d) => {
                            // Calendar likely gives either Date or string; normalize to yyyy-mm-dd
                            const v = d ? dateToInputString(d) : "";
                            setFieldValue("visitDate", v);
                          }}
                          placeholder="Select date"
                          disabled={mode === "2"}
                        />
                        <ErrorMessage name="visitDate" component="div" className="text-danger small" />
                      </div>
                    </div>

                    {mode === "2" && (
                      <div className="col-md-4">
                        <Label text="Tank Condition" required />
                        <Field as="select" name="tankCondition" className="form-control">
                          <option value="">-- Select Option --</option>
                          {tankConditionList.map((t) => (
                            <option key={t.NUM_TNKCND_ID} value={String(t.NUM_TNKCND_ID)}>
                              {t.VAR_TNKCND_NAME}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="tankCondition" component="div" className="text-danger small" />
                      </div>
                    )}
                  </div>

                  {mode === "2" && (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <Label text="Access Difficulty" required />
                          <Field as="select" name="accessDifficulty" className="form-control">
                            <option value="">-- Select Option --</option>
                            {accessDifficultyList.map((x) => (
                              <option key={x.NUM_ACSDIFCTY_ID} value={String(x.NUM_ACSDIFCTY_ID)}>
                                {x.VAR_ACSDIFCTY_NAME}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="accessDifficulty" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-4">
                          <Label text="Waste Level (%)" required />
                          <Field name="wasteLevel" component={InputField} className="form-control" type="number" />
                          <ErrorMessage name="wasteLevel" component="div" className="text-danger small" />
                        </div>

                        <div className="col-md-4">
                          <Label text="Remarks" />
                          <Field name="inspectionRemarks" component={InputField} className="form-control" />
                          <ErrorMessage name="inspectionRemarks" component="div" className="text-danger small" />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <Label text="Status" />
                          <div className="d-flex mt-1">
                            <label className="me-3">
                              <Field type="radio" name="statusRadio" value="IA" /> Accepted
                            </label>
                            <label>
                              <Field type="radio" name="statusRadio" value="IR" /> Rejected
                            </label>
                          </div>
                          <ErrorMessage name="statusRadio" component="div" className="text-danger small" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <SaveButton type="submit" text={isSubmitting ? "Saving..." : "Submit"} className="btn btn-success" />

                  <SaveButton
                    type="button"
                    text="Back"
                    className="btn btn-secondary"
                    onClick={() => {
                      Swal.fire({
                        title: "Leave page?",
                        text: "Unsaved changes will be lost",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, go back",
                        cancelButtonText: "Cancel",
                      }).then((res) => {
                        if (res.isConfirmed) navigate(-1);
                      });
                    }}
                  />
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default FrmAssignInspectionCombined;
