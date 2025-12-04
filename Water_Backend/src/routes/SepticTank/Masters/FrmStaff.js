const express = require("express");
const router = express.Router();

const {
  GetStaffListDtls,
  InsertStaff,
} = require("../../../controllers/SepticTank/Masters/FrmStaff");

// ✅ Get all staff (POST)
router.post("/GetStaffListDtls", GetStaffListDtls);

// ✅ Insert / Update / Delete staff
router.post("/InsertStaff", InsertStaff);

module.exports = router;