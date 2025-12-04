// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useNavigate, useLocation } from "react-router-dom";
// import * as Yup from "yup";
// import Calendar from "../../../Components/Calendar/CalendarIcon";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import InputField from "../../../Components/InputField/InputField";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import Label from "../../../Components/Label/Label";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";
// import Swal from "sweetalert2";   // ✅ ADDED

// function FrmJobAssignMst() {
//   const { translate } = useLanguage();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const location = useLocation();
//   const tankrqstid = new URLSearchParams(location.search).get("tankrqstid");
//   const [staffList, setStaffList] = useState([]);
//   const [vehicleList, setVehicleList] = useState([]);

//   const [initialValues, setInitialValues] = useState({
//     ownerName: "",
//     mobileNumber: "",
//     propertyID: "",
//     email: "",
//     zone: "",
//     prabhag: "",
//     ownershipType: "",
//     tankType: "",
//     longitude: "",
//     latitude: "",
//     address: "",
//     registrationDate: "",
//     tankCapacity: "",
//     status: "",
//     requestDate: "",
//     serviceType: "",
//     remarks: "",
//     requestedBy: "",
//     assignedTo: "",
//     visitDate: "",
//     vehicleNo: "",
//     distanceManual: "",
//     estimatedTime: "",
//     assignRemark: "",
//     inspectionDate: "",
//     accessDifficulty: "",
//     tankCondition: "",
//     wasteLevel: "",
//     inspectionRemark: "",
//   });

//   const formatDate = (value) => {
//     if (!value) return "";
//     if (value.includes("/") && value.split("/").length === 3) return value;
//     const date = new Date(value);
//     if (isNaN(date.getTime())) return "";
//     const d = String(date.getDate()).padStart(2, "0");
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const y = date.getFullYear();
//     return `${d}/${m}/${y}`;
//   };

//   useEffect(() => {
//     const loadDropdowns = async () => {
//       try {
//         const orgId = user?.ulbId;
//         if (!orgId) return;

//         const [staffRes, vehicleRes] = await Promise.all([
//           apiService.post("StaffDropdown", { orgId }),
//           apiService.post("VehicleDropdown", { orgId }),
//         ]);

//         setStaffList(staffRes?.data?.data || []);
//         setVehicleList(vehicleRes?.data?.data || []);
//       } catch (error) {
//         console.error("Dropdown Error:", error);
//       }
//     };

//     loadDropdowns();
//   }, [user]);

//   useEffect(() => {
//     const loadTankDtls = async () => {
//       try {
//         if (!tankrqstid || !user?.ulbId) return;

//         const res = await apiService.post("GetTankRequestDtlsNew", {
//           orgId: user.ulbId,
//           tankrqstid: Number(tankrqstid),
//         });

//         const t = res?.data?.data?.[0];
//         if (!t) return;

//         setInitialValues({
//           ownerName: t.TANK_OWNERNAME || "",
//           mobileNumber: t.TANK_MOBILE || "",
//           propertyID: t.TANK_PROPNO || "",
//           email: t.TANK_EMAILID || "",
//           zone: t.ZONENAME || "",
//           prabhag: t.PRABHAGNAME || "",
//           ownershipType: t.OWNERTYPENAMEA || "",
//           tankType: t.TYPENAME || "",
//           longitude: t.TANK_LONGITUDE || "",
//           latitude: t.TANK_LATITUDE || "",
//           address: t.TANK_ADDRESS || "",
//           registrationDate: formatDate(t.TANK_REGDATE),
//           tankCapacity: t.TANK_CAPACITY || "",
//           status: t.STATUS || "",
//           requestDate: formatDate(t.DAT_REQUEST_DATE),
//           serviceType: t.SERVTYPE_NAME || "",
//           remarks: t.VAR_REQUEST_REMARK || "",
//           requestedBy: t.VAR_REQUEST_REQSTBY || "",
//           assignedTo: "",
//           visitDate: "",
//           vehicleNo: "",
//           distanceManual: "",
//           estimatedTime: "",
//           assignRemark: "",
//           inspectionDate: formatDate(t.VISITDATE),
//           accessDifficulty: String(t.ACSDIFCTY_NAME || ""),
//           tankCondition: String(t.TNKCDN_NAME || ""),
//           wasteLevel: t.WASTELEVEL || "",
//           inspectionRemark: t.REMARK || "",
//         });
//       } catch (error) {
//         console.error("Tank Fetch Error:", error);
//       }
//     };

