// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";

// import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
// import InputField from "../../../Components/InputField/InputField";
// import RadioButton from "../../../Components/RadioButton/RadioButton";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import Label from "../../../Components/Label/Label";
// import { useLanguage } from "../../../Context/LanguageProvider";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";
// import { useMasterData } from "../../../Context/MasterDataContext";

// function FrmRateConfigMst() {
//   const { translate } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { selectedRate, setSelectedRate } = useMasterData();

//   const isEditMode = Boolean(selectedRate);
//   const [ulbOptions, setUlbOptions] = useState([]);
//   const [loadingUlb, setLoadingUlb] = useState(true);
//   const [initialValues, setInitialValues] = useState(null);

//   useEffect(() => {
//     console.group("🏁 FrmRateConfigMst Mount");
//     console.log("👤 User Info:", user);
//     console.log("📄 selectedRate from context:", selectedRate);
//     console.log("✳️ isEditMode:", isEditMode);

//     const fetchUlbList = async () => {
//       try {
//         const payload = { orgId: parseInt(user?.ulbId) };
//         console.log("📤 Fetching ULB list — Payload:", payload);

//         const response = await apiService.post("CorporationDropdown", payload);
//         console.log("📥 ULB Response:", response);

//         const list = response?.data?.data || [];
//         const mapped = list.map((ulb) => ({
//           value: ulb.CORPID,
//           label: ulb.CORPNAME,
//         }));
//         setUlbOptions(mapped);

//         // ✅ Normalize API data for form
//         if (isEditMode && selectedRate) {
//           console.log("🧾 Setting initialValues for edit mode:", selectedRate);

//           const normalizeRateType = (type) => {
//             if (!type) return "";
//             const t = type.toString().trim().toLowerCase();
//             if (t.includes("waste")) return "W"; // ✅ Backend uses 'Waste Based'
//             if (t.includes("water")) return "W"; // ✅ Safe fallback
//             if (t.includes("distance")) return "D";
//             if (t === "w") return "W";
//             if (t === "d") return "D";
//             return "";
//           };

//           const normalizeStatus = (status) => {
//             if (!status) return "Y";
//             const s = status.toString().trim().toLowerCase();
//             return s === "active" || s === "y" ? "Y" : "N";
//           };

//           const normalizedType = normalizeRateType(selectedRate.RATETYPE);
//           const normalizedStatus = normalizeStatus(selectedRate.STATUS);

//           console.log("✅ Normalized Rate Type:", normalizedType);
//           console.log("✅ Normalized Status:", normalizedStatus);

//           setInitialValues({
//             ulbId: selectedRate.ORGID || user?.ulbId || "",
//             rateType: normalizedType,
//             from: selectedRate.SLABFROM || "",
//             to: selectedRate.SLABTO || "",
//             amount: selectedRate.RATEAMOUNT || "0.00",
//             in_status: normalizedStatus,
//           });
//         } else {
//           console.log("🆕 Setting blank form for Add Mode");
//           setInitialValues({
//             ulbId: user?.ulbId || "",
//             rateType: "",
//             from: "",
//             to: "",
//             amount: "0.00",
//             in_status: "Y",
//           });
//         }
//       } catch (err) {
//         console.error("❌ Error fetching ULB List:", err);
//       } finally {
//         setLoadingUlb(false);
//         console.groupEnd();
//       }
//     };

//     if (user?.ulbId) fetchUlbList();
//   }, [user?.ulbId, selectedRate]);

//   // 🧩 Validation Schema
//   const validationSchema = Yup.object({
//     ulbId: Yup.string().required(translate("ULB Name is required")),
//     rateType: Yup.string().required(translate("Rate Type is required")),
//     from: Yup.number()
//       .required(translate("From value is required"))
//       .min(0, translate("Invalid value")),
//     to: Yup.number()
//       .required(translate("To value is required"))
//       .min(0, translate("Invalid value")),
//     amount: Yup.number()
//       .required(translate("Amount is required"))
//       .min(0.01, translate("Amount must be greater than zero")),
//     in_status: Yup.string().required(translate("Please select a status")),
//   });

//   // 🟢 Submit Handler
//   const handleSubmit = async (values, { setSubmitting }) => {
//     console.group("🟢 handleSubmit — Saving Rate Config");
//     console.log("📤 Submitted Values:", values);
//     console.log("✳️ Mode:", isEditMode ? "EDIT" : "ADD");
//     console.log("📄 Current selectedRate:", selectedRate);

