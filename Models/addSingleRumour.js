const { pool } = require("./database.js");

// Example usage
const exampleRumour = {
  post: "🚀 Breaking Web3 News!",
  address: "eip155:1:0x123456789abcdef123456789abcdef123456789a",
  isVisible: true,
  timestamp: "1743684904664",
  markdownPost: "🚀 Breaking Web3 News!",
  txnHash: "a92b5db194b1799817dd9f5e464d461043af67fd5f105d639b796a52ebc3476a",
  upvoteWallets: ["wallet1", "wallet2"],
  downvoteWallets: ["wallet3"],
};

async function addSingleRumour(rumour) {
  try {
    const {
      txnHash,
      upvoteWallets,
      downvoteWallets,
      timestamp,
      post,
      address,
    } = rumour;

    const formattedTimestamp = new Date(parseInt(timestamp))
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Convert upvotes and downvotes to JSON strings
    const upvotes = JSON.stringify(upvoteWallets || []);
    const downvotes = JSON.stringify(downvoteWallets || []);

    const query = `
            INSERT INTO rumours (transactionHash, upvotes, downvotes, timestamp, post, owner)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

    const [result] = await pool.query(query, [
      txnHash,
      upvotes, // Now a valid JSON string
      downvotes, // Now a valid JSON string
      formattedTimestamp,
      post,
      address, // Storing the address in the "owner" column
    ]);

    console.log(`Successfully inserted 1 row with txnHash: ${txnHash}`);
    return { error: false, inserted: result.affectedRows };
  } catch (error) {
    if (error.message.includes("Duplicate entry")) {
      console.warn(`Skipping duplicate entry for txnHash: ${rumour.txnHash}`);
      return { error: true, message: "Duplicate entry" };
    } else {
      console.error("Error performing insert:", error.message);
      return { error: true, message: error.message };
    }
  }
}

module.exports = { addSingleRumour };
