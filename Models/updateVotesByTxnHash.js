const { pool } = require("./database.js");

async function updateVotesByTxnHash(txnHash, upvoteWallets, downvoteWallets) {
  try {
    const query = `
      UPDATE rumours
      SET upvotes = ?, downvotes = ?
      WHERE transactionHash = ?
    `;

    const upvotesJSON = JSON.stringify(upvoteWallets);
    const downvotesJSON = JSON.stringify(downvoteWallets);

    const [result] = await pool.query(query, [
      upvotesJSON,
      downvotesJSON,
      txnHash,
    ]);

    if (result.affectedRows === 0) {
      return {
        error: true,
        message: "No entry found with this transaction hash",
      };
    }

    console.log(`Updated votes for txnHash: ${txnHash}`);
    return { error: false, message: "Votes updated successfully" };
  } catch (error) {
    console.error("Error updating votes:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { updateVotesByTxnHash };
