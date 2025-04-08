const { startWebsocketMonitoring } = require("../Services/pushWebsocketMonitoring.js");

const runWebsocketMonitoring = async (req, res) => {
  try {
    await startWebsocketMonitoring();
    res.status(200).json({ message: "Websocket started with monitoring" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { runWebsocketMonitoring };