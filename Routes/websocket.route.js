// ***********/api/my-rumours**********************

const express = require("express");
const router = express.Router();

const {
  runWebsocket,
  runWebsocketMonitoring,
} = require("../Controller/index.js");

router.get("/", runWebsocket);
router.get("/monitoring", runWebsocketMonitoring);

module.exports = { websocketRoute: router };
