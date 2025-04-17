const { pool } = require("./database.js");

async function getRumoursByOwner(ownerAddress, page = 1, limit = 25) {
  try {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 25, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const query = `
      SELECT 
        rd.rumourHash,
        rd.post,
        rd.owner,
        rd.upvotes,
        rd.downvotes,
        m.timestamp
      FROM RumoursDetails rd
      JOIN Meta m ON rd.rumourHash = m.rumourHash
      WHERE rd.owner = ?
      ORDER BY m.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [ownerAddress, safeLimit, offset]);

    if (rows.length === 0) {
      return {
        error: false,
        rumours: [],
        pagination: { page: safePage, limit: safeLimit },
        message: "No rumours found for this owner",
      };
    }

    console.log(`Fetched ${rows.length} rumours for owner: ${ownerAddress}`);
    return {
      error: false,
      rumours: rows,
      pagination: { page: safePage, limit: safeLimit },
    };
  } catch (error) {
    console.error("Error fetching rumours by owner:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getRumoursByOwner };
