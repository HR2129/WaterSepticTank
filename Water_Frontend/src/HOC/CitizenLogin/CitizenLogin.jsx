import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import { useNavigate } from "react-router-dom";
import TextBox from "../../Components/TextBox/TextBox";
import AdminPortal from "../../../public/assets/Images/BgLoginWeb.jpg";
import AscenTech_Logo from "../../../public/assets/Images/AscenTech_Logomini.png";
import "./CitizenLogin.css";
import LoginCard from "../../Components/Card/LoginCard";
import LoginButton from "../../Components/Buttons/button";
import NavbarText from "../../Components/NavbarText/NavbarText";
import NavbarLogo from "../../Components/NavbarLogo/NavbarLogo";
import { useLanguage } from "../../Context/LanguageProvider";
import { logError } from "../../logger";
import { useAuth } from "../../Context/AuthContext";
import { inputHandlers } from "../../HOC/Validation/InputValidations";

const CitizenLogin = () => {
  const { translate } = useLanguage();
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState(null);
  const [navbarText, setNavbarText] = useState({ text1: "", text2: "" });
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    MobileNO: "",
    otp: "",
  });

  const setFormDataValue = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/textlogo/5");
        if (res.data.success) {
          const { ULBLOGO, ABC_MUNICIPAL_TEXT, MARRIAGE_REGISTRATION_TEXT } =
            res.data.data;
          setLogoUrl(ULBLOGO);
          setNavbarText({
            text1: ABC_MUNICIPAL_TEXT,
            text2: MARRIAGE_REGISTRATION_TEXT,
          });
        }
      } catch (err) {
        console.error("Error fetching logo:", err);
        logError(err, "Logo Fetch Error");
      }
    };
    fetchLogo();
  }, []);

  // 🔹 Mode 1 → Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.MobileNO || formData.MobileNO.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const payload = {
      in_userid: "MBMCSPDTU",
      in_Mobile: formData.MobileNO,
      in_otp: "",
      in_mode: 1,
      in_ulbid: 890,
    };

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/PropertyOtp", payload);
      console.log("Send OTP Response:", res.data);

      if (res.data.success && res.data.ErrorCode === -100) {
        Swal.fire({
          icon: "success",
          title: res.data.ErrorMsg,
          showConfirmButton: false,
          timer: 2000,
        });
        setIsOtpStage(true);
      } else {
        setError(res.data.ErrorMsg);
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      setError("An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mode 2 → Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.otp) {
      setError("Please enter the OTP.");
      return;
    }

    const payload = {
      in_userid: "MBMCSPDTU",
      in_Mobile: formData.MobileNO,
      in_otp: formData.otp,
      in_mode: 2,
      in_ulbid: 890,
    };

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/PropertyOtp", payload);
      console.log("Verify OTP Response:", res.data);

      if (res.data.success && res.data.ErrorCode === -100) {
        Swal.fire({
          icon: "success",
          title: res.data.ErrorMsg,
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/FrmCitizenDashboard");
      } else {
        setError(res.data.ErrorMsg || "Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setError("An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const payload = {
        in_userid: "MBMCSPDTU",
        in_Mobile: formData.MobileNO,
        in_otp: "",
        in_mode: 1,
        in_ulbid: 890,
      };

      const res = await axios.post("http://localhost:5000/PropertyOtp", payload);
      if (res.data.success && res.data.ErrorCode === -100) {
        Swal.fire({
          icon: "info",
          title: "OTP resent successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        setError(res.data.ErrorMsg || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setError("Error while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={AdminPortal} alt="background" className="background-image" />
      <LoginCard className="card_login">
   <div className="heading-logo text-center mb-3">
  <img
    src={AscenTech_Logo}
    alt="ASCENTech Logo"
    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
  />
  <h5 className="mt-2 mb-0 fw-bold text-dark">
    ASCENTech Nagarkaryavali
  </h5>
</div>


        <div className="welcome-text">{translate("welcomelogin")}</div>

        <form onSubmit={isOtpStage ? handleVerifyOtp : handleSendOtp}>
          <div className="textboxes-container">
            {!isOtpStage ? (
              // <TextBox
              //   label=""
              //   placeholder="Enter Mobile Number"
              //   type="text"
              //   name="MobileNO"
              //   value={formData.MobileNO}
              //   onChange={(e) =>
              //     inputHandlers.mobileNumber(e, setFormDataValue, "MobileNO")
              //   }
              //   required
              // />
              <TextBox
                label=""
                placeholder="Enter Mobile Number"
                type="text"
                name="MobileNO"
                value={formData.MobileNO}
                onChange={(e) => {
                  console.log("📌 RAW INPUT:", e.target.value);

                  let value = e.target.value.replace(/\D/g, "");
                  console.log("➡️ Digits only:", value);

                  if (value.length > 10) {
                    console.log("⚠️ Trimming value to 10 digits");
                    value = value.slice(0, 10);
                  }

                  console.log("✅ FINAL STATE VALUE:", value);

                  setFormDataValue("MobileNO", value);
                }}
                required
              />
            ) : (
              <TextBox
                label=""
                placeholder="Enter OTP"
                type="text"
                name="otp"
                maxLength="6"
                value={formData.otp}
                onChange={(e) =>
                  setFormDataValue("otp", e.target.value.replace(/\D/g, ""))
                }
                required
              />
            )}
          </div>

          {error && <div className="error-message text-danger">{error}</div>}

          <div className="login-button-container mt-4 mb-3 d-flex justify-content-center gap-2">
            {!isOtpStage ? (
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? "Submit" : "Submit"}
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading}
                >
                  {loading ? "Submit" : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Resend
                </button>
              </>
            )}
          </div>
        </form>
      </LoginCard>
    </div>
  );
};

export default CitizenLogin;
