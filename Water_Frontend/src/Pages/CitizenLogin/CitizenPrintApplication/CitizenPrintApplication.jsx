// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useNavigate } from "react-router-dom";

// import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
// import InputField from "../../../Components/InputField/InputField";
// import SaveButton from "../../../Components/Buttons_save/Savebutton";
// import Label from "../../../Components/Label/Label";

// import "bootstrap/dist/css/bootstrap.min.css";

// const CitizenPrintApplication = () => {
//   const navigate = useNavigate();

//   // ✅ Initial Values
//   const initialValues = {
//     applicationNo: "",
//   };

//   // ✅ Submit Handler
//   const handleSubmit = (values, { setSubmitting, resetForm }) => {
//     console.log("Form Submitted:", values);
//     alert(`Searching for Application No: ${values.applicationNo}`);
//     setSubmitting(false);
//   };

//   return (
//     <div className="min-vh-100 bg-light">
//       <NavbarCitizen />

//       <div className="container-fluid py-4">
//         {/* Outer Card */}
//         <div className="card shadow-lg border-0 mx-auto w-100" style={{ maxWidth: "1200px" }}>
//           {/* Header */}
//           <div className="card-header bg-primary text-white fw-bold fs-5 rounded-top">
//             Track Application
//           </div>

//           {/* Body */}
//           <div className="card-body p-4 bg-white rounded-bottom">
//             <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//               {({ isSubmitting, resetForm }) => (
//                 <Form>
//                   <div className="row justify-content-center align-items-center mb-4">
//                     {/* Label */}
//                     <div className="col-md-2 text-md-end text-center mb-2 mb-md-0">
//                       <Label text="Application No" required />
//                     </div>

//                     {/* Input */}
//                     <div className="col-md-3">
//                       <Field
//                         name="applicationNo"
//                         component={InputField}
//                         placeholder="Enter Application No"
//                       />
//                       <ErrorMessage
//                         name="applicationNo"
//                         component="div"
//                         className="text-danger small mt-1"
//                       />
//                     </div>

//                     {/* Buttons */}
//                     <div className="col-md-4 d-flex justify-content-start gap-2 mt-3 mt-md-0">
//                       <button
//                         type="submit"
//                         className="btn btn-primary fw-semibold px-4"
//                         disabled={isSubmitting}
//                       >
//                         Search
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-info text-white fw-semibold px-4"
//                         onClick={() => resetForm()}
//                       >
//                         Reset
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-secondary fw-semibold px-4"
//                         onClick={() => navigate("/Citizen/Dashboard")}
//                       >
//                         Back
//                       </button>
//                     </div>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CitizenPrintApplication;


import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";

import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
import InputField from "../../../Components/InputField/InputField";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const CitizenPrintApplication = () => {
  const navigate = useNavigate();

  // ✅ Initial Values
  const initialValues = {
    applicationNo: "",
  };

  // ✅ Submit Handler
 const handleSubmit = (values, { setSubmitting }) => {
  if (!values.applicationNo.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Required",
      text: "Please enter Application Number",
    });
    setSubmitting(false);
    return;
  }


  setSubmitting(false);
};


  return (
    <div className="min-vh-100 bg-light">
      <NavbarCitizen />

      <div className="container-fluid py-4">
        {/* Outer Card */}
        <div className="card shadow-lg border-0 mx-auto w-100" style={{ maxWidth: "1200px" }}>
          {/* Header */}
          <div className="card-header bg-primary text-white fw-bold fs-5 rounded-top">
            Track Application
          </div>

          {/* Body */}
          <div className="card-body p-4 bg-white rounded-bottom">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ isSubmitting, resetForm }) => (
                <Form>
                  <div className="row justify-content-center align-items-center mb-4">
                    {/* Label */}
                    <div className="col-md-2 text-md-end text-center mb-2 mb-md-0">
                      <Label text="Application No" required />
                    </div>

                    {/* Input */}
                    <div className="col-md-3">
                      <Field
                        name="applicationNo"
                        component={InputField}
                        placeholder="Enter Application No"
                      />
                      <ErrorMessage
                        name="applicationNo"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="col-md-4 d-flex justify-content-start gap-2 mt-3 mt-md-0">
                      <button
                        type="submit"
                        className="btn btn-primary fw-semibold px-4"
                        disabled={isSubmitting}
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        className="btn btn-info text-white fw-semibold px-4"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPrintApplication;
