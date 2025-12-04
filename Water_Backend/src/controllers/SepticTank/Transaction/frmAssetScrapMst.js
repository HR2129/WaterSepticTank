const express = require("express");
const router = express.Router();
const {
  getAssetInsurance,
  insertAssetScrap,
} = require("../../../controllers/Asset/Transaction/frmAssetScrapMst");

router.post("/getAssetInsurance", getAssetInsurance);
router.post("/insertAssetScrap", insertAssetScrap);

module.exports = router;
