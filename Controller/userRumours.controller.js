const { getRumoursByOwner } = require("../Models/getRumoursByOwner.js");
const { getAndStoreRumours } = require("../jobs/getAndStoreRumours.js");

const userRumours = async (req, res) => {
  try {
    // await getAndStoreRumours();

    const { walletAddress } = req.params;
    if (!walletAddress) {
      return res.status(400).json({ message: "walletAddress is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);

    const result = await getRumoursByOwner(walletAddress, page, limit);

    if (result.error) {
      return res
        .status(500)
        .json({ message: result.message || "Failed to fetch rumours" });
    }

    res.status(200).json({
      message: "Rumours by owner",
      data: result.rumours,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        count: result.rumours.length,
        paginated: true,
      },
    });
  } catch (error) {
    console.error("❌ userRumours error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { userRumours };
