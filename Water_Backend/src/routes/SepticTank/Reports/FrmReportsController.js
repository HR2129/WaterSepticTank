const express = require("express");
const router = express.Router();
const {  getAssetTransferReport,
  getAssetDepreciationReport,
  getAssetInsuranceReport,
  getAssetScrapReport,
  getAssetMasterReport,
  getAssetMaintenanceReport,
  getAssetTrackerReport,
  getAssetCategoryReport,
  getSelectedAssetTypeReport} = require("../../../controllers/Asset/Reports/FrmReportsController"); // adjust path if needed

// 1) Asset Transfer Report
router.post("/AssetTransferReport", getAssetTransferReport);

// 2) Asset Depreciation Report
router.post("/AssetDepreciationReport", getAssetDepreciationReport);

// 3) Asset Insurance Report
router.post("/AssetInsuranceReport", getAssetInsuranceReport);

// 4) Asset Scrap Report
router.post("/AssetScrapReport", getAssetScrapReport);

// 5) Asset Master Report
router.post("/AssetMasterReport", getAssetMasterReport);

// 6) Asset Maintenance Report
router.post("/AssetMaintenanceReport", getAssetMaintenanceReport);

// 7) Asset Tracker Report
router.post("/AssetTrackerReport", getAssetTrackerReport);

// 8) Asset Category Report
router.post("/AssetCategoryReport", getAssetCategoryReport);

// 9) Selected Asset Type Report
router.post("/SelectedAssetTypeReport", getSelectedAssetTypeReport);

module.exports = router;
