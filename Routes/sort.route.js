// ***********/api/sort**********************

const express = require("express");
const router = express.Router();

const {
  getApiRumours,
  getLatestRumours,
  getSortedRumours,
  getRumourDetailsByHash,
} = require("../Controller/index.js");

router.get("/api-rumours", getApiRumours);
router.get("/latest", getLatestRumours);
router.get("/", getSortedRumours);
router.get("/:txnHash", getRumourDetailsByHash);

module.exports = { sortRoute: router };
