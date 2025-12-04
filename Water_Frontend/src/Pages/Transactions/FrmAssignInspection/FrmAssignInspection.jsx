// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useNavigate, useLocation } from "react-router-dom";
// import * as Yup from "yup";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import InputField from "../../../Components/InputField/InputField";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import Label from "../../../Components/Label/Label";

// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";

// function FrmAssignInspection() {
//   const { translate } = useLanguage();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();

//   const requestId = location?.state?.requestId;
//   const orgId = Number(user?.ulbId) || 890;

//   const [tankId, setTankId] = useState(null);
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Allowed Characters
//   const VALID_TEXT_REGEX = /^[A-Za-z0-9 ,()\-]*$/;
//   const VALID_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;

//   // Convert API date to dd/mm/yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const d = new Date(dateString);
//     if (isNaN(d)) return "";
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     return `${day}/${month}/${d.getFullYear()}`;
//   };

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
//   });

//   // -------------------------------------------------------
//   // Validation Schema
//   // -------------------------------------------------------
//   const validationSchema = Yup.object({
//     ownerName: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     mobileNumber: Yup.string().matches(/^\d+$/, "Only numbers allowed"),
//     propertyID: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     email: Yup.string().matches(VALID_EMAIL_REGEX, "Invalid email"),
//     zone: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     prabhag: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     ownershipType: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     tankType: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     longitude: Yup.string().matches(/^[0-9.\-]+$/, "Only numbers allowed"),
//     latitude: Yup.string().matches(/^[0-9.\-]+$/, "Only numbers allowed"),
//     address: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     tankCapacity: Yup.string().matches(/^\d+$/, "Only numbers allowed"),
//     status: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     remarks: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     requestedBy: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),

//     assignedTo: Yup.string().required("Staff/Contractor is required"),
//     visitDate: Yup.string().required("Visit Date is required"),
//   });

//   // -------------------------------------------------------
//   // Fetch Staff List
//   // -------------------------------------------------------
//   const fetchStaffList = async () => {
//     try {
//       const response = await apiService.post("GetStaffList", {
//         orgId,
//         requestId,
//       });
//       setStaffList(response?.data?.data || []);
//     } catch (err) {
//       console.error("Error fetching staff list:", err);
//     }
//   };

//   // -------------------------------------------------------
//   // Fetch Request Details
//   // -------------------------------------------------------
//   const fetchDetails = async () => {
//     try {
//       setLoading(true);

//       const response = await apiService.post("GetRequestDetails", { orgId, requestId });
//       const d = response?.data?.data?.[0];

//       if (!d) return;

//       setTankId(d.TANK_ID);

//       setInitialValues({
//         ownerName: d.TANK_OWNERNAME || "",
//         mobileNumber: d.TANK_MOBILE || "",
//         propertyID: d.TANK_PROPNO || "",
//         email: d.TANK_EMAILID || "",
//         zone: d.ZONENAME || "",
//         prabhag: d.PRABHAGNAME || "",
//         ownershipType: d.OWNERTYPENAMEA || "",
//         tankType: d.TYPENAME || "",
//         longitude: d.TANK_LONGITUDE || "",
//         latitude: d.TANK_LATITUDE || "",
//         address: d.TANK_ADDRESS || "",
//         registrationDate: formatDate(d.TANK_REGDATE),
//         tankCapacity: d.TANK_CAPACITY || "",
//         status: d.STATUS || "",
//         requestDate: formatDate(d.DAT_REQUEST_DATE),
//         serviceType: d.SERVTYPE_NAME || "",
//         remarks: d.VAR_REQUEST_REMARK || "",
//         requestedBy: d.VAR_REQUEST_REQSTBY || "",
//         assignedTo: d.NUM_REQUEST_STAFFID || "",
//         visitDate: d.VISITDATE ? formatDate(d.VISITDATE) : "",
//       });

//     } catch (err) {
//       console.error("Error loading details:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------------------------------
//   // RUN ON LOAD
//   // -------------------------------------------------------
//   useEffect(() => {
//     if (requestId) {
//       fetchDetails();
//       fetchStaffList();
//     }
//   }, [requestId, orgId]);

