const express = require("express");
const router = express.Router();
const { callPropertyOtpProcedure } = require("../../controllers/Admin/Citizenlogin");

router.post("/PropertyOtp", callPropertyOtpProcedure);

module.exports = router;
