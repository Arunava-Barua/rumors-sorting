/*message Upvotes {
    string rumourHash = 1;
    string address = 2;
  }
*/
const { updateVotesByTxnHash } = require("../Models/updateVotesByTxnHash.js");
const { getRumourByTxnHash } = require("../Models/getRumourByTxnHash.js");

const updateVotes = async (voteType, voteObject) => {
  try {
    const { rumourHash, address } = voteObject;

    // 1. Fetch current vote data by rumourHash
    const existingVote = await getRumourByTxnHash(rumourHash);

    if (!existingVote.rumour) {
      throw new Error("Rumour not found");
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
