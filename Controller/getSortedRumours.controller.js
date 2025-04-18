const {
  getSortedRumoursFromDB,
} = require("../Models/getSortedRumoursFromDB.js");
const {
  getSortedRumoursV2,
} = require("../Models/getSortedRumoursV2.js");
const { getAndStoreRumours } = require("../jobs/getAndStoreRumours.js");

const getSortedRumours = async (req, res) => {
  try {
    // await getAndStoreRumours();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);

    // const result = await getSortedRumoursFromDB(page, limit);
    const result = await getSortedRumoursV2(page, limit);

    if (result.error) {
      return res.status(500).json({ message: result.message });
    }

    res.status(200).json({
      message: "Sorted rumours from DB (paginated)",
      data: result.rumours,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        count: result.pagination.count,
        paginated: true,
      },
    });
  } catch (error) {
    console.error("❌ Controller error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSortedRumours };
