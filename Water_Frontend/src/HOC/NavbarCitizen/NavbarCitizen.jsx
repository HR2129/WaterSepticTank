import React from "react";
import "./NavbarCitizen.css";
import logo from "../../../public/assets/Images/CorporationLogo.png"; // your logo path
import { useNavigate } from "react-router-dom";
import LogOut from "../../Components/LogOutButton/LogOut";

const NavbarCitizen = () => {
  const navigate = useNavigate();

  return (
    <nav className="citizen-navbar shadow-sm d-flex justify-content-between align-items-center px-4">
      {/* Left Section: Logo */}
      <div className="navbar-left d-flex align-items-center gap-2">
        <img src={logo} alt="ULB Logo" className="ulb-logo" />
      </div>

      {/* Center Section: Title */}
      <div className="text-center">
        <h5 className="ulb-title mb-0 fw-bold">मिरा-भाईंदर महानगरपालिका</h5>
        <p className="ulb-subtitle mb-0">Septic Tank Management</p>
      </div>

      {/* Right Section: Logout */}
      <div>
        <button className="btn logout-btn">
          <LogOut />
        </button>
      </div>
    </nav>
  );
};

export default NavbarCitizen;
