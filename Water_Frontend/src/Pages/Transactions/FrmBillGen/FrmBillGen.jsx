import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import InputField from "../../../Components/InputField/InputField";
import Button from "../../../Components/Button/button";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import Label from "../../../Components/Label/Label";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import CalendarIcon from "../../../Components/Calendar/CalendarIcon";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";

// ⭐ SWEETALERT2
import Swal from "sweetalert2";

const useLanguage = () => ({
  translate: (text) => text,
});

const useNavigate = () => (pathOrDelta) => {
  if (typeof pathOrDelta === "number")
    console.log(`Go back ${Math.abs(pathOrDelta)} steps.`);
  else console.log(`Navigating to: ${pathOrDelta}`);
};

function FrmBillGen() {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prabhagList, setPrabhagList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [tankDetails, setTankDetails] = useState(null);

  const orgId = user?.orgId || "890";
  const userId = user?.userId || "MBMCSPDTU";

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const initialValues = {
    tankNo: "",
    prabhag: "",
    zone: "",
    billGenerationDate: getTodayDate(),
    distanceManual: "",
    wasteQuantity: "",
    distanceCharges: "",
    wasteCharges: "",
    totalCharges: "",
  };

  // ─────────────────────────────────────────
  // Fetch Prabhag List
  useEffect(() => {
    const fetchPrabhags = async () => {
      try {
        const res = await apiService.post("prabhagDropdown", { ulbid: orgId });
        if (res?.data?.success && Array.isArray(res.data.data)) {
          const prabhags = res.data.data.map((p) => ({
            id: p.PRABHAGID,
            name: p.PRABHAGNAME,
          }));
          setPrabhagList(prabhags);
        }
      } catch (err) {
        console.error("prabhagDropdown API Error:", err);
      }
    };
    fetchPrabhags();
  }, [orgId]);

  // ─────────────────────────────────────────
  // Fetch Zone List
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const body = { orgId: orgId, prabhagId: prabhagList[0]?.id || "0" };
        const res = await apiService.post("ZoneDropdown", body);
        if (res?.data?.success && Array.isArray(res.data.data)) {
          const zones = res.data.data.map((z) => ({
            id: z.WARDID,
            name: z.WARDNAME,
          }));
          setZoneList(zones);
        }
      } catch (err) {
        console.error("ZoneDropdown API Error:", err);
      }
    };
    if (prabhagList.length > 0) fetchZones();
  }, [orgId, prabhagList]);

  // ─────────────────────────────────────────
  // Bill Calculator
  const BillCalculator = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
      const fetchDistanceRate = async () => {
        if (!isDataLoaded || !values.distanceManual) return;
        try {
          const res = await apiService.post("distanceRate", {
            distance: values.distanceManual,
            orgId,
          });
          const rate = res?.data?.data?.[0]?.RATE || 0;
          setFieldValue("distanceCharges", rate);
        } catch {
          setFieldValue("distanceCharges", 0);
        }
      };
      fetchDistanceRate();
    }, [values.distanceManual, isDataLoaded]);

    useEffect(() => {
      const fetchWasteRate = async () => {
        if (!isDataLoaded || !values.wasteQuantity) return;
        try {
          const res = await apiService.post("wasteRate", {
            waste: values.wasteQuantity,
            orgId,
          });
          const rate = res?.data?.data?.[0]?.RATE || 0;
          setFieldValue("wasteCharges", rate);
        } catch {
          setFieldValue("wasteCharges", 0);
        }
      };
      fetchWasteRate();
    }, [values.wasteQuantity, isDataLoaded]);

    useEffect(() => {
      if (!isDataLoaded) return;
      const total =
        (parseFloat(values.distanceCharges) || 0) +
        (parseFloat(values.wasteCharges) || 0);
      setFieldValue("totalCharges", total);
    }, [values.distanceCharges, values.wasteCharges, isDataLoaded]);

    return null;
  };

  // ─────────────────────────────────────────
  // Submit Handler WITH SWEET ALERT
  const onSubmit = async (values, { setSubmitting, setValues, resetForm }) => {
    setIsSubmitting(true);
    setSubmitting(true);
    setStatusMessage("");

    try {
      // VALIDATION for search
      if (!isDataLoaded && !values.tankNo.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Tank Number Required",
          text: "Please enter Tank Request Number before searching.",
        });
        return;
      }

      if (!isDataLoaded) {
        // STEP 1: Check Tank
        const checkRes = await apiService.post("tankRequestByNoC", {
          tankNo: values.tankNo,
        });

        if (checkRes?.data?.success && checkRes.data.data.length > 0) {
          const record = checkRes.data.data[0];

          if (record.VAR_REQUEST_STATUS === "BG") {
            Swal.fire({
              icon: "warning",
              title: "Bill Already Generated",
              text: "A bill has already been generated for this tank.",
            });
            return;
          }

          // STEP 2: Fetch Full Details
          const fullRes = await apiService.post("tankRequestFullDetails", {
            orgId,
            tankrqstid: record.NUM_REQUEST_ID,
          });

          if (
            fullRes?.data?.success &&
            Array.isArray(fullRes.data.data) &&
            fullRes.data.data.length > 0
          ) {
            const tank = fullRes.data.data[0];
            const fetchedData = {
              prabhag: tank.TANK_PRABHAGID?.toString() || "",
              zone: tank.TANK_ZONEID?.toString() || "",
              distanceManual: tank.DISTANCE || "",
              wasteQuantity: tank.WASTECOLLECTED || "",
            };

            setValues((prev) => ({ ...prev, ...fetchedData }));
            setTankDetails({
              request_id: record.NUM_REQUEST_ID,
              tankid: record.NUM_REQUEST_TNKID,
            });

            setIsDataLoaded(true);

            Swal.fire({
              icon: "success",
              title: "Tank Found",
              text: "Tank details loaded successfully.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "No Data Found",
              text: "No tank details found for this request ID.",
            });
          }
        } else {
          const checkBG = await apiService.post("tankRequestByNoBG", {
            tankNo: values.tankNo,
          });

          if (checkBG?.data?.success && checkBG.data.data.length > 0) {
            Swal.fire({
              icon: "warning",
              title: "Bill Already Generated",
              text: "A bill has already been generated for this tank.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Tank Not Found",
              text: "No tank record found for this Tank Number.",
            });
          }
        }
      } else {
        // STEP 3: Generate Bill
        const payload = {
          userid: userId,
          request_id: tankDetails?.request_id,
          tankid: tankDetails?.tankid,
          prabhagid: Number(values.prabhag),
          zoneid: Number(values.zone),
          distance: Number(values.distanceManual),
          waste: Number(values.wasteQuantity),
          distamt: Number(values.distanceCharges),
          wasteamt: Number(values.wasteCharges),
          total: Number(values.totalCharges),
          billgendate: values.billGenerationDate,
          ulbid: Number(orgId),
        };

        const insertRes = await apiService.post("TankBillInsert", payload);

        if (insertRes?.data?.message?.includes("Bill Generated Successfully")) {
          Swal.fire({
            icon: "success",
            title: "Bill Generated",
            text: insertRes.data.message,
          });

          resetForm({ values: initialValues });
          setIsDataLoaded(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Failed to generate bill. Please try again.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────
  const renderField = (
    field,
    label,
    type = "text",
    required = false,
    readOnly = false,
    isSelect = false,
    options = []
  ) => (
    <div className="mb-4">
      <Label text={`${translate(label)}:`} required={required} />
      {isSelect ? (
        <Field
          as="select"
          name={field}
          disabled={true}
          className="w-full border rounded-md p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
        >
          <option value="">-- Select Option --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </Field>
      ) : (
        <Field name={field} type={type} component={InputField} readOnly={readOnly} />
      )}
      <ErrorMessage
        name={field}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );

  const { FrmBillGen } = ValidationSchemas(translate);

  // ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full mx-auto bg-white shadow-xl rounded-lg p-6">
        <HeaderLabel text={translate("Bill Generation")} />

        <Formik
          initialValues={initialValues}
          validationSchema={() => FrmBillGen(isDataLoaded)}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ resetForm }) => (
            <Form>
              <BillCalculator />

              {/* Search Section */}
              <div className="bg-white border p-4 rounded-lg mb-6 shadow-md">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-full sm:w-1/3">
                    <Label text="Tank Request No:" required />
                    <Field
                      name="tankNo"
                      component={InputField}
                      placeholder="Enter Tank No "
                      readOnly={isDataLoaded}
                    />
                    <ErrorMessage
                      name="tankNo"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Button
                      type={isDataLoaded ? "button" : "submit"}
                      text={isDataLoaded ? "Back" : "Search"}
                      disabled={isSubmitting}
                      onClick={
                        isDataLoaded
                          ? () => {
                              setIsDataLoaded(false);
                              setStatusMessage("");
                              resetForm({ values: initialValues });
                            }
                          : null
                      }
                      className={
                        isDataLoaded
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Bill Section */}
              {isDataLoaded && (
                <div className="bg-white border border-blue-200 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Bill Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderField("prabhag", "Prabhag", "text", true, true, true, prabhagList)}
                    {renderField("zone", "Zone", "text", true, true, true, zoneList)}
                    {renderField("billGenerationDate", "Bill Generation Date", "date", true)}
                    {renderField("distanceManual", "Distance (Manual)", "number", true)}
                    {renderField("wasteQuantity", "Waste Quantity", "number", true)}
                    {renderField("distanceCharges", "Distance Charges", "number", true, true)}
                    {renderField("wasteCharges", "Waste Charges", "number", true, true)}
                    {renderField("totalCharges", "Total Charges", "number", true, true)}
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <SaveButton
                      type="submit"
                      text="Generate Bill"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 w-40"
                    />
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default FrmBillGen;
