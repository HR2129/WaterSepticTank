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

function FrmStaffConfig() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState(null);
  const [corporations, setCorporations] = useState([]);
  const [corpLoading, setCorpLoading] = useState(true);

  const userId = user?.username;
  const ipAddress = "192.168.1.10";

  useEffect(() => {
    if (user?.ulbId) {
      setOrgId(parseInt(user.ulbId));
    } else {
      const storedId = localStorage.getItem("ulbId");
      if (storedId) setOrgId(parseInt(storedId));
    }
  }, [user]);

  useEffect(() => {
    const fetchCorporations = async () => {
      try {
        setCorpLoading(true);
        const payload = orgId ? { orgId } : {};
        const response = await apiService.post("CorporationDropdown", payload);
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

  useEffect(() => {
    if (!orgId) {
      setStaffList([]);
      return;
    }
    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const [staffRes, configRes] = await Promise.all([
          apiService.post("GetStaffListDtls", { orgId }),
          apiService.post("GetStaffConfigDtls", { orgId }),
        ]);

        const allStaff = staffRes?.data?.data || [];
        const configured = configRes?.data?.data || [];
        const configuredIds = configured.map((c) => c.STAFFID);

        const merged = allStaff.map((item) => ({
          id: item.STAFFID,
          name: item.STAFFNAME,
          mobile: item.STAFFMOBNO,
          address: item.STAFFADDRESS,
          flag: item.FLAG,
          checked: configuredIds.includes(item.STAFFID),
        }));

        setStaffList(merged);
      } catch (error) {
        console.error("❌ Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, [orgId]);

  const tableHeaders = [
    translate("Select"),
    // translate("Staff ID"),
    translate("Staff Name"),
    translate("Mobile No"),
    translate("Address"),
    // translate("Flag"),
  ];

  const keyMapping = {
    [translate("Select")]: "checked",
    // [translate("Staff ID")]: "id",
    [translate("Staff Name")]: "name",
    [translate("Mobile No")]: "mobile",
    [translate("Address")]: "address",
    // [translate("Flag")]: "flag",
  };

  const handleCheckboxChange = (rowIndex, key, value) => {
    const updated = [...staffList];
    updated[rowIndex][key] = value;
    setStaffList(updated);
  };

  const handleSelectAllChange = (isChecked) => {
    const updated = staffList.map((item) => ({ ...item, checked: isChecked }));
    setStaffList(updated);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    Swal.fire({
      title: translate("Submitting..."),
      text: translate("Please wait while we process your request."),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    const selected = staffList.filter((item) => item.checked);
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: translate("No Selection"),
        text: translate("Please select at least one staff member."),
      });
      return;
    }

    let submissionUlbId = orgId;
    if (!submissionUlbId) {
      const selectedCorp = corporations.find((c) => c.CORPNAME === values.ulbName);
      if (selectedCorp) submissionUlbId = selectedCorp.CORPID;
    }

    if (!submissionUlbId) {
      Swal.fire({
        icon: "warning",
        title: translate("Invalid ULB"),
        text: translate("Please select a valid ULB before submitting."),
      });
      return;
    }

    const configStr = selected.map((s) => s.id).join("#");

    const payload = {
      in_UserId: userId,
      in_UlbId: submissionUlbId.toString(),
      in_staffconfigstr: configStr,
      in_ipaddress: ipAddress,
      in_source: Config.source,
    };

    try {
      setSubmitting(true);
      const res = await apiService.post("InsertStaffConfig", payload);
      if (res?.data?.success && res.data.errorCode === 9999) {
        Swal.fire({
          icon: "success",
          title: translate("Success"),
          text: translate(res.data.errorMsg),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: translate("Failed"),
          text: translate("Failed to save configuration."),
        });
      }
    } catch (error) {
      console.error("❌ Error submitting configuration:", error);
      Swal.fire({
        icon: "error",
        title: translate("Error"),
        text: translate("Something went wrong while saving data."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const initialUlbName = corporations.find((c) => c.CORPID === orgId)?.CORPNAME || "";

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <HeaderLabel text={translate("Staff Configuration")} />
        <hr className="mb-4" />

        <Formik initialValues={{ ulbName: initialUlbName }} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="row mb-4 align-items-center">
                <div className="col-md-2">
                  <Label text={`${translate("ULB Name")} :`} required />
                </div>
                <div className="col-md-8">
                  {corpLoading ? (
                    <p className="form-control-plaintext">{translate("Loading corporations...")}</p>
                  ) : (
                    <Field
                      as="select"
                      name="ulbName"
                      className="form-control"
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        setFieldValue("ulbName", selectedName);
                        const selectedCorp = corporations.find((c) => c.CORPNAME === selectedName);
                        setOrgId(selectedCorp ? selectedCorp.CORPID : null);
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
                  <p className="text-center">{translate("Loading staff data...")}</p>
                ) : staffList.length > 0 ? (
                  <Table
                    headers={tableHeaders}
                    data={staffList}
                    keyMapping={keyMapping}
                    onCheckboxChange={handleCheckboxChange}
                    onSelectAllChange={handleSelectAllChange}
                    showCheckboxInHeader={true}
                    checkboxIdentifier="id"
                    noDataMessage={translate("No staff found")}
                  />
                ) : (
                  <p className="text-center text-muted">{translate("No staff data available.")}</p>
                )}
              </div>

              <div className="d-flex justify-content-center gap-4 mt-4">
                <SaveButton
                  type="submit"
                  text={isSubmitting ? translate("Submitting...") : translate("Submit")}
                  disabled={isSubmitting || loading}
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

export default FrmStaffConfig;
