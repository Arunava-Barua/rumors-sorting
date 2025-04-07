// ***********/api/my-rumours**********************

const express = require("express");
const router = express.Router();

const { userRumours } = require("../Controller/userRumours.controller.js");

router.get("/:walletAddress", userRumours);

module.exports = { ownerRumourRoute: router };
