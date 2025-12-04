import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";

import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";

function FrmInspectionEntry() {
    const { translate } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const requestId = location?.state?.requestId;
    console.log("requestId:",requestId)
    const orgId = Number(user?.ulbId) || 890;

    console.log("📌 FrmInspectionEntry Loaded | requestId:", requestId);

    const [tankId, setTankId] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [tankConditionList, setTankConditionList] = useState([]);
    const [accessDifficultyList, setAccessDifficultyList] = useState([]);
    const [loading, setLoading] = useState(false);

    const VALID_TEXT_REGEX = /^[A-Za-z0-9 ,()\-]*$/;

    const formatDate = (dt) => {
    if (!dt) return "";

    // If format is dd/mm/yyyy
    if (typeof dt === "string" && dt.includes("/")) {
        const [day, month, year] = dt.split("/");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
    // If format is ISO from DB (2025-11-19T18:30:00.000Z)
    const d = new Date(dt);
    if (isNaN(d)) return "";

    return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
};

const convertToInputDate = (dt) => {
    if (!dt) return "";
    if (dt.includes("/")) {
        const [day, month, year] = dt.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dt;
};

    const [initialValues, setInitialValues] = useState({
        ownerName: "",
        mobileNumber: "",
        propertyID: "",
        email: "",
        zone: "",
        prabhag: "",
        ownershipType: "",
        tankType: "",
        longitude: "",
        latitude: "",
        address: "",
        registrationDate: "",
        tankCapacity: "",
        status: "",
        requestDate: "",
        serviceType: "",
        remarks: "",
        requestedBy: "",
        assignedTo: "",
        visitDate: "",
        tankCondition: "",
        accessDifficulty: "",
        wasteLevel: "",
        inspectionRemarks: "",
        statusRadio: "",
    });

    const validationSchema = Yup.object({
        assignedTo: Yup.string().required("Required"),
        visitDate: Yup.string().required("Required"),

        tankCondition: Yup.string().required("Required"),
        accessDifficulty: Yup.string().required("Required"),
        wasteLevel: Yup.string().required("Required"),
        inspectionRemarks: Yup.string().matches(VALID_TEXT_REGEX, "Invalid characters").required("Required"),
        statusRadio: Yup.string().required("Required"),
    });

    const fetchStaffList = async () => {
        console.log("🟡 Fetching Staff List...");

        try {
            const res = await apiService.post("GetStaffList", { orgId, requestId });
            console.log("🟢 Staff List:", res?.data?.data);
            setStaffList(res?.data?.data || []);
        } catch (err) {
            console.error("🔴 Staff List Error:", err);
        }
    };

    const fetchTankConditionList = async () => {
        console.log("🟡 Fetching Tank Condition List...");

        try {
            const res = await apiService.post("GetTankConditionList", {});
            console.log("🟢 TankConditionList:", res?.data?.data);
            setTankConditionList(res?.data?.data || []);
        } catch (err) {
            console.error("🔴 Tank Condition List Error:", err);
        }
    };

    const fetchAccessDifficultyList = async () => {
        console.log("🟡 Fetching Access Difficulty List...");

        try {
            const res = await apiService.post("GetAccessDifficultyList", {});
            console.log("🟢 AccessDifficultyList:", res?.data?.data);
            setAccessDifficultyList(res?.data?.data || []);
        } catch (err) {
            console.error("🔴 Access Difficulty List Error:", err);
        }
    };

    const fetchDetails = async () => {
        console.log("🟡 Fetching Request Details...");

        try {
            setLoading(true);

            const res = await apiService.post("GetRequestDetails", { orgId, requestId });
            const d = res?.data?.data?.[0];

            console.log("🟢 Request Details:", d);

            if (!d) return;

            setTankId(d.TANK_ID);

            setInitialValues({
                ownerName: d.TANK_OWNERNAME || "",
                mobileNumber: d.TANK_MOBILE || "",
                propertyID: d.TANK_PROPNO || "",
                email: d.TANK_EMAILID || "",
                zone: d.ZONENAME || "",
                prabhag: d.PRABHAGNAME || "",
                ownershipType: d.OWNERTYPENAMEA || "",
                tankType: d.TYPENAME || "",
                longitude: d.TANK_LONGITUDE || "",
                latitude: d.TANK_LATITUDE || "",
                address: d.TANK_ADDRESS || "",
                registrationDate: formatDate(d.TANK_REGDATE),
                tankCapacity: d.TANK_CAPACITY || "",
                status: d.STATUS || "",
                requestDate: formatDate(d.DAT_REQUEST_DATE),
                serviceType: d.SERVTYPE_NAME || "",
                remarks: d.VAR_REQUEST_REMARK || "",
                requestedBy: d.VAR_REQUEST_REQSTBY || "",

                assignedTo: d.NUM_REQUEST_STAFFID || "",
visitDate: d.VISITDATE ? convertToInputDate(d.VISITDATE) : "",
                tankCondition: "",
                accessDifficulty: "",
                wasteLevel: "",
                inspectionRemarks: "",
                statusRadio: "",
            });

        } catch (err) {
            console.error("🔴 Error fetching details:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load Data
    useEffect(() => {
        if (requestId) {
            fetchDetails();
            fetchStaffList();
            fetchTankConditionList();
            fetchAccessDifficultyList();
        }
    }, [requestId, orgId]);

    // Submit
    const handleSubmit = async (values, { setSubmitting }) => {
        console.log("🟡 SUBMIT CLICKED:", values);

        try {
            const payload = {
                userId: user?.userId || "MBMCSPDTU",
                requestId,
                tankId,
                visitDate: values.visitDate,
                staffId: values.assignedTo,
                tnkCondition: values.tankCondition,
                tnkAccessDifty: values.accessDifficulty,
                wasteLevel: values.wasteLevel,
                remark: values.inspectionRemarks,
                status: values.statusRadio,
                orgId,
            };

            console.log("🚀 FINAL PAYLOAD:", payload);

            await apiService.post("tnkInspectionIns", payload);

            alert("Inspection Entry Saved Successfully!");
            navigate(-1);

        } catch (err) {
            console.error("🔴 Submit Error:", err);
            alert("Failed to save inspection entry!");
        }

        setSubmitting(false);
    };

    const renderRow = (field, label) => (
        <div className="col-md-4 mb-3">
            <Label text={`${label}:`} />
            <Field name={field} component={InputField} className="form-control" />
        </div>
    );

    return (
        <div className="main-wrapper">
            <div className="container mt-4">
                <HeaderLabel text="Inspection Entry" />
                <hr />

                {loading ? (
                    <div className="alert alert-info">Loading...</div>
                ) : (
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>

                                {/* TANK DETAILS */}
                                <div className="card p-4 mb-4 shadow-sm">
                                    <h5>Tank Details</h5>
                                    <hr />
                                    <div className="row">
                                        {renderRow("ownerName", "Owner Name")}
                                        {renderRow("mobileNumber", "Mobile No")}
                                        {renderRow("propertyID", "Property ID")}
                                        {renderRow("email", "Email")}
                                        {renderRow("zone", "Zone")}
                                        {renderRow("prabhag", "Prabhag")}
                                        {renderRow("ownershipType", "Ownership Type")}
                                        {renderRow("tankType", "Tank Type")}
                                        {renderRow("longitude", "Longitude")}
                                        {renderRow("latitude", "Latitude")}
                                        {renderRow("address", "Address")}
                                        {renderRow("registrationDate", "Registration Date")}
                                        {renderRow("tankCapacity", "Tank Capacity")}
                                        {renderRow("status", "Status")}
                                    </div>
                                </div>

                                {/* REQUEST DETAILS */}
                                <div className="card p-4 mb-4 shadow-sm">
                                    <h5>Request Details</h5>
                                    <hr />
                                    {renderRow("requestDate", "Request Date")}
                                    {renderRow("serviceType", "Service Type")}
                                    {renderRow("remarks", "Remarks")}
                                    {renderRow("requestedBy", "Requested By")}
                                </div>

                                {/* INSPECTION FORM */}
                                <div className="card p-4 mb-4 shadow-sm">
                                    <h5>Inspection Entry</h5>
                                    <hr />

                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <Label text="Assign To *" />
                                            <Field
                                                as="select"
                                                name="assignedTo"
                                                className="form-control"
                                                disabled   // MAKE READ ONLY
                                            >
                                                <option value="">-- Select Staff --</option>
                                                {staffList.map((s) => (
                                                    <option key={s.STAFFID} value={s.STAFFID}>
                                                        {s.STAFF_NAME}
                                                    </option>
                                                ))}
                                            </Field>

                                            <ErrorMessage name="assignedTo" component="div" className="text-danger small" />
                                        </div>

                                        <div className="col-md-4">
                                            <Label text="Visit Date *" />
                                            <Field name="visitDate" type="date" component={InputField} className="form-control" disabled/>
                                            <ErrorMessage name="visitDate" component="div" className="text-danger small" />
                                        </div>

                                        <div className="col-md-4">
                                            <Label text="Tank Condition *" />
                                            <Field as="select" name="tankCondition" className="form-control">
                                                <option value="">-- Select Condition --</option>
                                                {tankConditionList.map((item) => (
                                                    <option key={item.NUM_TNKCND_ID} value={item.NUM_TNKCND_ID}>
                                                        {item.VAR_TNKCND_NAME}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="tankCondition" component="div" className="text-danger small" />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <Label text="Access Difficulty *" />
                                            <Field as="select" name="accessDifficulty" className="form-control">
                                                <option value="">-- Select Difficulty --</option>
                                                {accessDifficultyList.map((item) => (
                                                    <option key={item.NUM_ACSDIFCTY_ID} value={item.NUM_ACSDIFCTY_ID}>
                                                        {item.VAR_ACSDIFCTY_NAME}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="accessDifficulty" component="div" className="text-danger small" />
                                        </div>

                                        <div className="col-md-4">
                                            <Label text="Waste Level (%) *" />
                                            <Field name="wasteLevel" component={InputField} className="form-control" />
                                            <ErrorMessage name="wasteLevel" component="div" className="text-danger small" />
                                        </div>

                                        <div className="col-md-4">
                                            <Label text="Remarks *" />
                                            <Field name="inspectionRemarks" component={InputField} className="form-control" />
                                            <ErrorMessage name="inspectionRemarks" component="div" className="text-danger small" />
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <Label text="Status *" />
                                            <div>
                                                <label className="me-3">
                                                    <Field type="radio" name="statusRadio" value="Y" /> Accepted
                                                </label>
                                                <label>
                                                    <Field type="radio" name="statusRadio" value="N" /> Rejected
                                                </label>
                                            </div>
                                            <ErrorMessage name="statusRadio" component="div" className="text-danger small" />
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="d-flex justify-content-center gap-3">
                                    <SaveButton type="submit" text="Submit" disabled={isSubmitting} className="btn btn-success" />
                                    <SaveButton type="button" text="Back" className="btn btn-secondary" onClick={() => navigate(-1)} />
                                </div>

                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
}

export default FrmInspectionEntry;
