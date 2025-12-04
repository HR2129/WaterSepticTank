
// // import React, { useState, useEffect } from "react";
// // import { Formik, Form, Field } from "formik";
// // import { Button, Row, Col, Card } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";
// // import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
// // import InputField from "../../../Components/InputField/InputField";
// // import Label from "../../../Components/Label/Label";
// // import CalendarIcon from "../../../Components/Calendar/CalendarIcon";
// // import RadioButton from "../../../Components/RadioButton/RadioButton";
// // import SaveButton from "../../../Components/Buttons_save/Savebutton";
// // import { useLanguage } from "../../../Context/LanguageProvider";
// // import Swal from "sweetalert2";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import apiService from "../../../../apiService"; // ✅ Import apiService

// // const CitizenTankRegistration = () => {
// //   const { translate } = useLanguage();
// //   const navigate = useNavigate();
// //   const [registrationDate, setRegistrationDate] = useState(null);
// //   const [requestDate, setRequestDate] = useState(null);

// //   // ✅ Dropdown Data States
// //   const [zoneList, setZoneList] = useState([]);
// //   const [wardList, setWardList] = useState([]);
// //   const [tankTypeList, setTankTypeList] = useState([]);
// //   const [ownerTypeList, setOwnerTypeList] = useState([]);
// //   const [serviceTypeList, setServiceTypeList] = useState([]);

// //   const OrgId = 890;

// //   // ✅ Fetch dropdown data on mount
// //   useEffect(() => {
// //     const fetchDropdownData = async () => {
// //       try {
// //         const [zoneRes, tankRes, ownerRes, serviceRes] = await Promise.all([
// //           apiService.post("getZoneList", { OrgId }),
// //           apiService.post("getTankTypeList", { OrgId }),
// //           apiService.post("getOwnerTypeList", { OrgId }),
// //           apiService.post("getServiceTypeList", { OrgId }),
// //         ]);

// //         if (zoneRes?.data?.data) {
// //           setZoneList(
// //             zoneRes.data.data.map((z) => ({
// //               label: z.ZONENAME,
// //               value: z.ZONEID,
// //             }))
// //           );
// //         }

// //         if (tankRes?.data?.data) {
// //           setTankTypeList(
// //             tankRes.data.data.map((t) => ({
// //               label: t.TYPENAME,
// //               value: t.TYPEID,
// //             }))
// //           );
// //         }

// //         if (ownerRes?.data?.data) {
// //           setOwnerTypeList(
// //             ownerRes.data.data.map((o) => ({
// //               label: o.OWNERTYPENAME,
// //               value: o.OWNERSHIPTYPEID,
// //             }))
// //           );
// //         }

// //         if (serviceRes?.data?.data) {
// //           setServiceTypeList(
// //             serviceRes.data.data.map((s) => ({
// //               label: s.SERVTYPE_NAME,
// //               value: s.SERVTYPE_ID,
// //             }))
// //           );
// //         }
// //       } catch (err) {
// //         console.error("❌ Error fetching dropdowns:", err);
// //       }
// //     };

// //     fetchDropdownData();
// //   }, []);

// //   // ✅ Fetch Ward List on Zone Change
// //   const handleZoneChange = async (e, form) => {
// //     const selectedZoneId = e.target.value;
// //     form.setFieldValue("zone", selectedZoneId);
// //     form.setFieldValue("prabhag", ""); // reset ward

// //     if (selectedZoneId) {
// //       try {
// //         const res = await apiService.post("getWardListByZone", {
// //           OrgId,
// //           ZoneId: selectedZoneId,
// //         });
// //         if (res?.data?.data) {
// //           setWardList(
// //             res.data.data.map((w) => ({
// //               label: w.WARDNAME,
// //               value: w.WARDID,
// //             }))
// //           );
// //         }
// //       } catch (err) {
// //         console.error("❌ Error fetching ward list:", err);
// //       }
// //     } else {
// //       setWardList([]);
// //     }
// //   };

// //   const initialValues = {
// //     ownerName: "",
// //     mobileNumber: "",
// //     email: "",
// //     propertyId: "",
// //     address: "",
// //     prabhag: "",
// //     zone: "",
// //     tankType: "",
// //     ownershipType: "",
// //     tankCapacity: "",
// //     latitude: "",
// //     longitude: "",
// //     status: "Active",
// //     serviceType: "",
// //     requestedBy: "",
// //     remarks: "",
// //   };

// //   // ✅ POST FORM DATA TO PROCEDURE API
// //   const handleSubmit = async (values, { resetForm }) => {


