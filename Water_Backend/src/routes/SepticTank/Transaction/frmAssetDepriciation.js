const express = require("express");
const router = express.Router();
const {
 insertAssetDepreciation, getAllDepartments, getAssetList,
} = require("../../../controllers/Asset/Transaction/frmAssetDepriciation");


router.post("/insertAssetDepreciation", insertAssetDepreciation);
router.post("/getAllDepartments", getAllDepartments);
router.post("/getAssetList", getAssetList);

module.exports = router;
