const express = require("express");
const router = express.Router();
const { prabhagDropdown, tankRequestByNoBG,tankRequestByNoC, ZoneDropdown, distanceRate, wasteRate, tankRequestFullDetails, TankBillInsert } = require("../../../controllers/SepticTank/Transaction/FrmBillGen");

router.post("/prabhagDropdown", prabhagDropdown);
router.post("/tankRequestByNoBG", tankRequestByNoBG);
router.post("/tankRequestByNoC", tankRequestByNoC);
router.post("/ZoneDropdown", ZoneDropdown);
router.post("/distanceRate", distanceRate);
router.post("/wasteRate", wasteRate);
router.post("/tankRequestFullDetails", tankRequestFullDetails);
router.post("/TankBillInsert", TankBillInsert);



module.exports = router;
