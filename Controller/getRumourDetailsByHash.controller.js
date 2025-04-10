const { getRumourByTxnHash } = require("../Models/getRumourByTxnHash.js");

const getRumourDetailsByHash = async (req, res) => {
  try {
    const { txnHash } = req.params;

    if (!txnHash) {
      return res.status(400).json({ message: "txnHash is required" });
    }

    const rumourDetails = await getRumourByTxnHash(txnHash);

    if (!rumourDetails) {
      return res.status(404).json({ message: "Rumour not found" });
    }

    res.status(200).json({ message: "Rumour details", data: rumourDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRumourDetailsByHash };
