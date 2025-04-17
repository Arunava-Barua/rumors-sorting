// ***********/api/rumours**********************

const express = require("express");
const router = express.Router();

const {
  getApiRumours,
  getLatestRumours,
  getSortedRumours,
  getRumourDetailsByHash,
  userRumours
} = require("../Controller/index.js");

router.get("/api-rumours", getApiRumours); // DEPRECATED - Comment not remove
router.get("/latest", getLatestRumours); // DEPRECATED - Comment not remove
router.get("/trending", getSortedRumours);
router.get("/:txnHash", getRumourDetailsByHash);
router.get("/owner/:walletAddress", userRumours);

module.exports = { rumoursRoute: router };
