import React, { useEffect, useState } from "react";
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

function TankTypeMst() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const editData = location.state?.tankTypeData || null;
  const isEditMode = Boolean(editData?.TYPEID);

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tank type details by ID (for edit mode)
  const fetchTankTypeById = async (tanktypeid) => {
    try {
      const payload = {
        tanktypeid,
        orgId: parseInt(user?.ulbId || 890),
      };

      const response = await apiService.post("GetTankTypeById", payload);

      if (response?.data?.success && response?.data?.data) {
        const d = response.data.data;
        setInitialValues({
          tankTypeName: d.TYPENAME || "",
          in_status: d.STATUS === "Y" ? "Y" : "N",
        });
      } else {
        setInitialValues({ tankTypeName: "", in_status: "Y" });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch tank type details", "error");
      setInitialValues({ tankTypeName: "", in_status: "Y" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && editData?.TYPEID) {
      if (editData?.TYPENAME) {
        setInitialValues({
          tankTypeName: editData.TYPENAME,
          in_status: editData.STATUS === "Y" ? "Y" : "N",
        });
        setLoading(false);
      } else {
        fetchTankTypeById(editData.TYPEID);
      }
    } else {
      setInitialValues({ tankTypeName: "", in_status: "Y" });
      setLoading(false);
    }
  }, []);

  const validationSchema = Yup.object({
    tankTypeName: Yup.string()
      .required(translate("Please Enter Tank Type Name"))
      .min(2, translate("Too short")),
    in_status: Yup.string().required(translate("Please select a status")),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Show loading modal
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
      userid: user?.username || "Admin",
      tanktypeid: isEditMode ? editData.TYPEID : null,
      tanktypename: values.tankTypeName,
      tanktypeflag: values.in_status,
      orgid: parseInt(user?.ulbId || 890),
      mode: isEditMode ? 2 : 1,
    };

    try {
      const response = await apiService.post("InsertTankType", payload);

      Swal.close(); // close loading modal

      if (response?.data?.success) {
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

        navigate("/Masters/TankTypeList", { state: { refresh: true } });
      } else {
        Swal.fire(
          "Failed!",
          translate("Operation failed! Please try again."),
          "error"
        );
      }
    } catch (error) {
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
          text={isEditMode ? translate("Edit Tank Type") : translate("Add New Tank Type")}
        />
        <hr />

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              <div className="row mb-4">
                <div className="col-md-6">
                  <Label text={translate("Tank Type Name")} />
                  <Field
                    name="tankTypeName"
                    component={InputField}
                    placeholder={translate("Enter Tank Type Name")}
                  />
                  <ErrorMessage
                    name="tankTypeName"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

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

              <div className="d-flex justify-content-center gap-4 mt-5 mb-2">
                <SaveButton
                  type="submit"
                  text={isEditMode ? translate("Update") : translate("Save")}
                  disabled={isSubmitting}
                  customClass="w-[90px]"
                />
                <SaveButton
                  type="button"
                  text={translate("Back")}
                  onClick={() => navigate("/Masters/TankTypeList")}
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

export default TankTypeMst;
