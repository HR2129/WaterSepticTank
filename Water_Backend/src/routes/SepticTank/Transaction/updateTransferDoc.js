const express = require("express");
const router = express.Router();
const {updateTransferDoc, aoam_assetTransfer_ins} = require("../../../controllers/SepticTank/Transaction/updateTransferDoc");

// POST endpoint to update transfer document
router.post("/updateTransferDoc", updateTransferDoc);
router.post("/assetTransferIns", aoam_assetTransfer_ins);

module.exports = router;
