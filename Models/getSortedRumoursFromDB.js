const { pool } = require("./database.js");

async function getSortedRumoursFromDB(page = 1, limit = 25) {
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
      ORDER BY rd.upvotes DESC, rd.downvotes ASC, m.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [safeLimit, offset]);

    return {
      error: false,
      rumours: rows,
      pagination: {
        page: safePage,
        limit: safeLimit,
        count: rows.length,
      },
    };
  } catch (error) {
    console.error("❌ DB Error (getSortedRumoursFromDB):", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getSortedRumoursFromDB };