//     loadTankDtls();
//   }, [user, tankrqstid]);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     // ----------------------------- 🔥 VALIDATION ALERTS -----------------------------

//     if (!values.assignedTo) {
//       Swal.fire({
//         icon: "warning",
//         title: "Staff Required!",
//         text: "Please select a staff to assign.",
//       });
//       setSubmitting(false);
//       return;
//     }

//     if (!values.visitDate) {
//       Swal.fire({
//         icon: "warning",
//         title: "Visit Date Required!",
//         text: "Please select a visit date.",
//       });
//       setSubmitting(false);
//       return;
//     }

//     if (!values.vehicleNo) {
//       Swal.fire({
//         icon: "warning",
//         title: "Vehicle Required!",
//         text: "Please select a vehicle.",
//       });
//       setSubmitting(false);
//       return;
//     }

//     // ----------------------------- 🔥 API SUBMIT -----------------------------
//     try {
//       const payload = {
//         userid: user?.username,
//         request_id: Number(tankrqstid),
//         staffid: Number(values.assignedTo),
//         Vehicleid: Number(values.vehicleNo),
//         Assigndate: values.visitDate,
//         Distance: Number(values.distanceManual),
//         Time: values.estimatedTime,
//         Remark: values.assignRemark,
//         ulbid: Number(user?.ulbId),
//       };

//       const res = await apiService.post("TankJobInsert", payload);
//       const msg = res?.data?.message || "";

//       Swal.fire({
//         icon: "success",
//         title: "Job Assigned Successfully",
//         text: msg,
//       }).then(() => navigate(-1));
//     } catch (error) {
//       console.error("Submit Error:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Submission Failed!",
//         text: "An error occurred while assigning the job.",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const editable = [
//     "assignedTo",
//     "visitDate",
//     "vehicleNo",
//     "distanceManual",
//     "estimatedTime",
//     "assignRemark",
//     "inspectionDate",
//     "accessDifficulty",
//     "tankCondition",
//     "wasteLevel",
//     "inspectionRemark",
//   ];

//   const isReadOnly = (field) => !editable.includes(field);

//   const renderField = (
//     field,
//     label,
//     type = "text",
//     required = false,
//     as = undefined,
//     forceReadOnly = false
//   ) => (
//     <div className="col-md-4 mb-3">
//       <Label text={`${translate(label)}:`} required={required} />
//       <Field
//         as={as}
//         name={field}
//         type={type}
//         component={!as ? InputField : undefined}
//         readOnly={forceReadOnly || isReadOnly(field)}
//         className="form-control"
//       >
//         {as === "select" && field === "assignedTo" && (
//           <>
//             <option value="">Select Staff</option>
//             {staffList.map((s) => (
//               <option key={s.STAFFID} value={s.STAFFID}>
//                 {s.STAFFNAME}
//               </option>
//             ))}
//           </>
//         )}

//         {as === "select" && field === "vehicleNo" && (
//           <>
//             <option value="">Select Vehicle</option>
//             {vehicleList.map((v) => (
//               <option key={v.VEHICLEID} value={v.VEHICLEID}>
//                 {v.VEHICLENO}
//               </option>
//             ))}
//           </>
//         )}
//       </Field>
//       <ErrorMessage name={field} className="text-danger small" component="div" />
//     </div>
//   );

//   const row = (...fields) => (
//     <div className="row">
//       {fields.map((f, i) => (
//         <React.Fragment key={i}>{renderField(...f)}</React.Fragment>
//       ))}
//     </div>
//   );

//   return (
//     <div className="container mt-4">
//       <HeaderLabel text={"Assign Inspection"} />
//       <hr />