// //     // ✅ Simple field validation before API call
// //   if (!values.ownerName?.trim()) {
// //     alert("Please enter Owner Name.");
// //     return;
// //   }
// //   if (!values.mobileNumber?.trim()) {
// //     alert("Please enter Mobile Number.");
// //     return;
// //   }
// //   const mobilePattern = /^[6-9]\d{9}$/;
// //   if (!mobilePattern.test(values.mobileNumber)) {
// //     alert("Invalid mobile number");
// //     return;
// //   }
// //   if (!values.email?.trim()) {
// //     alert("Please enter Email.");
// //     return;
// //   }
// //   const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// //   if (!emailPattern.test(values.email)) {
// //     alert("Invalid email format.");
// //     return;
// //   }
// //   if (!values.address?.trim()) {
// //     alert("Please enter Address.");
// //     return;
// //   }
// //   if (!values.zone) {
// //     alert("Please select Zone.");
// //     return;
// //   }
// //   if (!values.prabhag) {
// //     alert("Please select Prabhag (Ward).");
// //     return;
// //   }
// //   if (!registrationDate) {
// //     alert("Please select Registration Date.");
// //     return;
// //   }
// //   if (!values.tankCapacity?.trim()) {
// //     alert("Please enter Tank Capacity.");
// //     return;
// //   }
// //   if (!values.tankType) {
// //     alert("Please select Tank Type.");
// //     return;
// //   }
// //   if (!values.ownershipType) {
// //     alert("Please select Ownership Type.");
// //     return;
// //   }
// //   if (!values.latitude?.trim()) {
// //     alert("Please enter Latitude.");
// //     return;
// //   }
// //   if (!values.longitude?.trim()) {
// //     alert("Please enter Longitude.");
// //     return;
// //   }
// //   if (!values.serviceType) {
// //     alert("Please select Service Type.");
// //     return;
// //   }
// //   if (!values.requestedBy?.trim()) {
// //     alert("Please enter Requested By.");
// //     return;
// //   }
// //   if (!values.remarks?.trim()) {
// //     alert("Please enter Remarks.");
// //     return;
// //   }



// //     const payload = {
// //       userId: "Citizen",
// //       mode: 1,
// //       requestId: null,
// //       tankId: 10,
// //       ownerName: values.ownerName,
// //       mobile: values.mobileNumber,
// //       emailId: values.email,
// //       address: values.address,
// //       prabhagId: parseInt(values.prabhag),
// //       zoneId: parseInt(values.zone),
// //       tankTypeId: parseInt(values.tankType),
// //       ownerTypeId: parseInt(values.ownershipType),
// //       capacity: parseInt(values.tankCapacity),
// //       propNo: values.propertyId,
// //       latitude: values.latitude,
// //       longitude: values.longitude,
// //       regDate: registrationDate
// //         ? registrationDate.toISOString().split("T")[0]
// //         : null,
// //       flag: values.status === "Active" ? "Y" : "N",
// //       reqDate: requestDate ? requestDate.toISOString().split("T")[0] : null,
// //       servId: parseInt(values.serviceType),
// //       reqstBy: values.requestedBy,
// //       remark: values.remarks,
// //       source: "WEB",
// //       status: "R",
// //       orgId: OrgId,
// //     };

// //     console.log("📤 Final Payload:", payload);

// //     try {
// //       const res = await apiService.post("TankRegistrtaion", payload);

// //       if (res?.data?.success) {
// //         // ✅ SweetAlert for Success
// //         Swal.fire({
// //           icon: "success",
// //           title: "Success",
// //           text: res.data.message,
// //           confirmButtonColor: "#3085d6",
// //         });

// //         resetForm();
// //         setRegistrationDate(null);
// //         setRequestDate(null);
// //       } else {
// //         // ✅ SweetAlert for Failure
// //         Swal.fire({
// //           icon: "warning",
// //           title: "Registration Failed",
// //           text: "Failed to register tank. Please try again.",
// //           confirmButtonColor: "#f8bb86",
// //         });
// //       }
// //     } catch (err) {
// //       console.error("❌ Error submitting form:", err);
// //       // ✅ SweetAlert for Error
// //       Swal.fire({
// //         icon: "error",
// //         title: "Error",
// //         text: "Something went wrong while submitting the form.",
// //         confirmButtonColor: "#d33",
// //       });
// //     }
// //   };

// //   return (
// //     <div className="min-vh-100 bg-light">
// //       <NavbarCitizen />

// //       <div className="container-fluid py-4">
// //         <Card className="shadow border-0 mx-auto" style={{ width: "90%" }}>
// //           <div className="card-header bg-white border-0 text-center">
// //             <h5 className="fw-bold text-uppercase mb-0">Register New Tank</h5>
// //           </div>

// //           <div className="card-body">
// //             <Formik initialValues={initialValues} onSubmit={handleSubmit}>
// //               {({ handleReset, setFieldValue }) => (
// //                 <Form>
// //                   {/* ---------------- Applicant Details ---------------- */}
// //                   <div className="bg-primary text-white fw-bold p-2 rounded mb-3">
// //                     Applicant Details
// //                   </div>

// //                   <Row className="mb-3">
// //                     <Col md={4}>
// //                       <Label text="Owner Name" required />
// //                       <Field name="ownerName" component={InputField} />
// //                     </Col>
// //                     <Col md={4}>
// //                       <Label text="Mobile Number" required />
// //                       <Field
// //                         name="mobileNumber"
// //                         component={InputField}
// //                         type="tel"
// //                       />
// //                     </Col>
// //                     <Col md={4}>
// //                       <Label text="Property ID" />
// //                       <Field name="propertyId" component={InputField} />
// //                     </Col>
// //                   </Row>

