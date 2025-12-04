const express = require("express");
const router = express.Router();
const updateScrapDoc = require("../../../controllers/SepticTank/Transaction/updateScrapDoc");

// POST endpoint to update scrap document
router.post("/updateScrapDoc", updateScrapDoc);

module.exports = router;
 