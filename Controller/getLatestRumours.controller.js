const { getAllRumours } = require("../Models/getAllRumours.js");
const { getAndStoreRumours } = require("../jobs/getAndStoreRumours.js");

const getLatestRumours = async (req, res) => {
  try {
    await getAndStoreRumours(); // Ensure the latest rumours are fetched and stored
    
    const response = await getAllRumours();
    const data = response.rumours || [];

    // Sort by latest timestamp (descending)
    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);

    // If no pagination params are given, return full data
    if (!pageNumber || !pageSize) {
      return res.status(200).json({
        message: "Rumours sorted by latest (no pagination)",
        data: sortedData,
        meta: {
          total: sortedData.length,
          paginated: false
        }
      });
    }

    // Pagination logic
    const total = sortedData.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const paginatedData = sortedData.slice(startIndex, endIndex);

    res.status(200).json({
      message: "Rumours sorted by latest (paginated)",
      data: paginatedData,
      meta: {
        total,
        pageNumber,
        pageSize,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLatestRumours };
