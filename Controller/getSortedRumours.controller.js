const { getAllRumours } = require("../Models/getAllRumours.js");

const getSortedRumours = async (req, res) => {
  try {
    const { rumours } = await getAllRumours();

    const sortedRumours = rumours.sort((a, b) => {
      const upvotesA = a.upvotes?.length || 0;
      const upvotesB = b.upvotes?.length || 0;
      const downvotesA = a.downvotes?.length || 0;
      const downvotesB = b.downvotes?.length || 0;
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();

      if (upvotesB !== upvotesA) {
        return upvotesB - upvotesA; // Descending by upvotes
      } else if (downvotesA !== downvotesB) {
        return downvotesA - downvotesB; // Ascending by downvotes
      } else {
        return timeB - timeA; // Descending by timestamp
      }
    });

    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);

    // If no pagination params are given, return full data
    if (!pageNumber || !pageSize) {
      return res.status(200).json({
        message:
          "Rumours sorted by upvotes, downvotes, and timestamp (no pagination)",
        data: sortedRumours,
        meta: {
          total: sortedRumours.length,
          paginated: false,
        },
      });
    }

    // Pagination logic
    const total = sortedRumours.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const paginatedData = sortedRumours.slice(startIndex, endIndex);

    res.status(200).json({
      message:
        "Rumours sorted by upvotes, downvotes, and timestamp (paginated)",
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

module.exports = { getSortedRumours };
