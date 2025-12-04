const express = require("express");
const router = express.Router();
const {getStageDetails,getContractorDetails,totalTankRegister,todaysRequest,pendingCount,pendingInspection,jobsCompletedToday
    ,getTodayRevenue
} = require("../../../controllers/SepticTank/HomePage/septic-dashboard.js");

router.post("/getStageDetails", getStageDetails);
router.post("/totalTankRegister", totalTankRegister);
router.post("/todaysRequest", todaysRequest);
router.post("/pendingCount", pendingCount);
router.post("/pendingInspection", pendingInspection);
router.post("/jobsCompletedToday", jobsCompletedToday);
router.post('/todayrevenue', getTodayRevenue);
router.post('/getContractorDetails', getContractorDetails);


module.exports = router;
