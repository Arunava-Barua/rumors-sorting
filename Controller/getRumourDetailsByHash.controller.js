const { getRumourByTxnHash } = require("../Models/getRumourByTxnHash.js");

const getRumourDetailsByHash = async (req, res) => {
  try {
    const { txnHash } = req.params;

    if (!txnHash) {
      return res.status(400).json({ message: "txnHash is required" });
    }

    // Parse pagination with default fallbacks
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 25, 1), 100);

    const rumourDetails = await getRumourByTxnHash(txnHash, page, limit);

    if (rumourDetails.error) {
      return res.status(404).json({ message: rumourDetails.message });
    }

    res.status(200).json({
      message: "Rumour details fetched successfully",
      data: rumourDetails.rumour,
      meta: {
        page: rumourDetails.pagination.page,
        limit: rumourDetails.pagination.limit,
        count: 1,
        paginated: true,
      },
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getRumourDetailsByHash };
