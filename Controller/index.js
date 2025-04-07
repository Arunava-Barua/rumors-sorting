const { getApiRumours } = require("./getApiRumours.controller.js");
const { runWebsocket } = require("./runWebsocket.controller.js");
const { userRumours } = require("./userRumours.controller.js");
const { getLatestRumours } = require("./getLatestRumours.controller.js");
const { getSortedRumours } = require("./getSortedRumours.controller.js");

module.exports = { getApiRumours, runWebsocket, userRumours, getLatestRumours, getSortedRumours };
