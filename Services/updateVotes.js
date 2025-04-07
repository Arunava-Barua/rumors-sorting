/*message Upvotes {
    string rumourHash = 1;
    string address = 2;
  }
*/
const { updateVotesByTxnHash } = require("../Models/updateVotesByTxnHash.js");
const { getRumourByTxnHash } = require("../Models/getRumourByTxnHash.js");
const { addSingleRumour } = require("../Models/addSingleRumour.js");

const { Confession } = require("../Schema/schema.js");

const updateVotes = async (voteType, voteObject, pushChain) => {
  try {
    const { rumourHash, address } = voteObject;

    // 1. Fetch current vote data by rumourHash
    let existingVote = await getRumourByTxnHash(rumourHash);

    if (!existingVote.rumour) {
      const txDetails = await pushChain.tx.get(rumourHash);

      if (txDetails.blocks && txDetails.blocks.length > 0) {
        const fetchedTx = txDetails.blocks[0].transactions[0];
        // Log the transaction data from the fetched transaction details
        const dataBytes = new Uint8Array(Buffer.from(fetchedTx.data, "hex"));
        const decodedData = Confession.decode(dataBytes);

        // Convert to plain object
        const confessionObject = Confession.toObject(decodedData, {
          longs: String,
          enums: String,
          bytes: String,
        });

        await addSingleRumour({ ...confessionObject, txnHash: tx.hash });
      }

      existingVote = await getRumourByTxnHash(rumourHash);
    }

    let upVotes = existingVote.rumour.upvotes || [];
    let downVotes = existingVote.rumour.downvotes || [];

    // 2. Handle UPVOTE
    if (voteType === 1) {
      if (upVotes.includes(address)) {
        throw new Error("Already upvoted");
      }

      // Remove from downVotes if present
      downVotes = downVotes.filter((addr) => addr !== address);
      upVotes.push(address);
    }

    // 3. Handle DOWNVOTE
    else if (voteType === 0) {
      if (downVotes.includes(address)) {
        throw new Error("Already downvoted");
      }

      // Remove from upVotes if present
      upVotes = upVotes.filter((addr) => addr !== address);
      downVotes.push(address);
    } else {
      throw new Error("Invalid vote type");
    }

    // 4. Update votes
    await updateVotesByTxnHash(rumourHash, upVotes, downVotes);
    console.log("Votes updated successfully");
  } catch (error) {
    console.error("Error updating votes:", error);
  }
};

module.exports = { updateVotes };
