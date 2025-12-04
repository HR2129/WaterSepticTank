import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import Label from "../../../Components/Label/Label";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Table from "../../../Components/Table/Table";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Config from "../../../utils/config";
import Swal from "sweetalert2";

function FrmContractorConfig() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orgId, setOrgId] = useState(null);
  const [corporations, setCorporations] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [corpLoading, setCorpLoading] = useState(true);

  const userId = user?.username || "admin";
  const ipAddress = "192.168.1.10";

  // ---------------- Fetch ULB ID ----------------
  useEffect(() => {
    if (user?.ulbId) {
      setOrgId(parseInt(user.ulbId));
    } else {
      const storedId = localStorage.getItem("ulbId");
      if (storedId) setOrgId(parseInt(storedId));
    }
  }, [user]);

  // ---------------- Fetch Corporations ----------------
  useEffect(() => {
    if (!orgId) return;

    const fetchCorporations = async () => {
      try {
        setCorpLoading(true);
        const response = await apiService.post("CorporationDropdown", { orgId });
        const data = response?.data?.data || [];
        setCorporations(data);
      } catch (error) {
        console.error("❌ Error fetching corporations:", error);
      } finally {
        setCorpLoading(false);
      }
    };

    fetchCorporations();
  }, [orgId]);

  // ---------------- Fetch Contractors ----------------
  useEffect(() => {
    if (!orgId) {
      setContractors([]);
      setLoading(false);
      return;
    }

    const fetchContractorData = async () => {
      try {
        setLoading(true);

        const [listRes, configRes] = await Promise.all([
          apiService.post("GetContractorListDtls", { orgId }),
          apiService.post("GetContractorConfigDtls", { orgId }),
        ]);

        const allContractors = listRes?.data?.data || [];
        const configured = configRes?.data?.data || [];
        const configuredIds = configured.map((c) => c.CONTRID);

        const merged = allContractors.map((c) => ({
          id: c.CONTRACTORID,
          name: c.CONTRACTORNAME,
          address: c.CONTRACTORADDRESS,
          mobile: c.CONTRACTORMOBNO,
          flag: c.FLAG,
          checked: configuredIds.includes(c.CONTRACTORID),
        }));

        setContractors(merged);
      } catch (error) {
        console.error("❌ Error fetching contractor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorData();
  }, [orgId]);

  // ---------------- Table Setup ----------------
  const tableHeaders = [
    translate("Select"),
    translate("Contractor Name"),
    translate("Address"),
    translate("Mobile"),
  ];

  const keyMapping = {
    [translate("Select")]: "checked",
    [translate("Contractor Name")]: "name",
    [translate("Address")]: "address",
    [translate("Mobile")]: "mobile",
  };

  const handleCheckboxChange = (rowIndex, key, value) => {
    const updated = [...contractors];
    updated[rowIndex][key] = value;
    setContractors(updated);
  };

  const handleSelectAllChange = (isChecked) => {
    const updated = contractors.map((item) => ({ ...item, checked: isChecked }));
    setContractors(updated);
  };

  // ---------------- Submit Handler ----------------
  const handleSubmit = async (values, { setSubmitting }) => {
    Swal.fire({
      title: translate("Submitting..."),
      text: translate("Please wait while we process your request."),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    setSubmitting(true);

    const selected = contractors.filter((item) => item.checked);
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: translate("No Selection"),
        text: translate("Please select at least one contractor."),
      });
      setSubmitting(false);
      return;
    }

    const contractorStr = selected.map((s) => s.id).join("#") + "#";

    const payload = {
      in_UserId: userId,
      in_OrgId: orgId.toString(),
      in_contractorconfigstr: contractorStr,
      in_Ipaddress: ipAddress,
      in_Source: Config.source,
    };

    try {
      const response = await apiService.post("InsertContractorConfig", payload);

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: translate("Success"),
          text: translate(response.data.errorMsg || "Configuration saved successfully."),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: translate("Failed"),
          text: translate("Failed to save configuration."),
        });
      }
    } catch (error) {
      console.error("❌ Error submitting Contractor Config:", error);
      Swal.fire({
        icon: "error",
        title: translate("Error"),
        text: translate("Something went wrong. Please try again later."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const initialUlbName =
    corporations.find((c) => c.CORPID === orgId)?.CORPNAME || "";

  // ---------------- UI Rendering ----------------
  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text={translate("Contractor Configuration")} />
        <hr className="mb-4" />

        <Formik
          initialValues={{ ulbName: initialUlbName }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="row mb-4 align-items-center">
                <div className="col-md-2">
                  <Label text={`${translate("ULB Name")} :`} required />
                </div>

                <div className="col-md-8">
                  {corpLoading ? (
                    <p className="form-control-plaintext">
                      {translate("Loading corporations...")}
                    </p>
                  ) : (
                    <Field
                      as="select"
                      name="ulbName"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("ulbName", e.target.value);
                        const selectedCorp = corporations.find(
                          (c) => c.CORPNAME === e.target.value
                        );
                        if (selectedCorp) setOrgId(selectedCorp.CORPID);
                        else setOrgId(null);
                      }}
                      disabled={!!orgId}
                    >
                      <option value="">{translate("Select ULB")}</option>
                      {corporations.map((corp) => (
                        <option key={corp.CORPID} value={corp.CORPNAME}>
                          {corp.CORPNAME}
                        </option>
                      ))}
                    </Field>
                  )}
                </div>
              </div>

              <div className="card shadow-sm p-3 rounded-3">
                {loading ? (
                  <p className="text-center my-3">
                    {translate("Loading contractors...")}
                  </p>
                ) : contractors.length > 0 ? (
                  <Table
                    headers={tableHeaders}
                    data={contractors}
                    keyMapping={keyMapping}
                    onCheckboxChange={handleCheckboxChange}
                    onSelectAllChange={handleSelectAllChange}
                    showCheckboxInHeader={true}
                    checkboxIdentifier="id"
                    noDataMessage={translate("No contractors found")}
                  />
                ) : (
                  <p className="text-center text-muted">
                    {translate("No data available.")}
                  </p>
                )}
              </div>

              <div className="d-flex justify-content-center gap-4 mt-4">
                <SaveButton
                  type="submit"
                  text={
                    isSubmitting
                      ? translate("Submitting...")
                      : translate("Submit")
                  }
                  disabled={isSubmitting || loading || !orgId}
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

export default FrmContractorConfig;
