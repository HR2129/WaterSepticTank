const express = require("express");
const router = express.Router();
const {
  getAssetInsuranceDetails,
  getAssetPaymentDetails,
  insertAssetInsurance
} = require("../../../controllers/Asset/Transaction/frmAsstInsuranceClaim");

// POST request
router.post("/getAssetInsuranceDetails", getAssetInsuranceDetails);
router.post("/getAssetPaymentDetails", getAssetPaymentDetails);
router.post("/insertAssetInsurance", insertAssetInsurance);

module.exports = router;
