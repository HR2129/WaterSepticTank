import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import Label from "../../../Components/Label/Label";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useLanguage } from "../../../Context/LanguageProvider";
import Table from "../../../Components/Table/Table";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Config from "../../../utils/config";

function FrmTankTypeConfig() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tankTypes, setTankTypes] = useState([]);
  const [corporations, setCorporations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [corpLoading, setCorpLoading] = useState(true);

  const userId = user?.username || "admin";
  const ipAddress = "192.168.1.10";

  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    if (user?.ulbId) {
      setOrgId(parseInt(user.ulbId));
    } else {
      const storedId = localStorage.getItem("ulbId");
      if (storedId) setOrgId(parseInt(storedId));
    }
  }, [user]);

  // Fetch ULB list
  useEffect(() => {
    if (!orgId) return;

    const fetchCorporations = async () => {
      try {
        setCorpLoading(true);
        const response = await apiService.post("CorporationDropdown", { orgId });
        setCorporations(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching ULB list:", error);
      } finally {
        setCorpLoading(false);
      }
    };

    fetchCorporations();
  }, [orgId]);

  // Fetch tank types + configured list
  useEffect(() => {
    if (!orgId) return;

    const fetchTankTypeData = async () => {
      try {
        setLoading(true);

        const listResponse = await apiService.post("getTankTypeListDtls", { orgId });
        const allTankTypes = listResponse?.data?.data || [];

        const configResponse = await apiService.post("getTankTypeConfigList", { orgId });
        const configured = configResponse?.data?.data || [];

        const configuredIds = configured.map((x) => x.TYPEID);

        const mergedList = allTankTypes.map((item) => ({
          id: item.TYPEID,
          name: item.TYPENAME,
          flag: item.FLAG,
          checked: configuredIds.includes(item.TYPEID),
        }));

        setTankTypes(mergedList);
      } catch (error) {
        console.error("Error fetching tank type config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTankTypeData();
  }, [orgId]);

  const tableHeaders = [translate("Select"), translate("Tank Type Name")];
  const keyMapping = {
    [translate("Select")]: "checked",
    [translate("Tank Type Name")]: "name",
    // [translate("Flag")]: "flag",
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

  // ==========================
  //        SUBMIT
  // ==========================
  const handleSubmit = async (values, { setSubmitting }) => {
    const selected = tankTypes.filter((t) => t.checked);

    if (selected.length === 0) {
      Swal.fire({
        title: translate("No Tank Type Selected"),
        text: translate("Please select at least one tank type."),
        icon: "warning",
        showClass: { popup: "animate__animated animate__shakeX" },
      });
      setSubmitting(false);
      return;
    }

    if (!orgId) {
      Swal.fire({
        title: translate("ULB Missing"),
        text: translate("ULB configuration is missing. Cannot submit."),
        icon: "error",
        showClass: { popup: "animate__animated animate__shakeX" },
      });
      setSubmitting(false);
      return;
    }

    const in_TankTypeStr = selected.map((s) => s.id).join("#");

    const payload = {
      in_UserId: userId,
      in_OrgId: orgId,
      in_TankTypeStr,
      in_Ipaddress: ipAddress,
      in_Source: Config.source,
    };

    console.log("Payload:", payload);

    // Loader Popup
    Swal.fire({
      title: translate("Saving Configuration..."),
      html: translate("Please wait..."),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await apiService.post("InsertTankTypeConfig", payload);
      Swal.close();

      if (response?.data?.success) {
        Swal.fire({
          title: translate("Success!"),
          text: translate(response.data.errorMsg || "Configuration saved successfully."),
          icon: "success",
          showClass: { popup: "animate__animated animate__fadeInDown" },
          hideClass: { popup: "animate__animated animate__fadeOutUp" },
        });
      } else {
        Swal.fire({
          title: translate("Failed"),
          text: translate("Operation failed. Please try again."),
          icon: "error",
          showClass: { popup: "animate__animated animate__shakeX" },
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: translate("Error"),
        text: translate("Something went wrong. Please try again later."),
        icon: "error",
        showClass: { popup: "animate__animated animate__shakeX" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text={translate("Tank Type Configuration")} />
        <hr />

        <Formik
          initialValues={{
            ulbName: corporations.find((c) => c.CORPID === orgId)?.CORPNAME || "",
          }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              {/* ULB NAME */}
              <div className="row mb-4">
                <div className="col-md-2">
                  <Label text={`${translate("ULB Name")} :`} />
                </div>
                <div className="col-md-8">
                  <Field
                    as="select"
                    name="ulbName"
                    className="form-control"
                    disabled={true}
                  >
                    <option value="">{translate("Select ULB")}</option>
                    {corporations.map((corp) => (
                      <option key={corp.CORPID} value={corp.CORPNAME}>
                        {corp.CORPNAME}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>

              {/* TANK TYPES TABLE */}
              <div className="card p-3 mb-4 shadow-sm">
                {loading ? (
                  <p className="text-center">⏳ {translate("Loading tank types...")}</p>
                ) : tankTypes.length > 0 ? (
                  <Table
                    headers={tableHeaders}
                    data={tankTypes}
                    keyMapping={keyMapping}
                    onCheckboxChange={handleCheckboxChange}
                    onSelectAllChange={handleSelectAllChange}
                    showCheckboxInHeader
                  />
                ) : (
                  <p className="text-center text-muted">{translate("No data found.")}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="d-flex justify-content-center gap-4">
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

export default FrmTankTypeConfig;
