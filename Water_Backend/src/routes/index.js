const express = require("express");
const router = express.Router();

const authRoutes = require("./Admin/authRoutes");
router.use("/", authRoutes);

const logoroutes = require("./Admin/logoroutes");
router.use("/", logoroutes);

const logoutRoutes = require("./Admin/logoutRoutes.js");
router.use("/", logoutRoutes);

const menurouted = require("./Admin/menuRoutes.js");
router.use("/", menurouted);



const septikTank = require("./SepticTank/HomePage/septic-dashboard.js");
router.use("/", septikTank);

// transaction
const uploadAssetMultiDocuments = require("./SepticTank/Transaction/uploadAssetMultiDocument.js");
router.use("/", uploadAssetMultiDocuments);

const ImageTransfer = require("./SepticTank/Transaction/updateTransferDoc.js");
router.use("/", ImageTransfer);

const ScrapDoc = require("./SepticTank/Transaction/updateScrapDoc.js");
router.use("/", ScrapDoc);

const DamageDoc = require("./SepticTank/Transaction/updateDamageDoc.js");
router.use("/", DamageDoc);

const aoam_assetTransfer_ins = require("./SepticTank/Transaction/updateTransferDoc.js");
router.use("/", aoam_assetTransfer_ins);

//Masters

const TankType = require("./SepticTank/Masters/FrmTankType.js");
router.use("/", TankType);

const OwnerShipType = require("./SepticTank/Masters/FrmOwnerShipType.js");
router.use("/", OwnerShipType);

const Contractor = require("./SepticTank/Masters/FrmContractor.js");
router.use("/", Contractor);

const Staff = require("./SepticTank/Masters/FrmStaff.js");
router.use("/", Staff);

const RateConfig = require("./SepticTank/Masters/FrmRateConfig.js");
router.use("/", RateConfig);

//Configuration
const FrmTankTypeConfig = require("./SepticTank/Config/FrmTankTypeConfig.js");
router.use("/", FrmTankTypeConfig);

const FrmContractorConfig = require("./SepticTank/Config/FrmContractorConfig.js");
router.use("/", FrmContractorConfig);

const FrmStaffConfig = require("./SepticTank/Config/FrmStaffConfig.js");
router.use("/", FrmStaffConfig);

//Transaction

const AssignInspection = require("./SepticTank/Transaction/FrmAssignInspection.js");
router.use("/", AssignInspection);

const FrmJobAssign = require("./SepticTank/Transaction/FrmJobAssign.js");
router.use("/", FrmJobAssign);

const FrmCleaningExecution = require("./SepticTank/Transaction/FrmCleaningExecution.js");
router.use("/", FrmCleaningExecution);

const FrmBillGen = require("./SepticTank/Transaction/FrmBillGen.js");
router.use("/", FrmBillGen);

const FrmReceiptCollection = require("./SepticTank/Transaction/FrmReceiptCollection.js");
router.use("/", FrmReceiptCollection);

// citizen 
const Citizenlogin = require("./Admin/Citizenlogin.js");
router.use("/", Citizenlogin);

const CitizienRegistration= require("./SepticTank/CitizienRegistration/FrmCitizienRegistration.js");
router.use("/",CitizienRegistration)

module.exports = router;
