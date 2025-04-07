const { startWebsocket } = require("../Services/pushWebsocket.js");

const runWebsocket = async (req, res) => {
  try {
    console.log("Websocket starting...");
    await startWebsocket();
    res.status(200).json({ message: "Websocket started" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { runWebsocket };