//   // -------------------------------------------------------
//   // Submit
//   // -------------------------------------------------------
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const payload = {
//         userId: user?.userId || "MBMCSPDTU",
//         requestId: requestId,
//         tankId: tankId,
//         visitDate: values.visitDate,
//         staffId: values.assignedTo,
//         orgId: orgId,
//       };

//       const response = await apiService.post("assignInspection", payload);

//       alert(translate("Inspection Assigned Successfully!"));
//       navigate(-1);

//     } catch (error) {
//       console.error("Submit error:", error);
//       alert("Failed to assign inspection!");
//     }

//     setSubmitting(false);
//   };

//   // -------------------------------------------------------
//   // Helper Row Renderers
//   // -------------------------------------------------------
//   const renderThreeColumnRow = (f1, l1, f2, l2, f3, l3) => {
//     const cols = [
//       { field: f1, label: l1 },
//       { field: f2, label: l2 },
//       { field: f3, label: l3 },
//     ].filter(c => c.field);

//     return (
//       <div className="row mb-3">
//         {cols.map((col, idx) => (
//           <div className="col-md-4" key={idx}>
//             <Label text={`${translate(col.label)}:`} />
//             <Field name={col.field} component={InputField} className="form-control" />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderDetailRow = (lKey, lField, rKey, rField) => (
//     <div className="row mb-3">
//       <div className="col-md-3"><Label text={`${translate(lKey)} :`} /></div>
//       <div className="col-md-3"><Field name={lField} component={InputField} className="form-control" readOnly /></div>

//       <div className="col-md-3"><Label text={`${translate(rKey)} :`} /></div>
//       <div className="col-md-3"><Field name={rField} component={InputField} className="form-control" readOnly /></div>
//     </div>
//   );

//   // -------------------------------------------------------
//   // UI
//   // -------------------------------------------------------
//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel text={translate("Assign Inspection")} />
//         <hr className="mb-4" />

//         {loading && <div className="alert alert-info">Loading details...</div>}

//         {!loading && (
//           <Formik
//             initialValues={initialValues}
//             enableReinitialize={true}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>

//                 {/* TANK DETAILS */}
//                 <div className="card shadow-sm p-4 mb-4">
//                   <h5 className="card-title">{translate("Tank Details")}</h5>
//                   <hr />
//                   {renderThreeColumnRow("ownerName", "Owner Name", "mobileNumber", "Mobile No.", "propertyID", "Property ID")}
//                   {renderThreeColumnRow("email", "Email", "zone", "Zone", "prabhag", "Prabhag")}
//                   {renderThreeColumnRow("ownershipType", "Ownership Type", "tankType", "Tank Type", "longitude", "Longitude")}
//                   {renderThreeColumnRow("latitude", "Latitude", "address", "Address", "registrationDate", "Registration Date")}
//                   {renderThreeColumnRow("tankCapacity", "Tank Capacity (litres)", "status", "Status")}
//                 </div>

//                 {/* REQUEST DETAILS */}
//                 <div className="card shadow-sm p-4 mb-4">
//                   <h5 className="card-title">{translate("Tank Cleaning Request Details")}</h5>
//                   <hr />
//                   {renderDetailRow("Request Date", "requestDate", "Service Type", "serviceType")}
//                   {renderDetailRow("Remarks", "remarks", "Requested By", "requestedBy")}
//                 </div>

//                 {/* ASSIGNMENT */}
//                 <div className="card shadow-sm p-4 ">
//                   <h5 className="card-title">{translate("Assign To Staff / Contractor")}</h5>
//                   <hr />

//                   <div className="row mb-4 max-sm:flex max-sm:gap-2">

//                     {/* STAFF DROPDOWN */}
//                     <div className="col-md-6 d-flex align-items-center">
//                       <div className="col-md-4"><Label text={`${translate("Assigned To")}:`} required /></div>
//                       <div className="col-md-8 max-sm:ml-5">
//                         <Field as="select" name="assignedTo" className="form-control">
//                           <option value="">-- Select Staff --</option>
//                           {staffList.map((s) => (
//                             <option key={s.STAFFID} value={s.STAFFID}>
//                               {s.STAFF_NAME}
//                             </option>
//                           ))}
//                         </Field>
//                         <ErrorMessage name="assignedTo" component="div" className="text-danger small mt-1" />
//                       </div>
//                     </div>

//                     {/* VISIT DATE (USER-SELECTED) */}
//                     <div className="col-md-6 d-flex align-items-center">
//                       <div className="col-md-4"><Label text={`${translate("Visit Date")}:`} required /></div>
//                       <div className="col-md-8 max-sm:ml-5">
//                         <Field name="visitDate" component={InputField} type="date" className="form-control" />
//                         <ErrorMessage name="visitDate" component="div" className="text-danger small mt-1" />
//                       </div>
//                     </div>

//                   </div>
//                 </div>

//                 {/* BUTTONS */}
//                 <div className="d-flex justify-content-center gap-3 mt-4">
//                   <SaveButton type="submit" text={translate("Submit")} disabled={isSubmitting} className="btn btn-success" />
//                   <SaveButton type="button" text={translate("Back")} onClick={() => navigate(-1)} className="btn btn-secondary" />
//                 </div>

//               </Form>
//             )}
//           </Formik>
//         )}

//       </div>
//     </div>
//   );
// }

// export default FrmAssignInspection;

// FULL UPDATED FILE STARTS HERE

// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useNavigate, useLocation } from "react-router-dom";
// import * as Yup from "yup";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import InputField from "../../../Components/InputField/InputField";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import Label from "../../../Components/Label/Label";

// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";

// function FrmAssignInspection() {
//   const { translate } = useLanguage();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();

//   const requestId = location?.state?.requestId;
//   const orgId = Number(user?.ulbId) || 890;

//   const pathSegments = location.pathname.split("/");
//   const mode = pathSegments[pathSegments.length - 1];   // "1", "2", "3"

//   const [tankId, setTankId] = useState(null);
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Allowed Characters
//   const VALID_TEXT_REGEX = /^[A-Za-z0-9 ,()\-]*$/;
//   const VALID_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;

//   // Convert API date to dd/mm/yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const d = new Date(dateString);
//     if (isNaN(d)) return "";
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     return `${day}/${month}/${d.getFullYear()}`;
//   };

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

//     // Extra fields for Inspection mode
//     tankCondition: "",
//     accessDifficulty: "",
//     wasteLevel: "",
//     inspectionRemarks: "",
//     statusRadio: "",
//   });

//   // -------------------------------------------------------
//   // Validation Schema
//   // -------------------------------------------------------
//   const validationSchema = Yup.object({
//     ownerName: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     mobileNumber: Yup.string().matches(/^\d+$/, "Only numbers allowed"),
//     propertyID: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     email: Yup.string().matches(VALID_EMAIL_REGEX, "Invalid email"),
//     zone: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     prabhag: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     ownershipType: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     tankType: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     longitude: Yup.string().matches(/^[0-9.\-]+$/, "Only numbers allowed"),
//     latitude: Yup.string().matches(/^[0-9.\-]+$/, "Only numbers allowed"),
//     address: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     tankCapacity: Yup.string().matches(/^\d+$/, "Only numbers allowed"),
//     status: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     remarks: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
//     requestedBy: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),

//     assignedTo: Yup.string().required("Required"),
//     visitDate: Yup.string().required("Required"),

//     tankCondition: mode === "2" ? Yup.string().required("Required") : Yup.string(),
//     accessDifficulty: mode === "2" ? Yup.string().required("Required") : Yup.string(),
//     wasteLevel: mode === "2" ? Yup.string().required("Required") : Yup.string(),
//     inspectionRemarks: mode === "2" ? Yup.string().required("Required") : Yup.string(),
//     statusRadio: mode === "2" ? Yup.string().required("Required") : Yup.string(),
//   });

//   // -------------------------------------------------------
//   // Fetch Staff List
//   // -------------------------------------------------------
//   const fetchStaffList = async () => {
//     try {
//       const response = await apiService.post("GetStaffList", {
//         orgId,
//         requestId,
//       });
//       setStaffList(response?.data?.data || []);
//     } catch (err) {
//       console.error("Error fetching staff list:", err);
//     }
//   };

//   // -------------------------------------------------------
//   // Fetch Request Details
//   // -------------------------------------------------------
//   const fetchDetails = async () => {
//     try {
//       setLoading(true);

//       const response = await apiService.post("GetRequestDetails", { orgId, requestId });
//       const d = response?.data?.data?.[0];

//       if (!d) return;

//       setTankId(d.TANK_ID);

//       setInitialValues((prev) => ({
//         ...prev,
//         ownerName: d.TANK_OWNERNAME || "",
//         mobileNumber: d.TANK_MOBILE || "",
//         propertyID: d.TANK_PROPNO || "",
//         email: d.TANK_EMAILID || "",
//         zone: d.ZONENAME || "",
//         prabhag: d.PRABHAGNAME || "",
//         ownershipType: d.OWNERTYPENAMEA || "",
//         tankType: d.TYPENAME || "",
//         longitude: d.TANK_LONGITUDE || "",
//         latitude: d.TANK_LATITUDE || "",
//         address: d.TANK_ADDRESS || "",
//         registrationDate: formatDate(d.TANK_REGDATE),
//         tankCapacity: d.TANK_CAPACITY || "",
//         status: d.STATUS || "",
//         requestDate: formatDate(d.DAT_REQUEST_DATE),
//         serviceType: d.SERVTYPE_NAME || "",
//         remarks: d.VAR_REQUEST_REMARK || "",
//         requestedBy: d.VAR_REQUEST_REQSTBY || "",
//         assignedTo: d.NUM_REQUEST_STAFFID || "",
//         visitDate: d.VISITDATE ? formatDate(d.VISITDATE) : "",
//       }));

//     } catch (err) {
//       console.error("Error loading details:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------------------------------
//   // ON LOAD
//   // -------------------------------------------------------
//   useEffect(() => {
//     if (requestId) {
//       fetchDetails();
//       fetchStaffList();
//     }
//   }, [requestId, orgId]);

//   // -------------------------------------------------------
//   // SUBMIT
//   // -------------------------------------------------------
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const payload = {
//         userId: user?.userId || "MBMCSPDTU",
//         requestId: requestId,
//         tankId: tankId,
//         visitDate: values.visitDate,
//         staffId: values.assignedTo,
//         orgId: orgId,
//       };

//       console.log("Submit Payload:", payload);

//       await apiService.post("assignInspection", payload);

//       alert(translate("Inspection Assigned Successfully!"));
//       navigate(-1);

//     } catch (error) {
//       console.error("Submit error:", error);
//       alert("Failed to assign inspection!");
//     }

//     setSubmitting(false);
//   };

//   // -------------------------------------------------------
//   // Helper Row Renderers
//   // -------------------------------------------------------
//   const renderThreeColumnRow = (f1, l1, f2, l2, f3, l3) => {
//     const cols = [
//       { field: f1, label: l1 },
//       { field: f2, label: l2 },
//       { field: f3, label: l3 },
//     ].filter(c => c.field);

//     return (
//       <div className="row mb-3">
//         {cols.map((col, idx) => (
//           <div className="col-md-4" key={idx}>
//             <Label text={`${translate(col.label)}:`} />
//             <Field name={col.field} component={InputField} className="form-control" />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderDetailRow = (lKey, lField, rKey, rField) => (
//     <div className="row mb-3">
//       <div className="col-md-3"><Label text={`${translate(lKey)} :`} /></div>
//       <div className="col-md-3"><Field name={lField} component={InputField} className="form-control" readOnly /></div>

//       <div className="col-md-3"><Label text={`${translate(rKey)} :`} /></div>
//       <div className="col-md-3"><Field name={rField} component={InputField} className="form-control" readOnly /></div>
//     </div>
//   );

//   // -------------------------------------------------------
//   // UI
//   // -------------------------------------------------------
//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel text={translate("Assign Inspection")} />
//         <hr className="mb-4" />

//         {loading && <div className="alert alert-info">Loading details...</div>}

//         {!loading && (
//           <Formik
//             initialValues={initialValues}
//             enableReinitialize
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>

//                 {/* TANK DETAILS */}
//                 <div className="card shadow-sm p-4 mb-4">
//                   <h5 className="card-title">{translate("Tank Details")}</h5>
//                   <hr />
//                   {renderThreeColumnRow("ownerName", "Owner Name", "mobileNumber", "Mobile No.", "propertyID", "Property ID")}
//                   {renderThreeColumnRow("email", "Email", "zone", "Zone", "prabhag", "Prabhag")}
//                   {renderThreeColumnRow("ownershipType", "Ownership Type", "tankType", "Tank Type", "longitude", "Longitude")}
//                   {renderThreeColumnRow("latitude", "Latitude", "address", "Address", "registrationDate", "Registration Date")}
//                   {renderThreeColumnRow("tankCapacity", "Tank Capacity (litres)", "status", "Status")}
//                 </div>

//                 {/* REQUEST DETAILS */}
//                 <div className="card shadow-sm p-4 mb-4">
//                   <h5 className="card-title">{translate("Tank Cleaning Request Details")}</h5>
//                   <hr />
//                   {renderDetailRow("Request Date", "requestDate", "Service Type", "serviceType")}
//                   {renderDetailRow("Remarks", "remarks", "Requested By", "requestedBy")}
//                 </div>

//                 {/* ASSIGNMENT AREA */}
//                 {mode === "2" ? (
//                   /* --------------------------
//                      INSPECTION MODE
//                      -------------------------- */
//                   <div className="card shadow-sm p-4 mb-4">
//                     <h5 className="card-title">{translate("Inspection Details")}</h5>
//                     <hr />

//                     <div className="row mb-4">

//                       {/* Assigned To */}
//                       <div className="col-md-4">
//                         <Label text="Assigned To *" />
//                         <Field as="select" name="assignedTo" className="form-control">
//                           <option value="">-- Select Option --</option>
//                           {staffList.map((s) => (
//                             <option key={s.STAFFID} value={s.STAFFID}>
//                               {s.STAFF_NAME}
//                             </option>
//                           ))}
//                         </Field>
//                         <ErrorMessage name="assignedTo" component="div" className="text-danger small mt-1" />
//                       </div>

//                       {/* Inspection Date */}
//                       <div className="col-md-4">
//                         <Label text="Inspection Date *" />
//                         <Field name="visitDate" component={InputField} type="date" className="form-control" />
//                         <ErrorMessage name="visitDate" component="div" className="text-danger small mt-1" />
//                       </div>

//                       {/* Tank Condition */}
//                       <div className="col-md-4">
//                         <Label text="Tank Condition *" />
//                         <Field as="select" name="tankCondition" className="form-control">
//                           <option value="">-- Select Option --</option>
//                           <option value="Good">Good</option>
//                           <option value="Average">Average</option>
//                           <option value="Bad">Bad</option>
//                         </Field>
//                       </div>
//                     </div>

//                     <div className="row mb-4">
//                       {/* Access Difficulty */}
//                       <div className="col-md-4">
//                         <Label text="Access Difficulty *" />
//                         <Field as="select" name="accessDifficulty" className="form-control">
//                           <option value="">-- Select Option --</option>
//                           <option value="Easy">Easy</option>
//                           <option value="Moderate">Moderate</option>
//                           <option value="Hard">Hard</option>
//                         </Field>
//                       </div>

//                       {/* Waste Level */}
//                       <div className="col-md-4">
//                         <Label text="Waste Level (%) *" />
//                         <Field name="wasteLevel" component={InputField} className="form-control" />
//                       </div>

//                       {/* Remarks */}
//                       <div className="col-md-4">
//                         <Label text="Remarks *" />
//                         <Field name="inspectionRemarks" component={InputField} className="form-control" />
//                       </div>
//                     </div>

//                     {/* Status */}
//                     <div className="row">
//                       <div className="col-md-4">
//                         <Label text="Status" />
//                         <div>
//                           <label className="me-3">
//                             <Field type="radio" name="statusRadio" value="Accepted" /> Accepted
//                           </label>
//                           <label>
//                             <Field type="radio" name="statusRadio" value="Rejected" /> Rejected
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                 ) : (
//                   /* --------------------------
//                      MODE 1 OR 3 → Normal Assign UI
//                      -------------------------- */
//                   <div className="card shadow-sm p-4 mb-4">
//                     <h5 className="card-title">{translate("Assign To Staff / Contractor")}</h5>
//                     <hr />

//                     <div className="row mb-4">
//                       <div className="col-md-6 d-flex align-items-center">
//                         <div className="col-md-4">
//                           <Label text={`${translate("Assigned To")}:`} required />
//                         </div>
//                         <div className="col-md-8">
//                           <Field as="select" name="assignedTo" className="form-control">
//                             <option value="">-- Select Staff --</option>
//                             {staffList.map((s) => (
//                               <option key={s.STAFFID} value={s.STAFFID}>
//                                 {s.STAFF_NAME}
//                               </option>
//                             ))}
//                           </Field>
//                           <ErrorMessage name="assignedTo" component="div" className="text-danger small mt-1" />
//                         </div>
//                       </div>

//                       <div className="col-md-6 d-flex align-items-center">
//                         <div className="col-md-4">
//                           <Label text={`${translate("Visit Date")}:`} required />
//                         </div>
//                         <div className="col-md-8">
//                           <Field name="visitDate" component={InputField} type="date" className="form-control" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* BUTTONS */}
//                 <div className="d-flex justify-content-center gap-3 mt-4">
//                   <SaveButton type="submit" text={translate("Submit")} disabled={isSubmitting} className="btn btn-success" />
//                   <SaveButton type="button" text={translate("Back")} onClick={() => navigate(-1)} className="btn btn-secondary" />
//                 </div>

//               </Form>
//             )}
//           </Formik>
//         )}

//       </div>
//     </div>
//   );
// }

// export default FrmAssignInspection;

/// CLEAN & FIXED FrmAssignInspection.jsx (NO MODE LOGIC)

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";

import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";

function FrmAssignInspection() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const requestId = location?.state?.requestId;
  const orgId = Number(user?.ulbId) || 890;

  console.log("📌 FrmAssignInspection Loaded | requestId:", requestId);

  const [tankId, setTankId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Allowed Characters
  const VALID_TEXT_REGEX = /^[A-Za-z0-9 ,()\-]*$/;
  const VALID_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;

  // Convert API date to dd/mm/yyyy
  const formatDate = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    if (isNaN(d)) return "";
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Initial Values
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
  });

  // Validation
  const validationSchema = Yup.object({
    ownerName: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    mobileNumber: Yup.string().matches(/^\d+$/, "Only numbers allowed"),
    propertyID: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    email: Yup.string().matches(VALID_EMAIL_REGEX, "Invalid email"),
    zone: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    prabhag: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    ownershipType: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    tankType: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    longitude: Yup.string().matches(/^[0-9.\-]+$/, "Only numbers allowed"),
    latitude: Yup.string().matches(/^[0-9.\-]+$/, "Only numbers allowed"),
    address: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    tankCapacity: Yup.string().matches(/^\d+$/, "Only numbers allowed"),
    status: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    remarks: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),
    requestedBy: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters"),

    assignedTo: Yup.string().required("Required"),
    visitDate: Yup.string().required("Required"),
  });

  // Fetch Staff
  const fetchStaffList = async () => {
    console.log("🟡 Fetching Staff List...");

    try {
      const res = await apiService.post("GetStaffList", { orgId, requestId });
      console.log("🟢 Staff List:", res?.data?.data);
      setStaffList(res?.data?.data || []);
    } catch (err) {
      console.error("🔴 Staff list error:", err);
    }
  };

  // Fetch Request Details
  const fetchDetails = async () => {
    console.log("🟡 Fetching Request Details...");

    try {
      setLoading(true);

      const res = await apiService.post("GetRequestDetails", { orgId, requestId });
      const d = res?.data?.data?.[0];

      console.log("🟢 Request Details:", d);

      if (!d) return;

      setTankId(d.TANK_ID);

      setInitialValues({
        ownerName: d.TANK_OWNERNAME || "",
        mobileNumber: d.TANK_MOBILE || "",
        propertyID: d.TANK_PROPNO || "",
        email: d.TANK_EMAILID || "",
        zone: d.ZONENAME || "",
        prabhag: d.PRABHAGNAME || "",
        ownershipType: d.OWNERTYPENAMEA || "",
        tankType: d.TYPENAME || "",
        longitude: d.TANK_LONGITUDE || "",
        latitude: d.TANK_LATITUDE || "",
        address: d.TANK_ADDRESS || "",
        registrationDate: formatDate(d.TANK_REGDATE),
        tankCapacity: d.TANK_CAPACITY || "",
        status: d.STATUS || "",
        requestDate: formatDate(d.DAT_REQUEST_DATE),
        serviceType: d.SERVTYPE_NAME || "",
        remarks: d.VAR_REQUEST_REMARK || "",
        requestedBy: d.VAR_REQUEST_REQSTBY || "",
        assignedTo: d.NUM_REQUEST_STAFFID || "",
        visitDate: d.VISITDATE ? formatDate(d.VISITDATE) : "",
      });
    } catch (err) {
      console.error("🔴 Error fetching details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data
  useEffect(() => {
    if (requestId) {
      fetchDetails();
      fetchStaffList();
    }
  }, [requestId, orgId]);

  // Submit
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("🟡 Submit Clicked:", values);

    try {
      const payload = {
        userId: user?.userId || "MBMCSPDTU",
        requestId,
        tankId,
        visitDate: values.visitDate,
        staffId: values.assignedTo,
        orgId,
      };

      console.log("🚀 Final Payload:", payload);

      await apiService.post("assignInspection", payload);

      alert("Inspection Assigned Successfully!");
      navigate(-1);

    } catch (err) {
      console.error("🔴 Submit Error:", err);
      alert("Failed to assign inspection!");
    }

    setSubmitting(false);
  };

  const renderRow = (field, label) => (
    <div className="col-md-4 mb-3">
      <Label text={`${label}:`} />
      <Field name={field} component={InputField} className="form-control" readOnly />
    </div>
  );

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text="Assign Inspection" />
        <hr />

        {loading ? <div className="alert alert-info">Loading...</div> : (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>

                {/* TANK DETAILS */}
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

                {/* REQUEST DETAILS */}
                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Tank Cleaning Request Details</h5>
                  <hr />
                  {renderRow("requestDate", "Request Date")}
                  {renderRow("serviceType", "Service Type")}
                  {renderRow("remarks", "Remarks")}
                  {renderRow("requestedBy", "Requested By")}
                </div>

                {/* ASSIGNMENT BLOCK */}
                <div className="card p-4 mb-4 shadow-sm">
                  <h5>Assign To Staff / Contractor</h5>
                  <hr />

                  <div className="row">
                    <div className="col-md-4">
                      <Label text="Assigned To *" />
                      <Field as="select" name="assignedTo" className="form-control">
                        <option value="">-- Select Staff --</option>
                        {staffList.map((s) => (
                          <option key={s.STAFFID} value={s.STAFFID}>
                            {s.STAFF_NAME}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="assignedTo" component="div" className="text-danger small mt-1" />
                    </div>

                    <div className="col-md-4">
                      <Label text="Visit Date *" />
                      <Field name="visitDate" component={InputField} type="date" className="form-control" />
                      <ErrorMessage name="visitDate" component="div" className="text-danger small mt-1" />
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="d-flex justify-content-center gap-3">
                  <SaveButton type="submit" text="Submit" disabled={isSubmitting} className="btn btn-success" />
                  <SaveButton type="button" text="Back" className="btn btn-secondary" onClick={() => navigate(-1)} />
                </div>

              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default FrmAssignInspection;


