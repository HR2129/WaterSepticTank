const express = require("express");
const {
   fetchCorporationDetails,
  getAssetTotalValues,
  getAssetMovable,
  getAssetInsurance,
  getAssetDeptDetails,
  getAssetPoliciesNearExpiry,
  getAssetValuationMonthwise,
} = require("../../controllers/Admin/logocontroller.js");

const router = express.Router();

router.get("/textlogo/:ulbid", fetchCorporationDetails);

// Dashboard data endpoints
router.get("/assettotalvalues", getAssetTotalValues);
router.get("/assetmovable", getAssetMovable);
router.get("/assetinsurance", getAssetInsurance);
router.get("/assetdeptdetails", getAssetDeptDetails);
router.get("/assetpoliciesnearexpiry", getAssetPoliciesNearExpiry);
router.get("/assetvaluationmonthwise", getAssetValuationMonthwise);

module.exports = router;

module.exports = router;
