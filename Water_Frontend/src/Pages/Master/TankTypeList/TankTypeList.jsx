import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HeaderLabel from "../../../Components/HeaderLabel/HeaderLabel";
import Table from "../../../Components/Table/Table";
import SaveButton from "../../../Components/Buttons_save/Savebutton";
import { useLanguage } from "../../../Context/LanguageProvider";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { Pencil } from "lucide-react";

function TankTypeList() {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tankTypeList, setTankTypeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = ["Name", "Flag", "Actions"];
  const keyMapping = {
    Name: "TYPENAME",
    Flag: "FLAG",
    Actions: "actions",
  };

  const customRenderers = {
    Flag: (row) => (
      <span
        className={`badge px-3 py-2 fw-semibold rounded-pill ${
          row.FLAG === "Active" ? "bg-success" : "bg-danger"
        }`}
      >
        {row.FLAG === "Active" ? translate("Active") : translate("Inactive")}
      </span>
    ),

    Actions: (row) => (
      <button
        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: "32px",
          height: "32px",
          padding: 0,
          borderWidth: "1.5px",
        }}
        title={translate("Edit")}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("✏️ Navigating to edit mode with:", row);
          navigate("/Masters/TankTypeMst", {
            state: { tankTypeData: row },
          });
        }}
      >
        <Pencil size={16} />
      </button>
    ),
  };

  const fetchTankTypeList = async () => {
    try {
      setLoading(true);
      const payload = { orgId: parseInt(user?.ulbId || 890) };
      console.log("📤 Request Payload:", payload);

      const response = await apiService.post("GettanktypeListDtls", payload);
      console.log("✅ API Response:", response);

      let list = [];

      if (Array.isArray(response?.data?.data)) list = response.data.data;
      else if (Array.isArray(response?.data)) list = response.data;
      else if (response?.data?.Table) list = response.data.Table;

      setTankTypeList(list);
    } catch (error) {
      console.error("❌ Error fetching tank types:", error);
      setTankTypeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTankTypeList();
  }, [user?.ulbId, location.state?.refresh]);

  return (
    <div className="main-wrapper">
      <div className="container mt-4">
        <div className="card shadow-sm rounded-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <HeaderLabel text={translate("Tank Types")} />
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-1"
              onClick={() => navigate("/Masters/TankTypeMst")}
            >
              {translate("Add New")}
            </button>
          </div>

          <div className="table-responsive">
            {loading ? (
              <p className="text-center my-3">⏳ Loading Tank Types...</p>
            ) : tankTypeList.length > 0 ? (
              <Table
                headers={headers}
                data={tankTypeList}
                keyMapping={keyMapping}
                customRenderers={customRenderers}
                noDataMessage={translate("No tank types found.")}
              />
            ) : (
              <p className="text-center my-3 text-muted">
                ⚠️ {translate("No data available.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TankTypeList;
