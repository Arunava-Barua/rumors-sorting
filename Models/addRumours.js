const { pool } = require("./database.js");

async function addRumours(rumours) {
  try {
    let insertedCount = 0;

    for (const obj of rumours) {
      const {
        txnHash,
        upvoteWallets,
        downvoteWallets,
        timestamp,
        post,
        address,
      } = obj;
      const formattedTimestamp = new Date(parseInt(timestamp))
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Convert upvotes and downvotes to JSON strings
      const upvotes = JSON.stringify(upvoteWallets);
      const downvotes = JSON.stringify(downvoteWallets);

      const query = `
              INSERT INTO rumours (transactionHash, upvotes, downvotes, timestamp, post, owner)
              VALUES (?, ?, ?, ?, ?, ?)
            `;

      try {
        const [result] = await pool.query(query, [
          txnHash,
          upvotes, // Now a valid JSON string
          downvotes, // Now a valid JSON string
          formattedTimestamp,
          post,
          address, // Storing the address in the "owner" column
        ]);
        insertedCount += result.affectedRows;
      } catch (error) {
        if (error.message.includes("Duplicate entry")) {
          console.warn(`Skipping duplicate entry for txnHash: ${txnHash}`);
          continue; // Skip this iteration and move to the next
        } else {
          throw error; // Throw other SQL errors
        }
      }
    }

    console.log(`Successfully inserted ${insertedCount} rows`);
    return { error: false, insertedCount };
  } catch (error) {
    console.error("Error performing inserts:", error.message);
    return { error: true, error };
  }
}

module.exports = { addRumours };
