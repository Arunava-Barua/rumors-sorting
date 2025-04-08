const { getRumoursByOwner } = require("../Models/getRumoursByOwner.js");
const { getAndStoreRumours } = require("../jobs/getAndStoreRumours.js");

const userRumours = async (req, res) => {
  try {
    await getAndStoreRumours();

    const { walletAddress } = req.params;
    const response = await getRumoursByOwner(walletAddress);
    const data = response.rumours || [];

    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);

    // If no pagination params are given, return full data
    if (!pageNumber || !pageSize) {
      return res.status(200).json({
        message: "Rumours by owner (no pagination)",
        data,
        meta: {
          total: data.length,
          paginated: false,
        },
      });
    }

    // Pagination logic
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const paginatedData = data.slice(startIndex, endIndex);

    res.status(200).json({
      message: "Rumours by owner (paginated)",
      data: paginatedData,
      meta: {
        total,
        pageNumber,
        pageSize,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userRumours };