//     const payload = {
//       in_userid: user?.userId || "Admin",
//       in_mode: isEditMode ? 2 : 1,
//       in_rate_id: isEditMode ? selectedRate.RATEID : 0,
//       in_typecode: values.rateType,
//       in_slabfrom: Number(values.from),
//       in_slabto: Number(values.to),
//       in_rate: Number(values.amount),
//       in_flag: values.in_status,
//       in_orgid: values.ulbId,
//     };
//     console.log("📦 Final API Payload:", payload);

//     try {
//       console.log("📡 Calling API: InsertRateConfig");
//       const response = await apiService.post("InsertRateConfig", payload);
//       console.log("📥 Raw API Response:", response);

//       const data = response?.data;
//       console.log("🔍 Parsed API Data:", data);

//       // 🔎 Check for typical backend patterns
//       if (!data) {
//         alert("⚠️ No response data from server.");
//         console.groupEnd();
//         return;
//       }

//       if (data?.errorCode && data.errorCode !== 9999) {
//         console.warn("⚠️ Backend returned warning code:", data.errorCode);
//       }

//       if (data?.success) {
//         console.log("✅ Backend confirmed success.");
//         console.log("🧾 Response Object:", data);

//         if (data?.errorCode === 9999 || !data.errorCode) {
//           alert(
//             isEditMode
//               ? "✅ Rate configuration updated successfully!"
//               : "✅ Rate configuration added successfully!"
//           );

//           console.log("🔄 Clearing selectedRate and redirecting to list...");
//           setSelectedRate(null);

//           // Add short delay so DB commit finishes before fetching
//           setTimeout(() => {
//             console.log("🌐 Navigating to /Masters/FrmRateConfigList");
//             navigate("/Masters/FrmRateConfigList", { state: { refresh: true } });
//           }, 800);
//         } else if (data.errorCode === -150) {
//           alert("⚠️ Slab already exists! Choose a different range.");
//         } else {
//           alert(`⚠️ ${data.errorMsg || "Unexpected backend response"}`);
//         }
//       } else {
//         console.error("❌ Backend returned failure response:", data);
//         alert(`❌ Failed: ${data?.errorMsg || "Unknown backend error"}`);
//       }
//     } catch (err) {
//       console.error("🚨 API Error (InsertRateConfig):", err);
//       alert("❌ Failed to save record. Check console for details.");
//     } finally {
//       console.groupEnd();
//       setSubmitting(false);
//     }
//   };

//   // 🟠 Cancel Button
//   const handleCancel = () => {
//     console.log("🚪 Cancel clicked — clearing selectedRate and returning to list");
//     setSelectedRate(null);
//     navigate("/Masters/FrmRateConfigList");
//   };

//   const rateTypeOptions = [
//     { value: "", label: "- Select Type -" },
//     { value: "W", label: "Waste Based" },
//     { value: "D", label: "Distance Based" },
//   ];

//   if (loadingUlb || !initialValues) {
//     console.log("⏳ Waiting for initialValues or ULB data...");
//     return (
//       <div className="text-center mt-5">
//         <h6>⏳ Loading form data...</h6>
//       </div>
//     );
//   }

//   console.log("🎯 Final Form Initial Values Before Render:", initialValues);

//   return (
//     <div className="main-wrapper">
//       <div className="container mt-4">
//         <HeaderLabel
//           text={
//             isEditMode
//               ? translate("Update Rate Configuration")
//               : translate("Add Rate Configuration")
//           }
//         />
//         <hr />

//         <Formik
//           enableReinitialize
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="mt-4">
//               {/* 🔒 ULB Dropdown */}
//               <div className="row mb-4">
//                 <div className="col-md-12">
//                   <Label text={translate("ULB Name")}  />
//                   <Field
//                     as="select"
//                     name="ulbId"
//                     className="form-control"
//                     disabled
//                   >
//                     <option value="">Select ULB</option>
//                     {ulbOptions.map((ulb) => (
//                       <option key={ulb.value} value={ulb.value}>
//                         {ulb.label}
//                       </option>
//                     ))}
//                   </Field>
//                   <ErrorMessage
//                     name="ulbId"
//                     component="div"
//                     className="text-danger small mt-1"
//                   />
//                 </div>
//               </div>

