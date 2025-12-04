import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import Label from "../../../Components/Label/Label";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useLanguage } from "../../../Context/LanguageProvider";
import Table from "../../../Components/Table/Table";

const MOCK_TANK_TYPES = [
  { id: "T001", name: "Yes", checked: false },
  { id: "T002", name: "Commercial", checked: false },
  { id: "T003", name: "yeah", checked: false },
  { id: "T004", name: "Domestic", checked: true },
  { id: "T005", name: "Industrial", checked: false },
  { id: "T006", name: "TFY", checked: false },
];

function FrmOwnershipConfig() {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const [tankTypes, setTankTypes] = useState(MOCK_TANK_TYPES);

  const tableHeaders = [translate("Select"), translate("Tank Type Name")];
  const keyMapping = {
    [translate("Select")]: "checked",
    [translate("Tank Type Name")]: "name",
  };

  const handleCheckboxChange = (rowIndex, key, value) => {
    const updated = [...tankTypes];
    updated[rowIndex][key] = value;
    setTankTypes(updated);
  };

  const handleSelectAllChange = (isChecked) => {
    const updated = tankTypes.map((item) => ({ ...item, checked: isChecked }));
    setTankTypes(updated);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const selected = tankTypes.filter((item) => item.checked);

    if (selected.length === 0) {
      return Swal.fire({
        title: translate("Please select at least one tank type."),
        icon: "warning",
        showClass: { popup: "animate__animated animate__shakeX" },
      });
    }

    Swal.fire({
      title: translate("Saving..."),
      html: translate("Please wait"),
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    setTimeout(() => {
      Swal.close();
      Swal.fire({
        title: translate("Success!"),
        text: translate("Tank types configured successfully!"),
        icon: "success",
        showClass: { popup: "animate__animated animate__fadeInDown" },
      });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text={translate("Tank Types")} />
        <hr className="mb-4" />

        <Formik
          initialValues={{ ulbName: "मीरा-भाईंदर महानगरपालिका" }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="row mb-4 align-items-center">
                <div className="col-md-2">
                  <Label text={`${translate("ULB Name")} :`} required />
                </div>
                <div className="col-md-8">
                  <Field as="select" name="ulbName" disabled className="form-control">
                    <option value={values.ulbName}>{values.ulbName}</option>
                  </Field>
                </div>
              </div>

              <div className="card shadow-sm p-3 rounded-3">
                <Table
                  headers={tableHeaders}
                  data={tankTypes}
                  keyMapping={keyMapping}
                  onCheckboxChange={handleCheckboxChange}
                  onSelectAllChange={handleSelectAllChange}
                  showCheckboxInHeader
                  checkboxIdentifier="id"
                  noDataMessage={translate("No tank types found")}
                />
              </div>

              <div className="d-flex justify-content-center gap-4 mt-4">
                <SaveButton
                  type="submit"
                  text={isSubmitting ? translate("Submitting...") : translate("Submit")}
                  disabled={isSubmitting}
                />
                <SaveButton
                  type="button"
                  text={translate("Back")}
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

export default FrmOwnershipConfig;