// //                   <Row className="mb-3">
// //                     <Col md={6}>
// //                       <Label text="Email" required />
// //                       <Field name="email" component={InputField} type="email" />
// //                     </Col>
// //                     <Col md={6}>
// //                       <Label text="Address" required />
// //                       <Field
// //                         name="address"
// //                         component={InputField}
// //                         as="textarea"
// //                         placeholder="Enter address"
// //                       />
// //                     </Col>
// //                   </Row>

// //                   {/* ---------------- Tank Details ---------------- */}
// //                   <div className="bg-primary text-white fw-bold p-2 rounded mb-3">
// //                     Tank Details
// //                   </div>

// //                   <Row className="mb-3">
// //                     <Col md={3}>
// //                       <Label text="Zone" required />
// //                       <Field
// //                         name="zone"
// //                         component={InputField}
// //                         type="dropdown"
// //                         options={zoneList}
// //                         placeholder="Select Zone"
// //                         onChange={(e, form) => handleZoneChange(e, form)}
// //                       />
// //                     </Col>

// //                     <Col md={3}>
// //                       <Label text="Prabhag (Ward)" required />
// //                       <Field
// //                         name="prabhag"
// //                         component={InputField}
// //                         type="dropdown"
// //                         options={wardList}
// //                         placeholder="Select Ward"
// //                       />
// //                     </Col>

// //                     <Col md={3}>
// //                       <Label text="Registration Date" required />
// //                       <CalendarIcon
// //                         selectedDate={registrationDate}
// //                         setSelectedDate={setRegistrationDate}
// //                         disablePastDates={true}
// //                       />
// //                     </Col>

// //                     <Col md={3}>
// //                       <Label text="Tank Capacity (Litres)" required />
// //                       <Field name="tankCapacity" component={InputField} />
// //                     </Col>
// //                   </Row>

// //                   <Row className="mb-3">
// //                     <Col md={3}>
// //                       <Label text="Tank Type" required />
// //                       <Field
// //                         name="tankType"
// //                         component={InputField}
// //                         type="dropdown"
// //                         options={tankTypeList}
// //                         placeholder="Select Tank Type"
// //                       />
// //                     </Col>

// //                     <Col md={3}>
// //                       <Label text="Ownership Type" required />
// //                       <Field
// //                         name="ownershipType"
// //                         component={InputField}
// //                         type="dropdown"
// //                         options={ownerTypeList}
// //                         placeholder="Select Ownership"
// //                       />
// //                     </Col>

// //                     <Col md={3}>
// //                       <Label text="Latitude" required />
// //                       <Field name="latitude" component={InputField} />
// //                     </Col>

// //                     <Col md={3}>
// //                       <Label text="Longitude" required />
// //                       <Field name="longitude" component={InputField} />
// //                     </Col>
// //                   </Row>

// //                   <Row className="mb-3">
// //                     <Col md={3}>
// //                       <Label text="Status" />
// //                       <div className="d-flex mt-2">
// //                         <Field
// //                           name="status"
// //                           component={RadioButton}
// //                           label="Active"
// //                           value="Active"
// //                           id="statusActive"
// //                         />
// //                         <Field
// //                           name="status"
// //                           component={RadioButton}
// //                           label="InActive"
// //                           value="InActive"
// //                           id="statusInActive"
// //                         />
// //                       </div>
// //                     </Col>
// //                   </Row>

// //                   {/* ---------------- Cleaning Request ---------------- */}
// //                   <div className="bg-primary text-white fw-bold p-2 rounded mb-3">
// //                     Cleaning Request
// //                   </div>

// //                   <Row className="mb-3">
// //                     <Col md={4}>
// //                       <Label text="Request Date" />
// //                       <CalendarIcon
// //                         selectedDate={requestDate}
// //                         setSelectedDate={setRequestDate}
// //                         disablePastDates={false}
// //                       />
// //                     </Col>

// //                     <Col md={4}>
// //                       <Label text="Service Type" required />
// //                       <Field
// //                         name="serviceType"
// //                         component={InputField}
// //                         type="dropdown"
// //                         options={serviceTypeList}
// //                         placeholder="Select Service"
// //                       />
// //                     </Col>

// //                     <Col md={4}>
// //                       <Label text="Requested By" required />
// //                       <Field name="requestedBy" component={InputField} />
// //                     </Col>
// //                   </Row>

// //                   <Row className="mb-4">
// //                     <Col md={6}>
// //                       <Label text="Remarks" required />
// //                       <Field
// //                         name="remarks"
// //                         component={InputField}
// //                         as="textarea"
// //                         placeholder="Enter remarks"
// //                       />
// //                     </Col>
// //                   </Row>

// //                   {/* ---------------- Buttons ---------------- */}

// //                   <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
// //                     <SaveButton
// //                       type="submit"
// //                       text="Request"
// //                       onClick={handleSubmit} // Formik handles submit automatically
// //                     />
// //                     <SaveButton
// //                       type="button"
// //                       text={translate("Back")}
// //                       onClick={() => navigate("/FrmCitizenDashboard")}
// //                     />
// //                     <SaveButton
// //                       type="reset"
// //                       text="Reset"
// //                       onClick={handleReset}
// //                     />
// //                   </div>
// //                 </Form>
// //               )}
// //             </Formik>
// //           </div>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CitizenTankRegistration;



// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import { Button, Row, Col, Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
// import InputField from "../../../Components/InputField/InputField";
// import Label from "../../../Components/Label/Label";
// import CalendarIcon from "../../../Components/Calendar/CalendarIcon";
// import RadioButton from "../../../Components/RadioButton/RadioButton";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";
// import apiService from "../../../../apiService"; // ✅ Import apiService

// const CitizenTankRegistration = () => {
//   const { translate } = useLanguage();
//   const navigate = useNavigate();
//  const [registrationDate, setRegistrationDate] = useState(new Date());
//   const [requestDate, setRequestDate] = useState(null);

//   // ✅ Dropdown Data States
//   const [zoneList, setZoneList] = useState([]);
//   const [wardList, setWardList] = useState([]);
//   const [tankTypeList, setTankTypeList] = useState([]);
//   const [ownerTypeList, setOwnerTypeList] = useState([]);
//   const [serviceTypeList, setServiceTypeList] = useState([]);

//   const OrgId = 890;

//   // ✅ Fetch dropdown data on mount
//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       try {
//         const [zoneRes, tankRes, ownerRes, serviceRes] = await Promise.all([
//           apiService.post("getZoneList", { OrgId }),
//           apiService.post("getTankTypeList", { OrgId }),
//           apiService.post("getOwnerTypeList", { OrgId }),
//           apiService.post("getServiceTypeList", { OrgId }),
//         ]);

//         if (zoneRes?.data?.data) {
//           setZoneList(
//             zoneRes.data.data.map((z) => ({
//               label: z.ZONENAME,
//               value: z.ZONEID,
//             }))
//           );
//         }

//         if (tankRes?.data?.data) {
//           setTankTypeList(
//             tankRes.data.data.map((t) => ({
//               label: t.TYPENAME,
//               value: t.TYPEID,
//             }))
//           );
//         }

//         if (ownerRes?.data?.data) {
//           setOwnerTypeList(
//             ownerRes.data.data.map((o) => ({
//               label: o.OWNERTYPENAME,
//               value: o.OWNERSHIPTYPEID,
//             }))
//           );
//         }

//         if (serviceRes?.data?.data) {
//           setServiceTypeList(
//             serviceRes.data.data.map((s) => ({
//               label: s.SERVTYPE_NAME,
//               value: s.SERVTYPE_ID,
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("❌ Error fetching dropdowns:", err);
//       }
//     };

//     fetchDropdownData();
//   }, []);

//   // ✅ Fetch Ward List on Zone Change
//   const handleZoneChange = async (e, form) => {
//     const selectedZoneId = e.target.value;
//     form.setFieldValue("zone", selectedZoneId);
//     form.setFieldValue("prabhag", ""); // reset ward

//     if (selectedZoneId) {
//       try {
//         const res = await apiService.post("getWardListByZone", {
//           OrgId,
//           ZoneId: selectedZoneId,
//         });
//         if (res?.data?.data) {
//           setWardList(
//             res.data.data.map((w) => ({
//               label: w.WARDNAME,
//               value: w.WARDID,
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("❌ Error fetching ward list:", err);
//       }
//     } else {
//       setWardList([]);
//     }
//   };

//   const initialValues = {
//     ownerName: "",
//     mobileNumber: "",
//     email: "",
//     propertyId: "",
//     address: "",
//     prabhag: "",
//     zone: "",
//     tankType: "",
//     ownershipType: "",
//     tankCapacity: "",
//     latitude: "23.026927",
//     longitude: "72.645422",
//     status: "Active",
//     serviceType: "",
//     requestedBy: "",
//     remarks: "",
//   };

//   // ✅ POST FORM DATA TO PROCEDURE API
//   const handleSubmit = async (values, { resetForm }) => {


//     // ✅ Simple field validation before API call
//   if (!values.ownerName?.trim()) {
//     alert("Please enter Owner Name.");
//     return;
//   }
//   if (!values.mobileNumber?.trim()) {
//     alert("Please enter Mobile Number.");
//     return;
//   }
//   const mobilePattern = /^[6-9]\d{9}$/;
//   if (!mobilePattern.test(values.mobileNumber)) {
//     alert("Invalid mobile number");
//     return;
//   }
//   if (!values.email?.trim()) {
//     alert("Please enter Email.");
//     return;
//   }
//   const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
//   if (!emailPattern.test(values.email)) {
//     alert("Invalid email format.");
//     return;
//   }
//   if (!values.address?.trim()) {
//     alert("Please enter Address.");
//     return;
//   }
//   if (!values.zone) {
//     alert("Please select Zone.");
//     return;
//   }
//   if (!values.prabhag) {
//     alert("Please select Prabhag (Ward).");
//     return;
//   }
//   if (!registrationDate) {
//     alert("Please select Registration Date.");
//     return;
//   }
//   if (!values.tankCapacity?.trim()) {
//     alert("Please enter Tank Capacity.");
//     return;
//   }
//   if (!values.tankType) {
//     alert("Please select Tank Type.");
//     return;
//   }
//   if (!values.ownershipType) {
//     alert("Please select Ownership Type.");
//     return;
//   }
//   if (!values.latitude?.trim()) {
//     alert("Please enter Latitude.");
//     return;
//   }
//   if (!values.longitude?.trim()) {
//     alert("Please enter Longitude.");
//     return;
//   }
//   if (!values.serviceType) {
//     alert("Please select Service Type.");
//     return;
//   }
//   if (!values.requestedBy?.trim()) {
//     alert("Please enter Requested By.");
//     return;
//   }
//   if (!values.remarks?.trim()) {
//     alert("Please enter Remarks.");
//     return;
//   }


// debugger;
//     const payload = {
//       userId: "Citizen",
//       mode: 1,
//       requestId: null,
//       tankId: null,
//       ownerName: values.ownerName,
//       mobile: values.mobileNumber,
//       emailId: values.email,
//       address: values.address,
//       prabhagId: parseInt(values.zone),
//       zoneId: parseInt(values.prabhag),
//       tankTypeId: parseInt(values.tankType),
//       ownerTypeId: parseInt(values.ownershipType),
//       capacity: parseInt(values.tankCapacity),
//       propNo: values.propertyId,
//       latitude: values.latitude,
//       longitude: values.longitude,
//       regDate: registrationDate
//         ? registrationDate.toISOString().split("T")[0]
//         : null,
//       flag: values.status === "Active" ? "Y" : "N",
//       reqDate: requestDate ? requestDate.toISOString().split("T")[0] : null,
//       servId: parseInt(values.serviceType),
//       reqstBy: values.requestedBy,
//       remark: values.remarks,
//       source: "WEB",
//       status: "R",
//       orgId: OrgId,
//     };

//     console.log("📤 Final Payload:", payload);

//     try {
//       const res = await apiService.post("TankRegistrtaion", payload);

//       if (res?.data?.success) {
//         // ✅ SweetAlert for Success
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: res.data.message,
//           confirmButtonColor: "#3085d6",
//         });

//         resetForm();
//         setRegistrationDate(null);
//         setRequestDate(null);
//       } else {
//         // ✅ SweetAlert for Failure
//         Swal.fire({
//           icon: "warning",
//           title: "Registration Failed",
//           text: "Failed to register tank. Please try again.",
//           confirmButtonColor: "#f8bb86",
//         });
//       }
//     } catch (err) {
//       console.error("❌ Error submitting form:", err);
//       // ✅ SweetAlert for Error
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Something went wrong while submitting the form.",
//         confirmButtonColor: "#d33",
//       });
//     }
//   };

//   return (
//     <div className="min-vh-100 bg-light">
//       <NavbarCitizen />

//       <div className="container-fluid py-4">
//         <Card className="shadow border-0 mx-auto" style={{ width: "90%" }}>
//           <div className="card-header bg-white border-0 text-center">
//             <h5 className="fw-bold text-uppercase mb-0">Register New Tank</h5>
//           </div>

//           <div className="card-body">
//             <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//               {({ handleReset, setFieldValue }) => (
//                 <Form>
//                   {/* ---------------- Applicant Details ---------------- */}
//                   <div className="bg-primary text-white fw-bold p-2 rounded mb-3">
//                     Applicant Details
//                   </div>

//                   <Row className="mb-3">
//                     <Col md={4}>
//                       <Label text="Owner Name" required />
//                       <Field name="ownerName" component={InputField} />
//                     </Col>
//                     <Col md={4}>
//                       <Label text="Mobile Number" required />
//                       <Field
//                         name="mobileNumber"
//                         component={InputField}
//                         type="tel"
//                       />
//                     </Col>
//                     <Col md={4}>
//                       <Label text="Property ID" />
//                       <Field name="propertyId" component={InputField} />
//                     </Col>
//                   </Row>

//                   <Row className="mb-3">
//                     <Col md={6}>
//                       <Label text="Email" required />
//                       <Field name="email" component={InputField} type="email" />
//                     </Col>
//                     <Col md={6}>
//                       <Label text="Address" required />
//                       <Field
//                         name="address"
//                         component={InputField}
//                         as="textarea"
//                         placeholder="Enter address"
//                       />
//                     </Col>
//                   </Row>

//                   {/* ---------------- Tank Details ---------------- */}
//                   <div className="bg-primary text-white fw-bold p-2 rounded mb-3">
//                     Tank Details
//                   </div>

//                   <Row className="mb-3">
//                     <Col md={3}>
//                     <Label text="Prabhag" required />
//                       <Field
//                         name="zone"
//                         component={InputField}
//                         type="dropdown"
//                         options={zoneList}
//                         placeholder="Select Zone"
//                         onChange={(e, form) => handleZoneChange(e, form)}
//                       />
//                     </Col>

//                     <Col md={3}>
//                       <Label text="Zone" required />
//                       <Field
//                         name="prabhag"
//                         component={InputField}
//                         type="dropdown"
//                         options={wardList}
//                         placeholder="Select Ward"
//                       />
//                     </Col>

//                     <Col md={3}>
//                       <Label text="Registration Date" required />
//                       <CalendarIcon
//                         selectedDate={registrationDate}
//                         setSelectedDate={setRegistrationDate}
//                         disablePastDates={true}
//                       />
//                     </Col>

