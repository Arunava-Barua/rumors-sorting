const { pool } = require("./database.js");

async function getRumourByTxnHash(txnHash, page = 1, limit = 25) {
  try {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 25, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const detailQuery = `
      SELECT 
        rd.rumourHash,
        rd.post,
        rd.owner,
        rd.upvotes,
        rd.downvotes,
        m.timestamp
      FROM RumoursDetails rd
      JOIN Meta m ON rd.rumourHash = m.rumourHash
      WHERE rd.rumourHash = ?
      ORDER BY m.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const [details] = await pool.query(detailQuery, [txnHash, safeLimit, offset]);

    if (details.length === 0) {
      return { error: true, message: "No entries found for this transaction hash" };
    }

    const rumour = details[0]; // since LIMIT 1, take first result

    // Query for upvoters
    const [upvoteRows] = await pool.query(
      `SELECT userAddress FROM RumoursMeta WHERE rumourHash = ? AND type = 1`,
      [txnHash]
    );

    const [downvoteRows] = await pool.query(
      `SELECT userAddress FROM RumoursMeta WHERE rumourHash = ? AND type = 0`,
      [txnHash]
    );

    const upvoteWallets = upvoteRows.map((row) => row.userAddress);
    const downvoteWallets = downvoteRows.map((row) => row.userAddress);

    console.log(`Fetched rumour: ${txnHash} with ${upvoteWallets.length} upvotes and ${downvoteWallets.length} downvotes`);

    return {
      error: false,
      rumour: {
        ...rumour,
        upvoteWallets,
        downvoteWallets,
      },
      pagination: { page: safePage, limit: safeLimit },
    };
  } catch (error) {
    console.error("Error fetching rumour by txnHash:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getRumourByTxnHash };
