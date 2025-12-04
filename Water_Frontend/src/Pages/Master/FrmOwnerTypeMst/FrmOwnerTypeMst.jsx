import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
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

function FrmOwnerTypeMst() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ownerTypeData = location.state?.ownerTypeData || null;
  const isEditMode = Boolean(ownerTypeData?.OWNERSHIPTYPEID);

  const initialValues = {
    ownerTypeName: ownerTypeData?.OWNERTYPENAME || "",
    in_status: ownerTypeData?.STATUS || "Y",
  };

  const validationSchema = Yup.object({
    ownerTypeName: Yup.string()
      .required(translate("Please Enter Ownership Type Name"))
      .min(2, translate("Too short")),
    in_status: Yup.string().required(translate("Please select a status")),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("🟢 Form Submitted:", values);

    const payload = {
      in_userid: user?.userId || "Admin",
      in_mode: isEditMode ? 2 : 1,
      in_ownertypeid: ownerTypeData?.OWNERSHIPTYPEID || null,
      in_ownertypename: values.ownerTypeName,
      in_ownertypeflag: values.in_status,
    };

    console.log("📦 Sending payload:", payload);

    // 🔵 Show loader modal
    Swal.fire({
      title: isEditMode ? "Updating..." : "Saving...",
      html: "Please wait...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await apiService.post("InsertOwnershipType", payload);
      console.log("📩 API Response:", response);

      Swal.close(); // Close loader modal

      const data = response?.data;
      if (data?.success) {
        Swal.fire({
          title: isEditMode
            ? "Ownership Type Updated Successfully!"
            : "Ownership Type Added Successfully!",
          icon: "success",
          showClass: {
            popup: `animate__animated animate__fadeInDown animate__faster`,
          },
          hideClass: {
            popup: `animate__animated animate__fadeOutUp animate__faster`,
          },
        });

        resetForm();
        navigate("/Masters/FrmOwnerTypeList");
      } else {
        Swal.fire({
          title: "Failed!",
          text: data?.errorMsg || "Operation failed",
          icon: "error",
          showClass: {
            popup: `animate__animated animate__shakeX animate__faster`,
          },
          hideClass: {
            popup: `animate__animated animate__fadeOutUp animate__faster`,
          },
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Failed to save. Check console for details.",
        icon: "error",
        showClass: {
          popup: `animate__animated animate__shakeX animate__faster`,
        },
      });
      console.error("🚨 API Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      console.log("🧩 Editing Ownership Type:", ownerTypeData);
    }
  }, [ownerTypeData]);

  return (
    <div className="main-wrapper bg-white p-2 rounded-xl">
      <div className="container mt-4">
        <HeaderLabel
          text={
            isEditMode
              ? translate("Update Ownership Type")
              : translate("Add New Ownership Type")
          }
        />
        <hr />

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              {/* Ownership Type Name */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <Label text={translate("Ownership Type Name")} />
                  <Field
                    name="ownerTypeName"
                    component={InputField}
                    placeholder={translate("Enter Ownership Type Name")}
                  />
                  <ErrorMessage
                    name="ownerTypeName"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <Label text={translate("Status")} />
                  <div className="d-flex gap-4 mt-1">
                    <Field
                      name="in_status"
                      component={RadioButton}
                      value="Y"
                      label={translate("Active")}
                      id="status-active"
                    />
                    <Field
                      name="in_status"
                      component={RadioButton}
                      value="N"
                      label={translate("Inactive")}
                      id="status-inactive"
                    />
                  </div>
                  <ErrorMessage
                    name="in_status"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-center gap-4 mt-5">
                <SaveButton
                  type="submit"
                  text={isEditMode ? translate("Update") : translate("Save")}
                  disabled={isSubmitting}
                  customClass="w-[90px]"
                />
                <SaveButton
                  type="button"
                  text={translate("Back")}
                  onClick={() => navigate("/Masters/FrmOwnerTypeList")}
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

export default FrmOwnerTypeMst;
