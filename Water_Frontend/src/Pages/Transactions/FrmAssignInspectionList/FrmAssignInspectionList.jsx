import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Table from "../../../Components/Table/Table";
import { useLanguage } from "../../../Context/LanguageProvider";

const MOCK_TANK_TYPES = [
  { id: "T001", name: "Yes", checked: false },
  { id: "T002", name: "Commercial", checked: false },
  { id: "T003", name: "yeah", checked: false },
  { id: "T004", name: "Domestic", checked: true },
  { id: "T005", name: "Industrial", checked: false },
  { id: "T006", name: "TFY", checked: false },
];

function FrmAssignInspectionList() {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const [tankTypes, setTankTypes] = useState(MOCK_TANK_TYPES);

  // Handle individual checkbox change
  const handleCheckboxChange = (rowIndex, key, value) => {
    const updated = [...tankTypes];
    updated[rowIndex][key] = value;
    setTankTypes(updated);
  };

  // Handle select-all checkbox
  const handleSelectAllChange = (isChecked) => {
    const updated = tankTypes.map((item) => ({ ...item, checked: isChecked }));
    setTankTypes(updated);
  };

  // Submit handler
  const handleSubmit = (values, { setSubmitting }) => {
    const selected = tankTypes.filter((t) => t.checked);
    if (selected.length === 0) {
      alert(translate("Please select at least one tank type."));
      setSubmitting(false);
      return;
    }

    alert(
      translate(
        `Tank Types configured: ${selected.map((t) => t.name).join(", ")}`
      )
    );

    setTimeout(() => setSubmitting(false), 800);
  };

  // --- Define table headers ---
  const tableHeaders = [
    translate("Select"),
    translate("Tank Type ID"),
    translate("Tank Type Name"),
    translate("Actions"),
  ];

  // --- Map headers to keys in data ---
  const keyMapping = {
    [translate("Select")]: "checked",
    [translate("Tank Type ID")]: "id",
    [translate("Tank Type Name")]: "name",
    [translate("Actions")]: "actions", // custom renderer key
  };

  // --- Custom renderers (View button) ---
  const customRenderers = {
    [translate("Actions")]: (row) => (
      <SaveButton
        type="button"
        text={translate("View")}
        onClick={() => navigate("/Masters/FrmContractorMst")}
      />
    ),
  };

  return (
    <div className="main-wrapper">


      <div className="container mt-4">
        <HeaderLabel text={translate("Assign For Inspection")} />
        <hr className="mb-4" />

        <Formik initialValues={{}} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="card shadow-sm p-3 rounded-3">
                <Table
                  headers={tableHeaders}
                  data={tankTypes}
                  keyMapping={keyMapping}
                  onCheckboxChange={handleCheckboxChange}
                  onSelectAllChange={handleSelectAllChange}
                  showCheckboxInHeader={true}
                  checkboxIdentifier="id"
                  noDataMessage={translate("No tank types found")}
                  customRenderers={customRenderers} // ✅ View button support
                />
              </div>

              <div className="d-flex justify-content-center gap-4 mt-4">
                <SaveButton
                  type="submit"
                  text={
                    isSubmitting
                      ? translate("Submitting...")
                      : translate("Submit")
                  }
                  disabled={isSubmitting}
                />
                <SaveButton
                  type="button"
                  text={translate("Back")}
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmAssignInspectionList;
