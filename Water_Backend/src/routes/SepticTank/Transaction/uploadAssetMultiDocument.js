const express = require("express");
const router = express.Router();
const {uploadAssetMultiDocuments,insertAsset} = require("../../../controllers/SepticTank/Transaction/uploadAssetMultiDocument");

// POST route for inserting asset documents
router.post("/InsertAssetDoc", uploadAssetMultiDocuments);
router.post("/InsertAssetCreation", insertAsset);

module.exports = router;
