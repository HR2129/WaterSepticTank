const express = require("express");
const router = express.Router();
const {
  getAssetInfo,
  insertAssetMaintenance,
} = require("../../../controllers/Asset/Transaction/frmAssetMaintenance");

//Both GET & POST supported

router.post("/getAssetInfo", getAssetInfo);
router.post("/insertAssetMaintenance", insertAssetMaintenance);

module.exports = router;
