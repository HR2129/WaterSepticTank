const express = require("express");
const router = express.Router();

const { GetStaffListDtls, GetStaffConfigDtls, InsertStaffConfig , GetStaffById} = require("../../../controllers/SepticTank/Config/FrmStaffConfig");

// ✅ Staff Config Routes
router.post("/GetStaffListDtls", GetStaffListDtls);
router.post("/GetStaffConfigDtls", GetStaffConfigDtls);
router.post("/InsertStaffConfig", InsertStaffConfig);
router.post("/GetStaffById", GetStaffById);
module.exports = router;