//                     <Col md={3}>
//                       <Label text="Tank Capacity (Litres)" required />
//                       <Field name="tankCapacity" component={InputField} />
//                     </Col>
//                   </Row>

//                   <Row className="mb-3">
//                     <Col md={3}>
//                       <Label text="Tank Type" required />
//                       <Field
//                         name="tankType"
//                         component={InputField}
//                         type="dropdown"
//                         options={tankTypeList}
//                         placeholder="Select Tank Type"
//                       />
//                     </Col>

//                     <Col md={3}>
//                       <Label text="Ownership Type" required />
//                       <Field
//                         name="ownershipType"
//                         component={InputField}
//                         type="dropdown"
//                         options={ownerTypeList}
//                         placeholder="Select Ownership"
//                       />
//                     </Col>

//                     <Col md={3}>
//                       <Label text="Latitude" required />
//                       <Field name="latitude" component={InputField} />
//                     </Col>

//                     <Col md={3}>
//                       <Label text="Longitude" required />
//                       <Field name="longitude" component={InputField} />
//                     </Col>
//                   </Row>

//                   <Row className="mb-3">
//                     <Col md={3}>
//                       <Label text="Status" />
//                       <div className="d-flex mt-2">
//                         <Field
//                           name="status"
//                           component={RadioButton}
//                           label="Active"
//                           value="Active"
//                           id="statusActive"
//                         />
//                         <Field
//                           name="status"
//                           component={RadioButton}
//                           label="InActive"
//                           value="InActive"
//                           id="statusInActive"
//                         />
//                       </div>
//                     </Col>
//                   </Row>

//                   {/* ---------------- Cleaning Request ---------------- */}
//                   <div className="bg-primary text-white fw-bold p-2 rounded mb-3">
//                     Cleaning Request
//                   </div>

//                   <Row className="mb-3">
//                     <Col md={4}>
//                       <Label text="Request Date" />
//                       <CalendarIcon
//                         selectedDate={requestDate}
//                         setSelectedDate={setRequestDate}
//                         disablePastDates={false}
//                       />
//                     </Col>

//                     <Col md={4}>
//                       <Label text="Service Type" required />
//                       <Field
//                         name="serviceType"
//                         component={InputField}
//                         type="dropdown"
//                         options={serviceTypeList}
//                         placeholder="Select Service"
//                       />
//                     </Col>

//                     <Col md={4}>
//                       <Label text="Requested By" required />
//                       <Field name="requestedBy" component={InputField} />
//                     </Col>
//                   </Row>

//                   <Row className="mb-4">
//                     <Col md={6}>
//                       <Label text="Remarks" required />
//                       <Field
//                         name="remarks"
//                         component={InputField}
//                         as="textarea"
//                         placeholder="Enter remarks"
//                       />
//                     </Col>
//                   </Row>

//                   {/* ---------------- Buttons ---------------- */}

//                   <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
//                     <SaveButton
//                       type="submit"
//                       text="Request"
//                       onClick={handleSubmit} // Formik handles submit automatically
//                     />
//                     <SaveButton
//                       type="button"
//                       text={translate("Back")}
//                       onClick={() => navigate("/FrmCitizenDashboard")}
//                     />
//                     <SaveButton
//                       type="reset"
//                       text="Reset"
//                       onClick={handleReset}
//                     />
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CitizenTankRegistration;




import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
import InputField from "../../../Components/InputField/InputField";
import Label from "../../../Components/Label/Label";
import CalendarIcon from "../../../Components/Calendar/CalendarIcon";
import RadioButton from "../../../Components/RadioButton/RadioButton";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useLanguage } from "../../../Context/LanguageProvider";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import apiService from "../../../../apiService"; // ✅ Import apiService
import { useLoader } from "../../../Context/LoaderContext";

const CitizenTankRegistration = () => {
  const { translate } = useLanguage();
 const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [registrationDate, setRegistrationDate] = useState(new Date());
  const [requestDate, setRequestDate] = useState(null);

  // ✅ Dropdown Data States
  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [tankTypeList, setTankTypeList] = useState([]);
  const [ownerTypeList, setOwnerTypeList] = useState([]);
  const [serviceTypeList, setServiceTypeList] = useState([]);

  const OrgId = 890;

  // ✅ Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [zoneRes, tankRes, ownerRes, serviceRes] = await Promise.all([
          apiService.post("getZoneList", { OrgId }),
          apiService.post("getTankTypeList", { OrgId }),
          apiService.post("getOwnerTypeList", { OrgId }),
          apiService.post("getServiceTypeList", { OrgId }),
        ]);

        if (zoneRes?.data?.data) {
          setZoneList(
            zoneRes.data.data.map((z) => ({
              label: z.ZONENAME,
              value: z.ZONEID,
            }))
          );
        }

        if (tankRes?.data?.data) {
          setTankTypeList(
            tankRes.data.data.map((t) => ({
              label: t.TYPENAME,
              value: t.TYPEID,
            }))
          );
        }

        if (ownerRes?.data?.data) {
          setOwnerTypeList(
            ownerRes.data.data.map((o) => ({
              label: o.OWNERTYPENAME,
              value: o.OWNERSHIPTYPEID,
            }))
          );
        }

        if (serviceRes?.data?.data) {
          setServiceTypeList(
            serviceRes.data.data.map((s) => ({
              label: s.SERVTYPE_NAME,
              value: s.SERVTYPE_ID,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Error fetching dropdowns:", err);
      }
    };

    fetchDropdownData();
  }, []);

  // ✅ Fetch Ward List on Zone Change
  const handleZoneChange = async (e, form) => {
    const selectedZoneId = e.target.value;
    form.setFieldValue("zone", selectedZoneId);
    form.setFieldValue("prabhag", ""); // reset ward

    if (selectedZoneId) {
      try {
        const res = await apiService.post("getWardListByZone", {
          OrgId,
          ZoneId: selectedZoneId,
        });
        if (res?.data?.data) {
          setWardList(
            res.data.data.map((w) => ({
              label: w.WARDNAME,
              value: w.WARDID,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Error fetching ward list:", err);
      }
    } else {
      setWardList([]);
    }
  };

  const initialValues = {
    ownerName: "",
    mobileNumber: "",
    email: "",
    propertyId: "",
    address: "",
    prabhag: "",
    zone: "",
    tankType: "",
    ownershipType: "",
    tankCapacity: "",
    latitude: "23.026927",
    longitude: "72.645422",
    status: "Active",
    serviceType: "",
    requestedBy: "",
    remarks: "",
  };

  // ✅ POST FORM DATA TO PROCEDURE API
  const handleSubmit = async (values, { resetForm }) => {
    if (!values.ownerName?.trim()) {
      Swal.fire({ text: "Please enter Owner Name." });
      return;
    }

    if (!values.mobileNumber?.trim()) {
      Swal.fire({ text: "Please enter Mobile Number." });
      return;
    }

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(values.mobileNumber)) {
      Swal.fire({ text: "Invalid mobile number." });
      return;
    }

    if (!values.email?.trim()) {
      Swal.fire({ text: "Please enter Email." });
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(values.email)) {
      Swal.fire({ text: "Invalid email format." });
      return;
    }

    if (!values.address?.trim()) {
      Swal.fire({ text: "Please enter Address." });
      return;
    }

    if (!values.zone) {
      Swal.fire({ text: "Please select Zone." });
      return;
    }

    if (!values.prabhag) {
      Swal.fire({ text: "Please select Prabhag (Ward)." });
      return;
    }

    if (!registrationDate) {
      Swal.fire({ text: "Please select Registration Date." });
      return;
    }

    if (!values.tankCapacity?.trim()) {
      Swal.fire({ text: "Please enter Tank Capacity." });
      return;
    }

    if (!values.tankType) {
      Swal.fire({ text: "Please select Tank Type." });
      return;
    }

    if (!values.ownershipType) {
      Swal.fire({ text: "Please select Ownership Type." });
      return;
    }

    if (!values.latitude?.trim()) {
      Swal.fire({ text: "Please enter Latitude." });
      return;
    }

    if (!values.longitude?.trim()) {
      Swal.fire({ text: "Please enter Longitude." });
      return;
    }

    if (!values.serviceType) {
      Swal.fire({ text: "Please select Service Type." });
      return;
    }

    if (!values.requestedBy?.trim()) {
      Swal.fire({ text: "Please enter Requested By." });
      return;
    }

    if (!values.remarks?.trim()) {
      Swal.fire({ text: "Please enter Remarks." });
      return;
    }

    debugger;
    const payload = {
      userId: "Citizen",
      mode: 1,
      requestId: null,
      tankId: null,
      ownerName: values.ownerName,
      mobile: values.mobileNumber,
      emailId: values.email,
      address: values.address,
      prabhagId: parseInt(values.zone),
      zoneId: parseInt(values.prabhag),
      tankTypeId: parseInt(values.tankType),
      ownerTypeId: parseInt(values.ownershipType),
      capacity: parseInt(values.tankCapacity),
      propNo: values.propertyId,
      latitude: values.latitude,
      longitude: values.longitude,
      regDate: registrationDate
        ? registrationDate.toISOString().split("T")[0]
        : null,
      flag: values.status === "Active" ? "Y" : "N",
      reqDate: requestDate ? requestDate.toISOString().split("T")[0] : null,
      servId: parseInt(values.serviceType),
      reqstBy: values.requestedBy,
      remark: values.remarks,
      source: "WEB",
      status: "R",
      orgId: OrgId,
    };

    console.log("📤 Final Payload:", payload);

    try {
       setLoading(true);
      const res = await apiService.post("TankRegistrtaion", payload);

      if (res?.data?.success) {
        // ✅ SweetAlert for Success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          confirmButtonColor: "#3085d6",
        });

        resetForm();
        setRegistrationDate(null);
        setRequestDate(null);
      } else {
        // ✅ SweetAlert for Failure
        Swal.fire({
          icon: "warning",
          title: "Registration Failed",
          text: "Failed to register tank. Please try again.",
          confirmButtonColor: "#f8bb86",
        });
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      // ✅ SweetAlert for Error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting the form.",
        confirmButtonColor: "#d33",
      });
    } finally{
       setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <NavbarCitizen />

      <div className="container-fluid py-4">
        <Card className="shadow border-0 mx-auto" style={{ width: "90%" }}>
          <div className="card-header bg-white border-0 text-center">
            <h5 className="fw-bold text-uppercase mb-0">Register New Tank</h5>
          </div>

          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ handleReset, setFieldValue }) => (
                <Form>
                  {/* ---------------- Applicant Details ---------------- */}
                  <div className="text-white fw-bold p-2 rounded mb-3" style={{ backgroundColor: "#97c1f7" }}>
                    Applicant Details
                  </div>

                  <Row className="mb-3">
                    <Col md={4}>
                      <Label text="Owner Name" required />
                      <Field name="ownerName" component={InputField} />
                    </Col>
                    <Col md={4}>
                      <Label text="Mobile Number" required />
                      <Field
                        name="mobileNumber"
                        component={InputField}
                        type="tel"
                      />
                    </Col>
                    <Col md={4}>
                      <Label text="Property ID" />
                      <Field name="propertyId" component={InputField} />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Label text="Email" required />
                      <Field name="email" component={InputField} type="email" />
                    </Col>
                    <Col md={6}>
                      <Label text="Address" required />
                      <Field
                        name="address"
                        component={InputField}
                        as="textarea"
                        placeholder="Enter address"
                      />
                    </Col>
                  </Row>

                  {/* ---------------- Tank Details ---------------- */}
                  <div className="text-white fw-bold p-2 rounded mb-3" style={{ backgroundColor: "#97c1f7" }}>
                    Tank Details
                  </div>

                  <Row className="mb-3">
                    <Col md={3}>
                      <Label text="Prabhag" required />
                      <Field
                        name="zone"
                        component={InputField}
                        type="dropdown"
                        options={zoneList}
                        placeholder="Select Zone"
                        onChange={(e, form) => handleZoneChange(e, form)}
                      />
                    </Col>

                    <Col md={3}>
                      <Label text="Zone" required />
                      <Field
                        name="prabhag"
                        component={InputField}
                        type="dropdown"
                        options={wardList}
                        placeholder="Select Ward"
                      />
                    </Col>

                    <Col md={3}>
                      <Label text="Registration Date" required />
                      <CalendarIcon
                        selectedDate={registrationDate}
                        setSelectedDate={setRegistrationDate}
                        disablePastDates={true}
                      />
                    </Col>

                    <Col md={3}>
                      <Label text="Tank Capacity (Litres)" required />
                      <Field name="tankCapacity" component={InputField} type="number"/>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={3}>
                      <Label text="Tank Type" required />
                      <Field
                        name="tankType"
                        component={InputField}
                        type="dropdown"
                        options={tankTypeList}
                        placeholder="Select Tank Type"
                      />
                    </Col>

                    <Col md={3}>
                      <Label text="Ownership Type" required />
                      <Field
                        name="ownershipType"
                        component={InputField}
                        type="dropdown"
                        options={ownerTypeList}
                        placeholder="Select Ownership"
                      />
                    </Col>

                    <Col md={3}>
                      <Label text="Latitude" required />
                      <Field name="latitude" component={InputField} />
                    </Col>

                    <Col md={3}>
                      <Label text="Longitude" required />
                      <Field name="longitude" component={InputField} />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={3}>
                      <Label text="Status" />
                      <div className="d-flex mt-2">
                        <Field
                          name="status"
                          component={RadioButton}
                          label="Active"
                          value="Active"
                          id="statusActive"
                        />
                        <Field
                          name="status"
                          component={RadioButton}
                          label="InActive"
                          value="InActive"
                          id="statusInActive"
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* ---------------- Cleaning Request ---------------- */}
                  <div className="text-white fw-bold p-2 rounded mb-3" style={{ backgroundColor: "#97c1f7" }}>
                    Cleaning Request
                  </div>

                  <Row className="mb-3">
                    <Col md={4}>
                      <Label text="Request Date" />
                      <CalendarIcon
                        selectedDate={requestDate}
                        setSelectedDate={setRequestDate}
                        disablePastDates={true}
                      />
                    </Col>

                    <Col md={4}>
                      <Label text="Service Type" required />
                      <Field
                        name="serviceType"
                        component={InputField}
                        type="dropdown"
                        options={serviceTypeList}
                        placeholder="Select Service"
                      />
                    </Col>

                    <Col md={4}>
                      <Label text="Requested By" required />
                      <Field name="requestedBy" component={InputField} />
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Label text="Remarks" required />
                      <Field
                        name="remarks"
                        component={InputField}
                        as="textarea"
                        placeholder="Enter remarks"
                      />
                    </Col>
                  </Row>

                  {/* ---------------- Buttons ---------------- */}

                  <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                    <SaveButton
                      type="submit"
                      text="Request"
                      onClick={handleSubmit} // Formik handles submit automatically
                    />
                    <SaveButton
                      type="button"
                      text={translate("Back")}
                      onClick={() => navigate("/FrmCitizenDashboard")}
                    />
                    <SaveButton
                      type="reset"
                      text="Reset"
                      onClick={handleReset}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CitizenTankRegistration;
