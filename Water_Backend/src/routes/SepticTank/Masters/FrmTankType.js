const express = require("express");
const router = express.Router();

const {
  getTankTypeListDtls, InsertTankType, getTankTypeById
} = require("../../../controllers/SepticTank/Masters/FrmTankType");

// ✅ Get all tank types (POST)
router.post("/GettanktypeListDtls", getTankTypeListDtls);

router.post("/InsertTankType", InsertTankType);

router.post("/getTankTypeById", getTankTypeById)

module.exports = router;