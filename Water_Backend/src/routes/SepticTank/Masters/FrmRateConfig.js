const express = require("express");
const router = express.Router();

const { GetRateListDtls, InsertRateConfig, CorporationDropdown, GetRateById } = require("../../../controllers/SepticTank/Masters/FrmRateConfig");

// Get all rate configuration details
router.post("/GetRateListDtls", GetRateListDtls);

// Insert / Update / Delete rate configuration
router.post("/InsertRateConfig", InsertRateConfig);

router.post("/CorporationDropdown", CorporationDropdown);

router.post("/GetRateById", GetRateById);

module.exports = router;
