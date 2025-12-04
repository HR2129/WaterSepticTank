const express = require("express");
const router = express.Router();
const {
  getTankRequestList,
  getStaffList,
  getTankConditionList,
  getAccessDifficultyList,
  getTankRequestDetailsById,
  assignInspection,
  tnkInspectionIns
} = require("../../../controllers/SepticTank/Transaction/FrmAssignInspection");

router.post("/GetTankRequests", getTankRequestList);
router.post("/GetStaffList", getStaffList);
router.post("/GetTankConditionList", getTankConditionList);
router.post("/GetAccessDifficultyList", getAccessDifficultyList);
router.post("/GetRequestDetails", getTankRequestDetailsById);
router.post("/AssignInspection", assignInspection);
router.post("/tnkInspectionIns", tnkInspectionIns);

module.exports = router;
