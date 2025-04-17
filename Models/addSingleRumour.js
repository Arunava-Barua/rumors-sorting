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
  const {
    txnHash,
    upvoteWallets = [],
    downvoteWallets = [],
    timestamp,
    post,
    address,
  } = rumour;

  const rumourHash = txnHash;

  // Skip if any required field is missing
  if (!txnHash || !timestamp || !post || !address) {
    console.warn(`Skipping incomplete entry`);
    return { error: false, inserted: 0 };
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Meta table insert
    const metaQuery = `
        INSERT INTO Meta (rumourHash, timestamp)
        VALUES (?, ?)
      `;
    await connection.query(metaQuery, [rumourHash, timestamp]);

    // 2. RumoursDetails insert
    const detailsQuery = `
        INSERT INTO RumoursDetails (rumourHash, post, owner, upvotes, downvotes)
        VALUES (?, ?, ?, ?, ?)
      `;
    await connection.query(detailsQuery, [
      rumourHash,
      post,
      address,
      upvoteWallets.length,
      downvoteWallets.length,
    ]);

    // 3. Upvotes into RumoursMeta
    const metaInsertQuery = `
        INSERT INTO RumoursMeta (rumourHash, transactionHash, type, userAddress)
        VALUES (?, ?, ?, ?)
      `;

    for (const wallet of upvoteWallets) {
      await connection.query(metaInsertQuery, [rumourHash, txnHash, 1, wallet]);
    }

    // 4. Downvotes into RumoursMeta
    for (const wallet of downvoteWallets) {
      await connection.query(metaInsertQuery, [rumourHash, txnHash, 0, wallet]);
    }

    await connection.commit();
    connection.release();

    console.log(`✅ Inserted rumour: ${txnHash}`);
    return { error: false, inserted: 1 };
  } catch (error) {
    await connection.rollback();
    connection.release();

    if (error.code === "ER_DUP_ENTRY") {
      console.warn(`⚠️ Duplicate entry skipped for txnHash: ${txnHash}`);
      return { error: true, message: "Duplicate entry" };
    }

    console.error("❌ Insert failed:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { addSingleRumour };
