import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./HOC/ProtectedRoute";
import Login from "./HOC/Login/Login";
import Dashboard from "./Pages/DashBoard/DashBord";
import TransactionPage from "./Pages/Transactions/TransactionPage";
import useDynamicFavicon from "./Hooks/useDynamicFavicon";
import "bootstrap/dist/css/bootstrap.min.css";

// Masters 
import TankTypeList from "./Pages/Master/TankTypeList/TankTypeList";
import TankTypeMst from "./Pages/Master/TankTypeMst/TankTypeMst";
import FrmOwnerTypeList from "./Pages/Master/FrmOwnerTypeList/FrmOwnerTypeList";
import FrmOwnerTypeMst from "./Pages/Master/FrmOwnerTypeMst/FrmOwnerTypeMst";
import FrmContractorList from "./Pages/Master/FrmContractorList/FrmContractorList";
import FrmContractorMst from "./Pages/Master/FrmContractorMst/FrmContractorMst";
import FrmStaffList from "./Pages/Master/FrmStaffList/FrmStaffList";
import FrmStaffMst from "./Pages/Master/FrmStaffMst/FrmStaffMst";
import FrmRateConfigMst from "./Pages/Master/FrmRateConfigMst/FrmRateConfigMst";
import FrmRateConfigList from "./Pages/Master/FrmRateConfigList/FrmRateConfigList";

// Config 
import FrmTankTypeConfig from "./Pages/Configuration/FrmTankTypeConfig/FrmTankTypeConfig";
import FrmOwnershipConfig from "./Pages/Configuration/FrmOwnershipConfig/FrmOwnershipConfig";
import FrmContractorConfig from "./Pages/Configuration/FrmContractorConfig/FrmContractorConfig";
import FrmStaffConfig from "./Pages/Configuration/FrmStaffConfig/FrmStaffConfig";

// Transactions
import FrmAssignInspectionList from "./Pages/Transactions/FrmAssignInspectionList/FrmAssignInspectionList";
import FrmAssignInspection from "./Pages/Transactions/FrmAssignInspection/FrmAssignInspection";
import FrmJobAssignList from "./Pages/Transactions/FrmJobAssignList/FrmJobAssignList";
import FrmInspectionEntyList from "./Pages/Transactions/FrmInspectionEntyList/FrmInspectionEntyList";
import FrmInspectionEntryMst from "./Pages/Transactions/FrmInspectionEntryMst/FrmInspectionEntryMst";
import FrmBillGen from "./Pages/Transactions/FrmBillGen/FrmBillGen";
import Layout from "./Pages/Layout/layout";
import FrmInspectionEntry from "./Pages/Transactions/FrmInspectionEntry/FrmInspectionEntry";
import FrmAssignInspectionCombined from "./Pages/Transactions/FrmAssignInspectionCombined/FrmAssignInspectionCombined";
import FrmCleaningExecution from "./Pages/Transactions/FrmCleaningExecution/FrmCleaningExecution";
import FrmJobAssignMst from "./Pages/Transactions/FrmJobAssignMst/FrmJobAssignMst";
import FrmRecieptGen from "./Pages/Transactions/FrmRecieptGen/FrmRecieptGen";


//Citizen Login
import CitizenLogin from "./HOC/CitizenLogin/CitizenLogin";
import FrmCitizenDashboard from "./Pages/CitizenLogin/FrmCitizenDashboard/FrmCitizenDashboard";
import FrmTrackApplication from "./Pages/CitizenLogin/CitizenTrackApplication/CitizenTrackApplication";
import CitizenPrintApplication from "./Pages/CitizenLogin/CitizenPrintApplication/CitizenPrintApplication";
import CitizenTankRegistraction from "./Pages/CitizenLogin/CitizenTankRegistraction/CitizenTankRegistraction";
import CitizenApplicationUpdates from "./Pages/CitizenLogin/CitizenApplicationUpdates/CitizenApplicationUpdates";






function App() {
  useDynamicFavicon();

  // ✅ Define protected routes under /
  const protectedRoutes = [
    { path: "Dashboard", element: <Dashboard /> },

    // ✅ Master
    { path: "Masters/TankTypeList", element: <TankTypeList /> },
    { path: "Masters/TankTypeMst", element: <TankTypeMst /> },
    { path: "Masters/FrmOwnerTypeList", element: <FrmOwnerTypeList /> },
    { path: "Masters/FrmOwnerTypeMst", element: <FrmOwnerTypeMst /> },
    { path: "Masters/FrmContractorList", element: <FrmContractorList /> },
    { path: "Masters/FrmContractorMst", element: <FrmContractorMst /> },
    { path: "Masters/FrmStaffList", element: <FrmStaffList /> },
    { path: "Masters/FrmStaffMst", element: <FrmStaffMst /> },
    { path: "Masters/FrmRateConfigMst", element: <FrmRateConfigMst /> },
    { path: "Masters/FrmRateConfigList", element: <FrmRateConfigList /> },

    // ✅ Configuration
    { path: "Masters/FrmTankTypeConfig", element: <FrmTankTypeConfig /> },
    { path: "Masters/FrmOwnershipConfig", element: <FrmOwnershipConfig /> },
    { path: "Masters/FrmContractorConfig", element: <FrmContractorConfig /> },
    { path: "Masters/FrmStaffConfig", element: <FrmStaffConfig /> },

    // ✅ Transactions
    { path: "Transaction/FrmAssignInspectionList/:id?", element: <TransactionPage /> },
    { path: "Transaction/FrmAssignInspectionCombined", element: <FrmAssignInspectionCombined /> },
    { path: "Transaction/FrmJobAssignList", element: <FrmJobAssignList /> },
    { path: "Transaction/FrmInspectionEntry", element: <FrmInspectionEntry /> },
    { path: "Transaction/FrmCleaningExecution", element: <FrmCleaningExecution /> },
    { path: "Transaction/FrmBillGen", element: <FrmBillGen /> },
    { path: "Transaction/FrmReceiptCollection", element: <FrmRecieptGen /> },
    { path: "Transaction/FrmJobAssignMst", element: <FrmJobAssignMst /> },


    ///Not using routes
    { path: "Transaction/FrmAssignInspectionList", element: <FrmAssignInspectionList /> },
    { path: "Transaction/FrmAssignInspection", element: <FrmAssignInspection /> },
    { path: "Transaction/FrmInspectionEntyList", element: <FrmInspectionEntyList /> },
    { path: "Transaction/FrmInspectionEntryMst", element: <FrmInspectionEntryMst /> },
  ];

  return (
    <Router>
      <Routes>
        {/* ✅ Redirect root to /login if not logged in */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Route>

         {/* Catch-all: redirect unknown paths */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
         <Route path="/CitizenLogin" element={<CitizenLogin />} />
         <Route path="/FrmCitizenDashboard" element={<FrmCitizenDashboard />} />
         <Route path="/CitizenTankRegistraction" element={<CitizenTankRegistraction />} /> 
         <Route path="/CitizenTrackApplication" element={<FrmTrackApplication />} /> 
         <Route path="/CitizenPrintApplication" element={<CitizenPrintApplication />} /> 
         <Route path="/CitizenApplicationUpdates" element={<CitizenApplicationUpdates />} /> 
      </Routes>
    </Router>
  );
}

export default App;

