const express = require("express");
const router = express.Router();

const {StaffDropdown, VehicleDropdown, GetTankRequestDtlsNew,TankJobInsert } = require("../../../controllers/SepticTank/Transaction/FrmJobAssign");


router.post("/StaffDropdown", StaffDropdown);
router.post("/VehicleDropdown", VehicleDropdown);
router.post("/GetTankRequestDtlsNew", GetTankRequestDtlsNew);
router.post("/TankJobInsert", TankJobInsert);


module.exports = router;