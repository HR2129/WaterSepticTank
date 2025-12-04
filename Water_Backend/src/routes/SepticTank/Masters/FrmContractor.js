const express = require("express");
const router = express.Router();

const {
  GetContractorListDtls,
  InsertContractor,
  GetContractorById
} = require("../../../controllers/SepticTank/Masters/FrmContractor");

// ✅ Get Contractor List (POST)
router.post("/GetContractorListDtls", GetContractorListDtls);

// ✅ Insert / Update Contractor (POST)
router.post("/InsertContractor", InsertContractor);

router.post("/GetContractorById", GetContractorById);

module.exports = router;
