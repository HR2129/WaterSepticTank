import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import "animate.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import Label from "../../../Components/Label/Label";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";

import { getCleaningExecutionValidation } from "../../../HOC/Validation/Validation";
import { useLanguage } from "../../../Context/LanguageProvider";
import CalendarIcon from "../../../Components/Calendar/CalendarIcon"; // ← added

function FrmCleaningExecution() {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLanguage();
  const { user } = useAuth();

  const requestId = location?.state?.requestId;
  const orgId = Number(user?.ulbId) || 890;

  const [wasteTypeList, setWasteTypeList] = useState([]);
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);

  const initialValues = {
    clngDate: "",
    startTime: "",
    endTime: "",
    wasteCollected: "",
    wasteTypeId: "",
    clngRemark: "",
    clngStatus: "C",
  };

  const validationSchema = getCleaningExecutionValidation(translate);

  const fetchWasteTypes = async () => {
    try {
      const res = await apiService.post("WasteTypeDropdown", { orgId });
      setWasteTypeList(res.data.data || []);
    } catch {
      Swal.fire("Error", "Unable to load waste types", "error");
    }
  };

  useEffect(() => {
    fetchWasteTypes();
  }, []);

  const uploadImage = async (file, cleaningId, mode) => {
    try {
      const formData = new FormData();
      formData.append("imageFile", file);
      formData.append("requestId", cleaningId);
      formData.append("mode", mode);

      await axios.post("http://localhost:5000/updateSepticTankImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return true;
    } catch {
      Swal.fire("Error", "Image upload failed", "error");
      return false;
    }
  };

  const handleSubmit = async (values) => {
    debugger;
    Swal.fire({ title: "Submitting...", allowOutsideClick: false });

    const payload = {
      userId: user?.userId,
      requestId,
      ...values,
      orgId,
    };

    try {
      const res = await apiService.post("tnkCleaningInsert", payload);
      console.log(res);
      const msg = res?.data?.message || "";
      const cleaningId = msg.split(":")[1]?.trim();

      if (beforePhoto) await uploadImage(beforePhoto, cleaningId, "1");
      if (afterPhoto) await uploadImage(afterPhoto, cleaningId, "2");

      Swal.fire("Success", "Cleaning execution saved", "success").then(() =>
        navigate(-1)
      );
    } catch {
      Swal.fire("Error", "Unable to save execution", "error");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text="Cleaning Execution Master" />
        <hr />

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form>
              <div className="card p-4 mb-4 shadow-sm">

                {/* Row 1 */}
                <div className="row">

                  {/* Cleaning Date with CalendarIcon */}
                  <div className="col-md-4 mb-3">
                    <Label text="Cleaning Date*" />

                    <CalendarIcon
                      selectedDate={
                        values.clngDate ? new Date(values.clngDate) : null
                      }
                      setSelectedDate={(date) =>
                        setFieldValue(
                          "clngDate",
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      placeholder="DD/MM/YYYY"
                    />

                    <ErrorMessage
                      name="clngDate"
                      className="text-danger small"
                      component="div"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Label text="Start Time" required/>
                    <Field type="time" name="startTime" className="form-control" />
                    <ErrorMessage name="startTime" className="text-danger small" component="div" />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Label text="End Time" required/>
                    <Field type="time" name="endTime" className="form-control" />
                    <ErrorMessage name="endTime" className="text-danger small" component="div" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Label text="Waste Collected (Litres)" required/>
                    <Field name="wasteCollected" component={InputField} className="form-control" type="number" />
                    <ErrorMessage name="wasteCollected" className="text-danger small" component="div" />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Label text="Waste Type" required/>
                    <Field as="select" name="wasteTypeId" className="form-control">
                      <option value="">-- Select Option --</option>
                      {wasteTypeList.map((x) => (
                        <option key={x.WASTETYPEID || x.WastetypeId} value={x.WASTETYPEID || x.WastetypeId}>
                          {x.WASTETYPENAME || x.WasteTypeName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="wasteTypeId" className="text-danger small" component="div" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label text="Before Photo" required/>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setBeforePhoto(e.target.files[0])}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label text="After Photo" required />
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setAfterPhoto(e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label text="Remarks" required/>
                    <Field as="textarea" name="clngRemark" className="form-control" rows={2} />
                    <ErrorMessage name="clngRemark" className="text-danger small" component="div" />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label text="Status" required/>
                    <div className="d-flex align-items-center gap-4 mt-2">
                      <label><Field type="radio" name="clngStatus" value="C" /> Completed</label>
                      <label><Field type="radio" name="clngStatus" value="PC" /> Partially Completed</label>
                    </div>
                    <ErrorMessage name="clngStatus" className="text-danger small" component="div" />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <SaveButton type="submit" text="Submit" className="btn btn-success" />
                <SaveButton
                  type="button"
                  text="Back"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmCleaningExecution;