//               {/* Rate Config Inputs */}
//               <div className="row mb-4">
//                 <div className="col-md-4">
//                   <Label text={translate("Rate Type")}  />
//                   <Field as="select" name="rateType" className="form-control">
//                     {rateTypeOptions.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </Field>
//                   <ErrorMessage
//                     name="rateType"
//                     component="div"
//                     className="text-danger small mt-1"
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <Label text={translate("From")} />
//                   <Field name="from" component={InputField} />
//                   <ErrorMessage
//                     name="from"
//                     component="div"
//                     className="text-danger small mt-1"
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <Label text={translate("To")}  />
//                   <Field name="to" component={InputField} />
//                   <ErrorMessage
//                     name="to"
//                     component="div"
//                     className="text-danger small mt-1"
//                   />
//                 </div>
//               </div>

//               {/* Amount & Status */}
//               <div className="row mb-4 align-items-center">
//                 <div className="col-md-4">
//                   <Label text={translate("Amount")}  />
//                   <Field
//                     name="amount"
//                     component={InputField}
//                     type="number"
//                     placeholder="0.00"
//                   />
//                   <ErrorMessage
//                     name="amount"
//                     component="div"
//                     className="text-danger small mt-1"
//                   />
//                 </div>
//                 <div className="col-md-8 d-flex align-items-center">
//                   <Label text={translate("Status")}  />
//                   <div className="d-flex gap-3 ms-3">
//                     <Field
//                       name="in_status"
//                       component={RadioButton}
//                       value="Y"
//                       label={translate("Active")}
//                     />
//                     <Field
//                       name="in_status"
//                       component={RadioButton}
//                       value="N"
//                       label={translate("Inactive")}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className="d-flex justify-content-start gap-3 mt-4">
//                 <SaveButton
//                   type="submit"
//                   text={isEditMode ? translate("Update") : translate("Submit")}
//                   disabled={isSubmitting}
//                   className="btn btn-success"
//                 />
//                 <SaveButton
//                   type="button"
//                   text={translate("Cancel")}
//                   onClick={handleCancel}
//                   className="btn btn-secondary"
//                 />
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }

// export default FrmRateConfigMst;


import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css/animate.min.css";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import RadioButton from "../../../Components/RadioButton/RadioButton";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { useMasterData } from "../../../Context/MasterDataContext";

import { getRateConfigValidation } from "../../../HOC/Validation/Validation";

function FrmRateConfigMst() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedRate, setSelectedRate } = useMasterData();

  const isEditMode = Boolean(selectedRate);
  const [ulbOptions, setUlbOptions] = useState([]);
  const [loadingUlb, setLoadingUlb] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUlbList = async () => {
      try {
        const payload = { orgId: parseInt(user?.ulbId) };
        const response = await apiService.post("CorporationDropdown", payload);

        const list = response?.data?.data || [];
        const mapped = list.map((ulb) => ({
          value: ulb.CORPID,
          label: ulb.CORPNAME,
        }));
        setUlbOptions(mapped);

        if (isEditMode && selectedRate) {
          const normalizeRateType = (type) => {
            if (!type) return "";
            const t = type.toLowerCase();
            if (t.includes("waste") || t === "w") return "W";
            if (t.includes("distance") || t === "d") return "D";
            return "";
          };

          const normalizeStatus = (status) => {
            if (!status) return "Y";
            const s = status.toLowerCase();
            return s === "active" || s === "y" ? "Y" : "N";
          };

          setInitialValues({
            ulbId: selectedRate.ORGID || user?.ulbId,
            rateType: normalizeRateType(selectedRate.RATETYPE),
            from: selectedRate.SLABFROM || "",
            to: selectedRate.SLABTO || "",
            amount: selectedRate.RATEAMOUNT || "0.00",
            in_status: normalizeStatus(selectedRate.STATUS),
          });
        } else {
          setInitialValues({
            ulbId: user?.ulbId || "",
            rateType: "",
            from: "",
            to: "",
            amount: "0.00",
            in_status: "Y",
          });
        }
      } catch (err) {
        console.error("❌ Error fetching ULB List:", err);
      } finally {
        setLoadingUlb(false);
      }
    };

    if (user?.ulbId) fetchUlbList();
  }, [user?.ulbId, selectedRate]);

  // 🟢 USE CENTRALIZED VALIDATION
  const validationSchema = getRateConfigValidation(translate);

  // Submit Handler
  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      in_userid: user?.userId || "Admin",
      in_mode: isEditMode ? 2 : 1,
      in_rate_id: isEditMode ? selectedRate.RATEID : 0,
      in_typecode: values.rateType,
      in_slabfrom: Number(values.from),
      in_slabto: Number(values.to),
      in_rate: Number(values.amount),
      in_flag: values.in_status,
      in_orgid: values.ulbId,
    };

    Swal.fire({
      title: isEditMode ? "Updating Rate..." : "Saving Rate...",
      html: "Please wait...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await apiService.post("InsertRateConfig", payload);
      Swal.close();

      const data = response?.data;

      if (data?.success) {
        Swal.fire({
          title: isEditMode
            ? "Rate Updated Successfully!"
            : "Rate Added Successfully!",
          icon: "success",
          showClass: {
            popup: "animate__animated animate__fadeInDown animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp animate__faster",
          },
        });

        setSelectedRate(null);
        navigate("/Masters/FrmRateConfigList", { state: { refresh: true } });
      } else if (data?.errorCode === -150) {
        Swal.fire({
          title: "Slab Already Exists!",
          text: "Please enter a different range.",
          icon: "warning",
          showClass: {
            popup: "animate__animated animate__shakeX animate__faster",
          },
        });
      } else {
        Swal.fire({
          title: "Failed!",
          text: data?.errorMsg || "Unexpected error",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__shakeX animate__faster",
          },
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Failed to save rate configuration.",
        icon: "error",
        showClass: {
          popup: "animate__animated animate__shakeX animate__faster",
        },
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedRate(null);
    navigate("/Masters/FrmRateConfigList");
  };

  if (loadingUlb || !initialValues)
    return (
      <div className="text-center mt-5">
        <h6>⏳ Loading form...</h6>
      </div>
    );

  return (
    <div className="main-wrapper bg-white p-2 rounded-xl">
      <div className="container mt-4">
        <HeaderLabel
          text={
            isEditMode
              ? translate("Update Rate Configuration")
              : translate("Add Rate Configuration")
          }
        />
        <hr />

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* ULB */}
              <div className="mb-3">
                <Label text={translate("ULB Name")} />
                <Field as="select" name="ulbId" className="form-control" disabled>
                  <option value="">-- Select --</option>
                  {ulbOptions.map((ulb) => (
                    <option key={ulb.value} value={ulb.value}>
                      {ulb.label}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Rate Type */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <Label text={translate("Rate Type")} />
                  <Field as="select" name="rateType" className="form-control">
                    <option value="">-- Select --</option>
                    <option value="W">Waste Based</option>
                    <option value="D">Distance Based</option>
                  </Field>
                  <ErrorMessage name="rateType" className="text-danger small" component="div" />
                </div>

                <div className="col-md-4">
                  <Label text={translate("From")} />
                  <Field name="from" component={InputField} />
                  <ErrorMessage name="from" className="text-danger small" component="div" />
                </div>

                <div className="col-md-4">
                  <Label text={translate("To")} />
                  <Field name="to" component={InputField} />
                  <ErrorMessage name="to" className="text-danger small" component="div" />
                </div>
              </div>

              {/* Amount */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <Label text={translate("Amount")} />
                  <Field name="amount" component={InputField} />
                  <ErrorMessage name="amount" className="text-danger small" component="div" />
                </div>

                <div className="col-md-8">
                  <Label text={translate("Status")} />
                  <div className="d-flex gap-3">
                    <Field
                      name="in_status"
                      component={RadioButton}
                      value="Y"
                      label={translate("Active")}
                    />
                    <Field
                      name="in_status"
                      component={RadioButton}
                      value="N"
                      label={translate("Inactive")}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-3 mt-4">
                <SaveButton
                  type="submit"
                  text={isEditMode ? translate("Update") : translate("Submit")}
                  disabled={isSubmitting}
                  customClass="w-[90px]"
                />
                <SaveButton type="button" text={translate("Cancel")} onClick={handleCancel} customClass="w-[90px]"/>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmRateConfigMst;
