const express = require("express");
const router = express.Router();

const {
  getTankTypeListDtls,
  getTankTypeConfigList,
  InsertTankTypeConfig
} = require("../../../controllers/SepticTank/Config/FrmTankTypeConfig");

// ✅ Get tank type master list
router.post("/GetTankTypeListDtls", getTankTypeListDtls);

// ✅ Get config list by ULB
router.post("/GetTankTypeConfigList", getTankTypeConfigList);

// ✅ Insert / Update / Delete config
router.post("/InsertTankTypeConfig", InsertTankTypeConfig);

module.exports = router;