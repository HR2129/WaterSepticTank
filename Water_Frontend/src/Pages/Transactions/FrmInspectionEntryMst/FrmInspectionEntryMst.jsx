import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";


import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";
import { useLanguage } from "../../../Context/LanguageProvider";


function FrmInspectionEntryMst() {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  // --- Initial Values: All fields are initialized to empty strings ---
  const initialValues = {
    // Tank Details
    ownerName: "", propertyID: "", zone: "", ownershipType: "",
    longitude: "", mobileNumber: "", address: "", registrationDate: "",
    tankCapacity: "", status: "", email: "", prabhag: "",
    tankType: "", latitude: "",

    // Tank Cleaning Request Details
    requestDate: "", serviceType: "", remarksRequest: "", requestedBy: "",

    // Inspection Entry Fields
    assignedTo: "", inspectionDate: "", tankCondition: "", 
    accessDifficulty: "", wasteLevel: "", remarksEntry: "", 
    inspectionStatus: "Accepted",
  };

  // --- Mock Options (Used for editable dropdowns) ---
  const MOCK_OPTIONS_ASSIGNED_STAFF = [
    { value: "", label: translate("-- Select Option --") },
    { value: "PGR", label: translate("Prashanth Ganesh Rangu") },
    { value: "S002", label: translate("Staff Two") },
  ];

  const MOCK_OPTIONS_TANK_CONDITIONS = [
    { value: "", label: translate("-- Select Option --") },
    { value: "Good", label: translate("Good") },
    { value: "Damaged", label: translate("Damaged") },
  ];

  const MOCK_OPTIONS_ACCESS_DIFFICULTY = [
    { value: "", label: translate("-- Select Option --") },
    { value: "Easy", label: translate("Easy") },
    { value: "Medium", label: translate("Medium") },
    { value: "Hard", label: translate("Hard") },
  ];
  // ---------------------------------------------------------------------

  // --- Validation schema ---
  const validationSchema = Yup.object({
    assignedTo: Yup.string().required(translate("Staff/Contractor is required")),
    inspectionDate: Yup.string().required(translate("Inspection Date is required")),
    tankCondition: Yup.string().required(translate("Tank Condition is required")),
    accessDifficulty: Yup.string().required(translate("Access Difficulty is required")),
    wasteLevel: Yup.number()
        .typeError(translate("Waste Level must be a number"))
        .min(0, translate("Cannot be negative"))
        .max(100, translate("Cannot exceed 100%"))
        .required(translate("Waste Level is required")),
    remarksEntry: Yup.string().max(200, translate("Remarks is too long")),
    inspectionStatus: Yup.string().required(translate("Status is required")),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Inspection Entry Submitted:", values);
    setTimeout(() => {
      alert(translate("Inspection Entry Saved Successfully!"));
      setSubmitting(false);
    }, 800);
  };

  // Helper component for styled dropdown
  const DropdownField = ({ field, form, options, disabled }) => (
    <>
        <select
            {...field}
            disabled={disabled}
            className={`form-control ${form.errors[field.name] && form.touched[field.name] ? 'is-invalid' : ''}`}
            style={{ height: "40px" }}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </>
  );

  // --- NEW Helper for Three-Column Read-Only Rows ---
  /**
   * Renders three read-only field groups in a single row (12 / 3 = 4 columns each).
   * Each field group uses 2 columns (Label + Input) within its col-md-4 container.
   */
  const renderThreeColReadOnlyRow = (field1, label1, field2, label2, field3, label3) => (
    <div className="row mb-3">
        {/* Field Group 1 */}
        <div className="col-md-4 d-flex">
            <div className="col-md-6">
                <Label text={`${translate(label1)} :`} />
            </div>
            <div className="col-md-6">
                <Field name={field1} component={InputField} disabled className="form-control form-control-static" />
            </div>
        </div>

        {/* Field Group 2 */}
        <div className="col-md-4 d-flex">
            <div className="col-md-6">
                <Label text={`${translate(label2)} :`} />
            </div>
            <div className="col-md-6">
                <Field name={field2} component={InputField} disabled className="form-control form-control-static" />
            </div>
        </div>

        {/* Field Group 3 */}
        <div className="col-md-4 d-flex">
            <div className="col-md-6">
                <Label text={`${translate(label3)} :`} />
            </div>
            <div className="col-md-6">
                <Field name={field3} component={InputField} disabled className="form-control form-control-static" />
            </div>
        </div>
    </div>
  );

  return (
    <div className="main-wrapper">


      <div className="container mt-4">
        <HeaderLabel text={translate("Inspection Entry")} />
        <hr className="mb-4" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* --- Section 1: Tank Details (Read-Only - 3 Columns) --- */}
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="card-title">{translate("Tank Details")}</h5>
                <hr />
                
                {renderThreeColReadOnlyRow("ownerName", "Owner Name", "mobileNumber", "Mobile No.", "email", "Email")}
                {renderThreeColReadOnlyRow("propertyID", "Property ID", "zone", "Zone", "prabhag", "Prabhag")}
                {renderThreeColReadOnlyRow("ownershipType", "Ownership Type", "tankType", "Tank Type", "registrationDate", "Registration Date")}
                {renderThreeColReadOnlyRow("tankCapacity", "Tank Capacity (litres)", "status", "Status", "address", "Address")}
                {/* Longitude and Latitude are grouped in the remaining columns */}
                <div className="row mb-3">
                    <div className="col-md-4 d-flex">
                        <div className="col-md-6">
                            <Label text={`${translate("Longitude")} :`} />
                        </div>
                        <div className="col-md-6">
                            <Field name="longitude" component={InputField} disabled className="form-control form-control-static" />
                        </div>
                    </div>
                    <div className="col-md-4 d-flex">
                        <div className="col-md-6">
                            <Label text={`${translate("Latitude")} :`} />
                        </div>
                        <div className="col-md-6">
                            <Field name="latitude" component={InputField} disabled className="form-control form-control-static" />
                        </div>
                    </div>
                </div>
              </div>

              {/* --- Section 2: Tank Cleaning Request Details (Read-Only - 3 Columns) --- */}
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="card-title">{translate("Tank Cleaning Request Details")}</h5>
                <hr />
                {renderThreeColReadOnlyRow("requestDate", "Request Date", "serviceType", "Service Type", "requestedBy", "Requested By")}
                {/* Remarks field takes up one column */}
                <div className="row mb-3">
                    <div className="col-md-4 d-flex">
                        <div className="col-md-6">
                            <Label text={`${translate("Remarks")} :`} />
                        </div>
                        <div className="col-md-6">
                            <Field name="remarksRequest" component={InputField} disabled className="form-control form-control-static" />
                        </div>
                    </div>
                </div>
              </div>

              {/* --- Section 3: Inspection Entry Fields (Editable - 3 Columns) --- */}
              <div className="card shadow-sm p-4">
                <div className="row mb-3">
                    
                    {/* Assigned To (Dropdown) - Col 1 */}
                    <div className="col-md-4">
                        <Label text={`${translate("Assigned To")}:`} required />
                        <Field 
                            name="assignedTo" 
                            component={DropdownField} 
                            options={MOCK_OPTIONS_ASSIGNED_STAFF} 
                            // Note: Removing the 'disabled' prop here to make it a selectable field, 
                            // as per standard Formik Field usage.
                        />
                         <ErrorMessage name="assignedTo" component="div" className="text-danger small mt-1" />
                    </div>
                    
                    {/* Inspection Date (Input Date) - Col 2 */}
                    <div className="col-md-4">
                        <Label text={`${translate("Inspection Date")}:`} required />
                        <Field 
                            name="inspectionDate" 
                            type="date"
                            component={InputField} 
                        />
                        <ErrorMessage name="inspectionDate" component="div" className="text-danger small mt-1" />
                    </div>

                    {/* Tank Condition (Dropdown) - Col 3 */}
                    <div className="col-md-4">
                        <Label text={`${translate("Tank Condition")}:`} required />
                        <Field 
                            name="tankCondition" 
                            component={DropdownField} 
                            options={MOCK_OPTIONS_TANK_CONDITIONS}
                        />
                        <ErrorMessage name="tankCondition" component="div" className="text-danger small mt-1" />
                    </div>
                </div>

                <div className="row mb-4">
                    {/* Access Difficulty (Dropdown) - Col 1 */}
                    <div className="col-md-4">
                        <Label text={`${translate("Access Difficulty")}:`} required />
                        <Field 
                            name="accessDifficulty" 
                            component={DropdownField} 
                            options={MOCK_OPTIONS_ACCESS_DIFFICULTY}
                        />
                        <ErrorMessage name="accessDifficulty" component="div" className="text-danger small mt-1" />
                    </div>

                    {/* Waste Level (%) (Input) - Col 2 */}
                    <div className="col-md-4">
                        <Label text={`${translate("Waste Level (%)")}:`} required />
                        <Field 
                            name="wasteLevel" 
                            type="number"
                            component={InputField} 
                            placeholder={translate("e.g., 50")}
                        />
                        <ErrorMessage name="wasteLevel" component="div" className="text-danger small mt-1" />
                    </div>

                    {/* Remarks (Input/Textarea) - Col 3 */}
                    <div className="col-md-4">
                        <Label text={`${translate("Remarks")}:`} />
                        <Field 
                            name="remarksEntry" 
                            component={InputField} 
                            as="textarea"
                            rows="1"
                            placeholder={translate("Enter remarks or observation")}
                        />
                        <ErrorMessage name="remarksEntry" component="div" className="text-danger small mt-1" />
                    </div>
                </div>

                {/* Status Radio Buttons (Full Row) */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <Label text={`${translate("Status")}:`} />
                        <div className="d-flex gap-4 mt-1">
                            <label className="form-check-label">
                                <Field type="radio" name="inspectionStatus" value="Accepted" className="form-check-input me-2" />
                                {translate("Accepted")}
                            </label>
                            <label className="form-check-label">
                                <Field type="radio" name="inspectionStatus" value="Rejected" className="form-check-input me-2" />
                                {translate("Rejected")}
                            </label>
                        </div>
                        <ErrorMessage name="inspectionStatus" component="div" className="text-danger small mt-1" />
                    </div>
                </div>
              </div>


              {/* --- Action Buttons --- */}
              <div className="d-flex justify-content-center gap-3 mt-4">
                <SaveButton
                  type="submit"
                  text={translate("Submit")}
                  disabled={isSubmitting}
                  className="btn btn-success"
                />
                <SaveButton
                  type="button"
                  text={translate("Back")}
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmInspectionEntryMst;