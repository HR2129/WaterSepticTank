const express = require("express");
const router = express.Router();
const {
  getActiveReasons,
  insertAssetReturn,getDamagedAssetInsurance,
} = require("../../../controllers/Asset/Transaction/FrmAssetReturn");

router.post("/getActiveReasons", getActiveReasons);
router.post("/getDamagedAssetInsurance", getDamagedAssetInsurance);

router.post("/insertAssetReturn", insertAssetReturn);

module.exports = router;
