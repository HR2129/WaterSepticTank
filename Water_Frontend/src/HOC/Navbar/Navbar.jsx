import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import config from "../../utils/config";
import { User, Menu } from "lucide-react";
import LogOut from "../../Components/LogOutButton/LogOut";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [logoUrl, setLogoUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const ulbId = localStorage.getItem("ulbId");

  // Fetch ULB Logo
  const fetchLogo = useCallback(async () => {
    if (!ulbId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/textlogo/${ulbId}`);
      if (res.data.success) {
        setLogoUrl(res.data.data.ULBLOGO);
      }
    } catch (err) {
      console.error("❌ Logo fetch error:", err);
    }
  }, [ulbId, API_BASE_URL]);

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  return (
    <nav className="w-full bg-white shadow-sm border-b fixed top-0 left-0 z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-2 sm:h-20">

        {/* ------- TOP ROW: MOBILE ONLY ------- */}
        <div className="flex w-full sm:hidden justify-between items-center">

          {/* Hamburger (mobile only) */}
          <button
            className="p-2"
            onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          >
            <Menu className="text-gray-800" size={30} strokeWidth={2.4} />
          </button>

          {/* ULB Logo */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="ULB Logo"
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="text-gray-400 text-sm">Loading...</div>
          )}

          {/* User Icon */}
          <div className="relative">
            <div
              className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <User size={20} />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow p-2 w-28 z-50">
                <LogOut />
              </div>
            )}
          </div>

        </div>

            <div className="max-sm:hidden ml-16">
              {logoUrl ? (
            <img
              src={logoUrl}
              alt="ULB Logo"
              className="h-16 w-24 object-contain"
            />
          ) : (
            <div className="text-gray-400 text-sm">Loading...</div>
          )}
            </div>
        {/* ------- CENTER LOGO ALWAYS CENTER ------- */}
        <div className="w-full flex  justify-center mt-2 sm:mt-0">
          <img
            src="/MasterPageLogo.png"
            alt="Nagar Logo"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </div>

        {/* ------- RIGHT SIDE USER INFO (Always visible) ------- */}
        <div className="flex items-center gap-3 mt-2 sm:mt-0 sm:mr-4">

          {/* USER INFO */}
          <div className="flex flex-col text-xs text-right leading-tight">
            <div>
              <span className="font-semibold text-gray-900">
                Welcome : {user?.username || "N/A"}
              </span>
            </div>

            <div>
              Coll. Center :{" "}
              <span className="text-blue-600 font-medium">
                {user?.prabhagName || "N/A"}
              </span>
            </div>

            <div>
              Last Login :{" "}
              <span className="text-blue-600">{user?.lastLogin}</span>
            </div>
          </div>

          {/* USER ICON (Laptop Only) */}
          <div className="relative hidden sm:block">
            <div
              className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <User size={20} />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow p-2 w-28 z-50">
                <LogOut />
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
