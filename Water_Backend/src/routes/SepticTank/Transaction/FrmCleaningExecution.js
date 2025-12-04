const express = require("express");
const router = express.Router();

const { WasteTypeDropdown, tnkCleaningInsert,updateSepticTankImage, upload } = require("../../../controllers/SepticTank/Transaction/FrmCleaningExecution");

// router.post("/WasteTypeDropdown", WasteTypeDropdown);
// router.post("/tnkCleaningInsert", tnkCleaningInsert);
// router.post("/updateSepticTankImage", upload.single("imageFile"), updateSepticTankImage);

router.post("/WasteTypeDropdown", WasteTypeDropdown);
router.post("/tnkCleaningInsert", tnkCleaningInsert);
router.post("/updateSepticTankImage", upload.single("imageFile"), updateSepticTankImage);


module.exports = router;
