const { pool } = require("../Models/database.js");
const { updateVotesByTxnHash } = require("../Models/updateVotesByTxnHash.js");
const { getRumourByTxnHash } = require("../Models/getRumourByTxnHash.js");
const { addSingleRumour } = require("../Models/addSingleRumour.js");
const { Confession } = require("../Schema/schema.js");

const updateVotes = async (voteType, voteObject, voteHash, pushChain) => {
  try {
    const { rumourHash, address } = voteObject;

    // Step 1: Fetch or add rumour
    let existing = await getRumourByTxnHash(rumourHash);

    if (!existing.rumour) {
      const txDetails = await pushChain.tx.get(rumourHash);
      if (txDetails.blocks?.length > 0) {
        const fetchedTx = txDetails.blocks[0].transactions[0];
        const dataBytes = new Uint8Array(Buffer.from(fetchedTx.data, "hex"));
        const decodedData = Confession.decode(dataBytes);
        const confessionObject = Confession.toObject(decodedData, {
          longs: String,
          enums: String,
          bytes: String,
        });
        await addSingleRumour({ ...confessionObject, txnHash: rumourHash });
      }
      existing = await getRumourByTxnHash(rumourHash);
    }

    if (existing.error || !existing.rumour) {
      throw new Error("Rumour not found after fetching");
    }

    const upvotes = existing.rumour.upvoteWallets.length;
    const downvotes = existing.rumour.downvoteWallets.length;

    // Step 2: Check if vote already exists
    const [existingVoteRows] = await pool.query(
      `SELECT type FROM RumoursMeta WHERE rumourHash = ? AND userAddress = ?`,
      [rumourHash, address]
    );

    // Case 1: Already voted same type
    if (existingVoteRows.length && existingVoteRows[0].type === voteType) {
      throw new Error("You have already voted the same");
    }

    let newUpvotes = upvotes;
    let newDownvotes = downvotes;

    if (existingVoteRows.length) {
      // Case 2: Opposite vote exists → update type
      await pool.query(
        `UPDATE RumoursMeta SET type = ?, transactionHash = ? WHERE rumourHash = ? AND userAddress = ?`,
        [voteType, voteHash, rumourHash, address]
      );

      if (voteType === 1) {
        newUpvotes += 1;
        newDownvotes -= 1;
      } else {
        newDownvotes += 1;
        newUpvotes -= 1;
      }
    } else {
      // Case 3: No vote exists → insert
      await pool.query(
        `INSERT INTO RumoursMeta (rumourHash, transactionHash, type, userAddress)
         VALUES (?, ?, ?, ?)`,
        [rumourHash, voteHash, voteType, address]
      );

      if (voteType === 1) newUpvotes += 1;
      else newDownvotes += 1;
    }

    // Step 3: Update aggregate in RumoursDetails
    await updateVotesByTxnHash(rumourHash, newUpvotes, newDownvotes, voteHash);

    console.log("✅ Vote updated successfully");
  } catch (error) {
    console.error("❌ Error updating votes:", error.message);
    throw error;
  }
};

module.exports = { updateVotes };
