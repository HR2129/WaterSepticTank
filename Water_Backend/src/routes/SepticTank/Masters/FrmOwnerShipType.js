const express = require("express");
const router = express.Router();
const { GetOwnershiptypeListDtls, InsertOwnershipType, GetOwnershiptypeById } = require("../../../controllers/SepticTank/Masters/FrmOwnerShipType");

// ✅ Get All Ownership Types (POST)
router.post("/GetOwnershiptypeListDtls", GetOwnershiptypeListDtls);
router.post("/InsertOwnershipType", InsertOwnershipType);
router.post("/GetOwnershiptypeById", GetOwnershiptypeById);

module.exports = router;
