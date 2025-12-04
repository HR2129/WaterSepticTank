const express = require("express");
const router = express.Router();
const updateAssetDamageDoc = require("../../../controllers/SepticTank/Transaction/updateDamageDoc");

// POST endpoint to update asset damage document
router.post("/updateDamageDoc", updateAssetDamageDoc);

module.exports = router;
