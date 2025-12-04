import React, { createContext, useContext, useState } from "react";

const RateConfigContext = createContext();

export const MasterDataProvider = ({ children }) => {
  // 🧾 Existing RateConfig state (keep as-is)
  const [selectedRate, setSelectedRate] = useState(null);

  // 🧠 Additional shared states for other master modules
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // ✅ Generic "clear all" helper
  const clearAllSelected = () => {
    setSelectedRate(null);
    setSelectedStaff(null);
    setSelectedContractor(null);
    setSelectedVehicle(null);
  };

  return (
    <RateConfigContext.Provider
      value={{
        // 🟢 Rate Module
        selectedRate,
        setSelectedRate,

        // 🟢 Staff Module
        selectedStaff,
        setSelectedStaff,

        // 🟢 Contractor Module
        selectedContractor,
        setSelectedContractor,

        // 🟢 Vehicle Module
        selectedVehicle,
        setSelectedVehicle,

        // 🧹 Utility
        clearAllSelected,
      }}
    >
      {children}
    </RateConfigContext.Provider>
  );
};

export const useMasterData = () => useContext(RateConfigContext);
