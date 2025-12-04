const express = require("express");
const router = express.Router();

const { GetContractorListDtls, GetContractorConfigDtls, InsertContractorConfig } = require("../../../controllers/SepticTank/Config/FrmContractorConfig");

// ✅ Contractor Config Routes
router.post("/GetContractorListDtls", GetContractorListDtls);

router.post("/GetContractorConfigDtls", GetContractorConfigDtls);

router.post("/InsertContractorConfig", InsertContractorConfig);

module.exports = router;
