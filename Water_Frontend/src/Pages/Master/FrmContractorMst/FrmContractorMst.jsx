
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

import { getContractorValidation } from "../../../HOC/Validation/Validation";

function FrmContractorMst() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedContractor, clearAllSelected } = useMasterData();

  const isEditMode = Boolean(selectedContractor);

  const [ulbOptions, setUlbOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Fetch ULB and prepare initial form data
  useEffect(() => {
    const fetchCorporations = async () => {
      try {
        const payload = { orgId: user?.ulbId || 890 };
        const response = await apiService.post("CorporationDropdown", payload);

        const formatted = (response?.data?.data || []).map((corp) => ({
          value: corp.CORPID,
          label: corp.CORPNAME,
        }));

        setUlbOptions(formatted);

        const preselected = formatted.find(
          (c) => c.value === (user?.ulbId || 890)
        );

        if (isEditMode) {
          // EDIT MODE VALUES
          setInitialValues({
            ulbId: selectedContractor.ORGID || preselected?.value || "",
            contractorName: selectedContractor.CONTRACTORNAME || "",
            mobileNumber:
              selectedContractor.CONTRACTORMOBNO?.toString() || "",
            address: selectedContractor.CONTRACTORADDRESS || "",
            in_status:
              selectedContractor.STATUS === "Y" ||
              selectedContractor.FLAG === "Active"
                ? "Y"
                : "N",
          });
        } else {
          // ADD MODE VALUES
          setInitialValues({
            ulbId: preselected?.value || "",
            contractorName: "",
            mobileNumber: "",
            address: "",
            in_status: "Y",
          });
        }
      } catch (err) {
        Swal.fire("Error", "Failed to load ULB list", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCorporations();
  }, [isEditMode, selectedContractor]);

  // Validation Schema
  const validationSchema = getContractorValidation(translate);

  // 🚀 Submit Handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    Swal.fire({
      title: isEditMode ? "Updating..." : "Saving...",
      html: "Please wait",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const payload = {
      in_userid: user?.userId || "Admin",
      in_mode: isEditMode ? 2 : 1,
      in_contractor_id: isEditMode ? selectedContractor.CONTRACTORID : 0,
      in_contractor_name: values.contractorName.trim(),
      in_contractor_mobno: Number(values.mobileNumber),
      in_contractor_address: values.address.trim(),
      in_contractor_flag: values.in_status,
      in_orgid: values.ulbId,
    };

    try {
      const res = await apiService.post("InsertContractor", payload);

      Swal.close();

      if (res?.data?.success) {
        Swal.fire({
          title: isEditMode
            ? translate("Updated Successfully!")
            : translate("Inserted Successfully!"),
          icon: "success",
          showClass: {
            popup: `animate__animated animate__fadeInDown animate__faster`,
          },
          hideClass: {
            popup: `animate__animated animate__fadeOutUp animate__faster`,
          },
        });

        clearAllSelected();
        navigate("/Masters/FrmContractorList");
      } else {
        Swal.fire(
          "Failed!",
          res?.data?.errorMsg || "Operation failed! Please try again.",
          "error"
        );
      }
    } catch {
      Swal.close();
      Swal.fire(
        "Error",
        translate("Something went wrong. Please try again later."),
        "error"
      );
    } finally {
      setSubmitting(false);
      if (!isEditMode) resetForm();
    }
  };

  // Loading UI
  if (loading || !initialValues) {
    return (
      <div className="text-center mt-5">
        <h6>⏳ Loading form, please wait...</h6>
      </div>
    );
  }

  return (
    <div className="main-wrapper bg-white p-2 rounded-xl">
      <div className="container mt-4">
        <HeaderLabel
          text={
            isEditMode
              ? translate("Edit Contractor")
              : translate("Add New Contractor")
          }
        />
        <hr />

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* ULB NAME */}
              <div className="mb-4">
                <Label text={translate("ULB Name")} />
                <Field
                  as="select"
                  name="ulbId"
                  className="form-control"
                  style={{ pointerEvents: "none", background: "#eee" }}
                >
                  {ulbOptions.map((x) => (
                    <option key={x.value} value={x.value}>
                      {x.label}
                    </option>
                  ))}
                </Field>
              </div>

              {/* NAME + MOBILE */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <Label text={translate("Contractor Name")} />
                  <Field name="contractorName" component={InputField} />
                  <ErrorMessage
                    name="contractorName"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                <div className="col-md-6">
                  <Label text={translate("Mobile Number")} />
                  <Field
                    name="mobileNumber"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        maxLength={10}
                        className="form-control"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 10);
                        }}
                      />
                    )}
                  />
                  <ErrorMessage
                    name="mobileNumber"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div className="mb-4">
                <Label text={translate("Address")} />
                <Field as="textarea" name="address" className="form-control" />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

              {/* STATUS */}
              <div className="mb-4">
                <Label text={translate("Status")} />
                <div className="d-flex gap-4 mt-2">
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

              {/* BUTTONS */}
              <div className="d-flex justify-content-center gap-4 mt-4">
                <SaveButton
                  type="submit"
                  text={isEditMode ? translate("Update") : translate("Save")}
                  disabled={isSubmitting}
                  customClass="w-[90px]"
                />

                <SaveButton
                  type="button"
                  text={translate("Back")}
                  onClick={() => {
                    clearAllSelected();
                    navigate("/Masters/FrmContractorList");
                  }}
                  customClass="w-[90px]"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmContractorMst;
