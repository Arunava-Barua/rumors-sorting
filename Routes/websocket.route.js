// ***********/api/my-rumours**********************

const express = require("express");
const router = express.Router();

const { runWebsocket } = require("../Controller/runWebsocket.controller.js");

router.get("/", runWebsocket);

module.exports = { websocketRoute: router };