const express = require("express");
const router = express.Router();
const {
  getZoneList,
  getOwnerTypeList,
  getTankTypeList,
  getServiceTypeList,
  getWardListByZone,
  getTankRequestByRequestNo,
  getTankRequestByMobile,
  getApplicationTracking,
  insertOrUpdateTankRequest,
  CorporationDropdown
} = require("../../../controllers/SepticTank/CitizenRegistration/FrmCitizienRegistration");

// Each is POST API
router.post("/getZoneList", getZoneList);
router.post("/getOwnerTypeList", getOwnerTypeList);
router.post("/getTankTypeList", getTankTypeList);
router.post("/getServiceTypeList", getServiceTypeList);
router.post("/getWardListByZone", getWardListByZone);
router.post("/getTankRequestByRequestNo", getTankRequestByRequestNo);
router.post("/getTankRequestByMobile", getTankRequestByMobile);
router.post("/getApplicationTracking", getApplicationTracking);
router.post("/TankRegistrtaion", insertOrUpdateTankRequest);
router.get('/CorporationDropdown', CorporationDropdown);


module.exports = router;
