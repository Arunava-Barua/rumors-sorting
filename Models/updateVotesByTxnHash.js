const { pool } = require("./database.js");

async function updateVotesByTxnHash(rumourHash, upvoteCount, downvoteCount, voteHash) {
  try {
    const query = `
      UPDATE RumoursDetails
      SET upvotes = ?, downvotes = ?
      WHERE rumourHash = ?
    `;

    const [result] = await pool.query(query, [
      upvoteCount,
      downvoteCount,
      rumourHash,
    ]);

    if (result.affectedRows === 0) {
      return {
        error: true,
        message: "No entry found with this rumourHash",
      };
    }

    console.log(`🔄 Updated vote counts for: ${rumourHash}`);
    return { error: false, message: "Votes updated" };
  } catch (error) {
    console.error("❌ Failed to update vote counts:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { updateVotesByTxnHash };
