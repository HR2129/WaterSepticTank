const express = require("express");
const router = express.Router();

const {PayModeDropdown, BankNameDropdown, GetBillDetailsByBillNoBG,GetBillDetailsByBillNoRC, GetTankDetailsByRequestId
    ,GetTankReceiptByRecNo, GetPayCodeByPayMode, TankReceiptInsert
} = require("../../../controllers/SepticTank/Transaction/FrmReceiptCollection")

router.post("/PayModeDropdown", PayModeDropdown);
router.post("/BankNameDropdown", BankNameDropdown);
router.post("/GetBillDetailsByBillNoBG", GetBillDetailsByBillNoBG);
router.post("/GetBillDetailsByBillNoRC", GetBillDetailsByBillNoRC);
router.post("/GetTankDetailsByRequestId", GetTankDetailsByRequestId);
router.post("/GetTankReceiptByRecNo", GetTankReceiptByRecNo);
router.post("/GetPayCodeByPayMode", GetPayCodeByPayMode);
router.post("/TankReceiptInsert", TankReceiptInsert);

module.exports = router;