//       <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
//         {({ isSubmitting }) => (
//           <Form>
//             {/* TANK DETAILS */}
//             <div className="card p-4 mb-4">
//               <h5>Tank Details</h5>
//               <hr />
//               {row(["ownerName", "Owner Name"], ["mobileNumber", "Mobile No."], ["propertyID", "Property ID"])}
//               {row(["email", "Email"], ["zone", "Zone"], ["prabhag", "Prabhag"])}
//               {row(["ownershipType", "Ownership Type"], ["tankType", "Tank Type"], ["tankCapacity", "Tank Capacity"])}
//               {row(["longitude", "Longitude"], ["latitude", "Latitude"], ["registrationDate", "Registration Date"])}
//               {row(["address", "Address"])}
//             </div>

//             {/* REQUEST DETAILS */}
//             <div className="card p-4 mb-4">
//               <h5>Request Details</h5>
//               <hr />
//               {row(["requestDate", "Request Date"], ["serviceType", "Service Type"], ["requestedBy", "Requested By"])}
//               {row(["remarks", "Request Remarks"])}
//             </div>

//             {/* INSPECTION STATUS */}
//             <div className="card p-4 mb-4">
//               <h5>Inspection Status</h5>
//               <hr />
//               {row(
//                 ["inspectionDate", "Inspection Date", "text", false, undefined, true],
//                 ["accessDifficulty", "Access Difficulty", "text", false, undefined, true],
//                 ["tankCondition", "Tank Condition", "text", false, undefined, true]
//               )}
//               {row(
//                 ["wasteLevel", "Waste Level", "text", false, undefined, true],
//                 ["inspectionRemark", "Inspection Remark", "text", false, undefined, true]
//               )}
//             </div>

//             {/* ASSIGNMENT */}
//             <div className="card p-4 mb-4">
//               <h5>Assign Job</h5>
//               <hr />
//               {row(
//                 ["assignedTo", "Assigned To", "text", true, "select"],
//                 ["visitDate", "Visit Date", "date", true],
//                 ["vehicleNo", "Vehicle No", "text", true, "select"]
//               )}
//               {row(
//                 ["distanceManual", "Distance (KM)", "number", true],
//                 ["estimatedTime", "Estimated Time", "time", true],
//                 ["assignRemark", "Assignment Remark"]
//               )}
//             </div>

//             <div className="d-flex justify-content-center mb-5">
//               <div className="me-3">
//                 <SaveButton type="submit" text="Submit" disabled={isSubmitting} />
//               </div>
//               <div className="me-3">
//                 <SaveButton type="button" text="Back" onClick={() => navigate(-1)} />
//               </div>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }

// export default FrmJobAssignMst;


import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";

import Calendar from "../../../Components/Calendar/CalendarIcon";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";

import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Swal from "sweetalert2";

