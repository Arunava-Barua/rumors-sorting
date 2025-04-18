const { pool } = require("./database.js");

async function getSortedRumoursV2(page = 1, limit = 25) {
  try {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 25, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const query = `
      SELECT 
        rd.rumourHash,
        rd.post,
        rd.owner,
        m.timestamp
      FROM RumoursDetails rd
      JOIN Meta m ON rd.rumourHash = m.rumourHash
      ORDER BY rd.upvotes DESC, rd.downvotes ASC, m.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [safeLimit, offset]);

    // Enhance each row with wallet arrays
    const enrichedRumours = await Promise.all(
      rows.map(async (rumour) => {
        const [upvoteRows] = await pool.query(
          `SELECT userAddress FROM RumoursMeta WHERE rumourHash = ? AND type = 1`,
          [rumour.rumourHash]
        );
        const [downvoteRows] = await pool.query(
          `SELECT userAddress FROM RumoursMeta WHERE rumourHash = ? AND type = 0`,
          [rumour.rumourHash]
        );

        return {
          ...rumour,
          upvotes: upvoteRows.map((row) => row.userAddress),
          downvotes: downvoteRows.map((row) => row.userAddress),
        };
      })
    );

    return {
      error: false,
      rumours: enrichedRumours,
      pagination: {
        page: safePage,
        limit: safeLimit,
        count: enrichedRumours.length,
      },
    };
  } catch (error) {
    console.error("❌ DB Error (getSortedRumoursV2):", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getSortedRumoursV2 };
