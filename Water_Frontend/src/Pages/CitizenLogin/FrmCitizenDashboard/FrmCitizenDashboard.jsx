// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field } from "formik";
// import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./FrmCitizenDashboard.css";
// import InputField from "../../../Components/InputField/InputField";
// import apiService from "../../../../apiService";

// const FrmCitizenDashboard = () => {
//   const navigate = useNavigate();
//   const [ulbOptions, setUlbOptions] = useState([]);
//   const [defaultUlbValue, setDefaultUlbValue] = useState("");
//   const [isLocked, setIsLocked] = useState(false);

//   const dashboardOptions = [
//     { title: "New Application", path: "/CitizenTankRegistraction" },
//     { title: "Track Application", path: "/CitizenTrackApplication?@=1" },
//     { title: "Track Application By Mobile No", path: "/CitizenTrackApplication?@=2" },
//     { title: "Print Application", path: "/CitizenPrintApplication" },
//   ];

//   // ✅ Fetch ULB list from API on mount
//   useEffect(() => {
//     const fetchULBData = async () => {
//       try {
//         const response = await apiService.get("CorporationDropdown");
//         const ulbData = response?.data?.data || [];

//         const formatted = ulbData.map((item) => ({
//           value: item.CORPID,
//           label: item.CORPNAME,
//         }));

//         setUlbOptions(formatted);

//         // ✅ Automatically select and lock CORPID = 890
//         const defaultUlb = formatted.find((f) => f.value === 890);
//         if (defaultUlb) {
//           setDefaultUlbValue(defaultUlb.value);
//           setIsLocked(true);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching ULB data:", error);
//       }
//     };

//     fetchULBData();
//   }, []);

//   return (
//     <div className="min-vh-100 bg-light">
//       <NavbarCitizen />

//       <div className="container-fluid py-4">
//         <div className="card shadow-lg border-0 mx-auto dashboard-main-card">
//           <div className="card-body">
//             <Formik
//               enableReinitialize
//               initialValues={{ ulbName: defaultUlbValue }}
//               onSubmit={(values) => console.log("Selected ULB:", values)}
//             >
//               {({ values, setFieldValue }) => (
//                 <Form>
//                   {/* 🔽 ULB Name Dropdown */}
//                   <div className="mb-4">
//                     <Field
//                       name="ulbName"
//                       component={InputField}
//                       type="dropdown"
//                       label="ULB Name"
//                       options={ulbOptions}
//                       placeholder="Select ULB Name"
//                       styleClass="w-50"
//                       value={values.ulbName}
//                       disabled={isLocked} // 🔒 Disable when locked
//                       onChange={(e) => {
//                         const selectedId = Number(e.target.value);
//                         setFieldValue("ulbName", selectedId);

//                         // Lock only if CORPID === 890
//                         setIsLocked(selectedId === 890);
//                       }}
//                     />
//                   </div>

//                   {/* Dashboard Boxes */}
//                   <div className="row g-4">
//                     {dashboardOptions.map((item, index) => (
//                       <div key={index} className="col-12 col-sm-6 col-lg-3">
//                         <div className="card text-center border-dark shadow-sm dashboard-option-card">
//                           <div className="card-body d-flex flex-column justify-content-between">
//                             <h6 className="fw-bold mb-3">{item.title}</h6>
//                             <button
//                               className="btn btn-primary w-50 mx-auto"
//                               type="button"
//                               onClick={() => navigate(item.path)}
//                             >
//                               View
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
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

// export default FrmCitizenDashboard;



import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import NavbarCitizen from "../../../HOC/NavbarCitizen/NavbarCitizen";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FrmCitizenDashboard.css";
import InputField from "../../../Components/InputField/InputField";
import apiService from "../../../../apiService";
import Label from "../../../Components/Label/Label";

const FrmCitizenDashboard = () => {
  const navigate = useNavigate();
  const [ulbOptions, setUlbOptions] = useState([]);
  const [defaultUlbValue, setDefaultUlbValue] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const dashboardOptions = [
    { title: "New Application", path: "/CitizenTankRegistraction" },
    { title: "Track Application", path: "/CitizenTrackApplication?@=1" },
    { title: "Track Application By Mobile No", path: "/CitizenTrackApplication?@=2" },
    { title: "Print Application", path: "/CitizenPrintApplication" },
  ];

  // ✅ Fetch ULB list from API on mount
  useEffect(() => {
    const fetchULBData = async () => {
      try {
        const response = await apiService.get("CorporationDropdown");
        const ulbData = response?.data?.data || [];

        const formatted = ulbData.map((item) => ({
          value: item.CORPID,
          label: item.CORPNAME,
        }));

        setUlbOptions(formatted);

        // ✅ Automatically select and lock CORPID = 890
        const defaultUlb = formatted.find((f) => f.value === 890);
        if (defaultUlb) {
          setDefaultUlbValue(defaultUlb.value);
          setIsLocked(true);
        }
      } catch (error) {
        console.error("❌ Error fetching ULB data:", error);
      }
    };

    fetchULBData();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <NavbarCitizen />

      <div className="container-fluid py-4">
        <div className="card shadow-lg border-0 mx-auto dashboard-main-card">
          <div className="card-body">
            <Formik
              enableReinitialize
              initialValues={{ ulbName: defaultUlbValue }}
              onSubmit={(values) => console.log("Selected ULB:", values)}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  {/* 🔽 ULB Name Dropdown */}
                  <div className="mb-4 d-flex justify-content-center">
                    <Label text="ULB Name" className="mt-2 mx-4" required />
                    <Field
                      name="ulbName"
                      component={InputField}
                      type="dropdown"
                      options={ulbOptions}
                      placeholder="Select ULB Name"
                      styleClass="w-50"
                      value={values.ulbName}
                      disabled={isLocked} // 🔒 Disable when locked
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        setFieldValue("ulbName", selectedId);

                        // Lock only if CORPID === 890
                        setIsLocked(selectedId === 890);
                      
                      }}
                    />
                  </div>

                  {/* Dashboard Boxes */}
                  <div className="row g-4">
                    {dashboardOptions.map((item, index) => (
                      <div key={index} className="col-12 col-sm-6 col-lg-3">
                        <div className="card text-center border-dark shadow-sm dashboard-option-card">
                          <div className="card-body d-flex flex-column justify-content-between">
                            <h6 className="fw-bold mb-3">{item.title}</h6>
                            <button
                              className="btn btn-primary w-50 mx-auto"
                              type="button"
                              onClick={() => navigate(item.path)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default FrmCitizenDashboard;
