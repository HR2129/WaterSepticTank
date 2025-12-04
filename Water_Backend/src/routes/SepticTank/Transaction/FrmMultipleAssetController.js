const express = require("express");
const router = express.Router();
const { getDepartments,
  getAssetTypesConfig,
  getAllAssetTypes,
  getAssetUnits,
  getAcquisitions,
  getAssetSubTypesConfig,
  getAssetSubTypesByType,
insertMultipleAssets} = require("../../../controllers/Asset/Transaction/FrmMultipleAssetController");

router.post("/GetDepartments", getDepartments);
router.post("/GetAssettypesConfig", getAssetTypesConfig);
router.post("/GetAllAssetTypes", getAllAssetTypes);
router.post("/GetAssetUnits", getAssetUnits);
router.post("/GetAcquisitions", getAcquisitions);
router.post("/GetAssetSubtypesConfig", getAssetSubTypesConfig);
router.post("/GetAssetSubtypesByType", getAssetSubTypesByType);
router.post("/InsertMultipleAssets", insertMultipleAssets);


module.exports = router;