function FrmJobAssignMst() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const tankrqstid = new URLSearchParams(location.search).get("tankrqstid");

  const [staffList, setStaffList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);

  const [initialValues, setInitialValues] = useState({
    ownerName: "",
    mobileNumber: "",
    propertyID: "",
    email: "",
    zone: "",
    prabhag: "",
    ownershipType: "",
    tankType: "",
    longitude: "",
    latitude: "",
    address: "",
    registrationDate: "",
    tankCapacity: "",
    status: "",
    requestDate: "",
    serviceType: "",
    remarks: "",
    requestedBy: "",
    assignedTo: "",
    visitDate: "",
    vehicleNo: "",
    distanceManual: "",
    estimatedTime: "",
    assignRemark: "",
    inspectionDate: "",
    accessDifficulty: "",
    tankCondition: "",
    wasteLevel: "",
    inspectionRemark: "",
  });

  // Convert API date → DD/MM/YYYY
  const formatDate = (value) => {
    if (!value) return "";
    if (value.includes("/") && value.split("/").length === 3) return value;
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const orgId = user?.ulbId;
        if (!orgId) return;

        const [staffRes, vehicleRes] = await Promise.all([
          apiService.post("StaffDropdown", { orgId }),
          apiService.post("VehicleDropdown", { orgId }),
        ]);

        setStaffList(staffRes?.data?.data || []);
        setVehicleList(vehicleRes?.data?.data || []);
      } catch (error) {
        console.error("Dropdown Error:", error);
      }
    };

    loadDropdowns();
  }, [user]);

  useEffect(() => {
    const loadTankDtls = async () => {
      try {
        if (!tankrqstid || !user?.ulbId) return;

        const res = await apiService.post("GetTankRequestDtlsNew", {
          orgId: user.ulbId,
          tankrqstid: Number(tankrqstid),
        });

        const t = res?.data?.data?.[0];
        if (!t) return;

        setInitialValues({
          ownerName: t.TANK_OWNERNAME || "",
          mobileNumber: t.TANK_MOBILE || "",
          propertyID: t.TANK_PROPNO || "",
          email: t.TANK_EMAILID || "",
          zone: t.ZONENAME || "",
          prabhag: t.PRABHAGNAME || "",
          ownershipType: t.OWNERTYPENAMEA || "",
          tankType: t.TYPENAME || "",
          longitude: t.TANK_LONGITUDE || "",
          latitude: t.TANK_LATITUDE || "",
          address: t.TANK_ADDRESS || "",
          registrationDate: formatDate(t.TANK_REGDATE),
          tankCapacity: t.TANK_CAPACITY || "",
          status: t.STATUS || "",
          requestDate: formatDate(t.DAT_REQUEST_DATE),
          serviceType: t.SERVTYPE_NAME || "",
          remarks: t.VAR_REQUEST_REMARK || "",
          requestedBy: t.VAR_REQUEST_REQSTBY || "",
          assignedTo: "",
          visitDate: "",
          vehicleNo: "",
          distanceManual: "",
          estimatedTime: "",
          assignRemark: "",
          inspectionDate: formatDate(t.VISITDATE),
          accessDifficulty: String(t.ACSDIFCTY_NAME || ""),
          tankCondition: String(t.TNKCDN_NAME || ""),
          wasteLevel: t.WASTELEVEL || "",
          inspectionRemark: t.REMARK || "",
        });
      } catch (error) {
        console.error("Tank Fetch Error:", error);
      }
    };

    loadTankDtls();
  }, [user, tankrqstid]);

  const handleSubmit = async (values, { setSubmitting }) => {
    // SIMPLE VALIDATIONS
    if (!values.assignedTo) {
      Swal.fire("Warning", "Please select staff", "warning");
      setSubmitting(false);
      return;
    }

    if (!values.visitDate) {
      Swal.fire("Warning", "Please select Visit Date", "warning");
      setSubmitting(false);
      return;
    }

    if (!values.vehicleNo) {
      Swal.fire("Warning", "Please select vehicle", "warning");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        userid: user?.username,
        request_id: Number(tankrqstid),
        staffid: Number(values.assignedTo),
        Vehicleid: Number(values.vehicleNo),
        Assigndate: values.visitDate,
        Distance: Number(values.distanceManual),
        Time: values.estimatedTime,
        Remark: values.assignRemark,
        ulbid: Number(user?.ulbId),
      };

      const res = await apiService.post("TankJobInsert", payload);

      Swal.fire("Success", "Job Assigned Successfully", "success").then(() =>
        navigate(-1)
      );
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire("Error", "Submission Failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const editable = [
    "assignedTo",
    "visitDate",
    "vehicleNo",
    "distanceManual",
    "estimatedTime",
    "assignRemark",
    "inspectionDate",
    "accessDifficulty",
    "tankCondition",
    "wasteLevel",
    "inspectionRemark",
  ];

  const isReadOnly = (field) => !editable.includes(field);

  const renderField = (field, label, type = "text", required = false, as = undefined, forceReadOnly = false) => (
    <div className="col-md-4 mb-3">
      <Label text={`${translate(label)}:`} required={required} />
      <Field
        as={as}
        name={field}
        type={type}
        component={!as ? InputField : undefined}
        readOnly={forceReadOnly || isReadOnly(field)}
        className="form-control"
      >
        {as === "select" && field === "assignedTo" && (
          <>
            <option value="">Select Staff</option>
            {staffList.map((s) => (
              <option key={s.STAFFID} value={s.STAFFID}>
                {s.STAFFNAME}
              </option>
            ))}
          </>
        )}

        {as === "select" && field === "vehicleNo" && (
          <>
            <option value="">Select Vehicle</option>
            {vehicleList.map((v) => (
              <option key={v.VEHICLEID} value={v.VEHICLEID}>
                {v.VEHICLENO}
              </option>
            ))}
          </>
        )}
      </Field>
      <ErrorMessage name={field} className="text-danger small" component="div" />
    </div>
  );

  const row = (...fields) => (
    <div className="row">
      {fields.map((f, i) => (
        <React.Fragment key={i}>{renderField(...f)}</React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="container mt-4">
      <HeaderLabel text={"Assign Inspection"} />
      <hr />

      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            {/* TANK DETAILS */}
            <div className="card p-4 mb-4">
              <h5>Tank Details</h5>
              <hr />
              {row(["ownerName", "Owner Name"], ["mobileNumber", "Mobile No."], ["propertyID", "Property ID"])}
              {row(["email", "Email"], ["zone", "Zone"], ["prabhag", "Prabhag"])}
              {row(["ownershipType", "Ownership Type"], ["tankType", "Tank Type"], ["tankCapacity", "Tank Capacity"])}
              {row(["longitude", "Longitude"], ["latitude", "Latitude"], ["registrationDate", "Registration Date"])}
              {row(["address", "Address"])}
            </div>

            {/* REQUEST DETAILS */}
            <div className="card p-4 mb-4">
              <h5>Request Details</h5>
              <hr />
              {row(["requestDate", "Request Date"], ["serviceType", "Service Type"], ["requestedBy", "Requested By"])}
              {row(["remarks", "Request Remarks"])}
            </div>

            {/* INSPECTION STATUS */}
            <div className="card p-4 mb-4">
              <h5>Inspection Status</h5>
              <hr />
              {row(
                ["inspectionDate", "Inspection Date", "text", false, undefined, true],
                ["accessDifficulty", "Access Difficulty", "text", false, undefined, true],
                ["tankCondition", "Tank Condition", "text", false, undefined, true]
              )}
              {row(
                ["wasteLevel", "Waste Level", "text", false, undefined, true],
                ["inspectionRemark", "Inspection Remark", "text", false, undefined, true]
              )}
            </div>

            {/* ASSIGNMENT */}
            <div className="card p-4 mb-4">
              <h5>Assign Job</h5>
              <hr />

              <div className="row">
                {/* Assigned To */}
                {renderField("assignedTo", "Assigned To", "text", true, "select")}

                {/* Visit Date ― Using CalendarIcon */}
                <div className="col-md-4 mb-3">
                  <Label text="Visit Date:" required />

                  <Calendar
                    selectedDate={
                      values.visitDate
                        ? (() => {
                            const [d, m, y] = values.visitDate.split("/");
                            return new Date(`${y}-${m}-${d}`);
                          })()
                        : null
                    }
                    setSelectedDate={(date) => {
                      if (date) {
                        const d = String(date.getDate()).padStart(2, "0");
                        const m = String(date.getMonth() + 1).padStart(2, "0");
                        const y = date.getFullYear();
                        const formatted = `${d}/${m}/${y}`;
                        setFieldValue("visitDate", formatted);
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                    disablePastDates={false}
                    disabled={false}
                    isDateLocked={false}
                    autoSelectToday={false}
                  />

                  <ErrorMessage
                    name="visitDate"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* Vehicle No */}
                {renderField("vehicleNo", "Vehicle No", "text", true, "select")}
              </div>

              {row(
                ["distanceManual", "Distance (KM)", "number", true],
                ["estimatedTime", "Estimated Time", "time", true],
                ["assignRemark", "Assignment Remark"]
              )}
            </div>

            <div className="d-flex justify-content-center mb-5">
              <div className="me-3">
                <SaveButton type="submit" text="Submit" disabled={isSubmitting} />
              </div>
              <div className="me-3">
                <SaveButton type="button" text="Back" onClick={() => navigate(-1)} />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FrmJobAssignMst;
