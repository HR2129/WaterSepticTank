const express = require("express");
const router = express.Router();
const { getActiveDamage ,insertAssetDamage} = require("../../../controllers/Asset/Transaction/FrmAssetWHouseDamage");


router.post("/getActiveDamage", getActiveDamage);
router.post("/InsertAssetDamage", insertAssetDamage);

module.exports = router;
