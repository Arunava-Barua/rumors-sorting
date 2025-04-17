const { pool } = require("./database.js");

async function addRumours(rumours) {
  try {
    let insertedCount = 0;

    for (const obj of rumours) {
      const {
        txnHash,
        upvoteWallets = [],
        downvoteWallets = [],
        timestamp,
        post,
        address,
      } = obj;

      const rumourHash = txnHash;

      if (!txnHash || !timestamp || !post || !address) {
        console.warn("⚠️ Skipping incomplete entry");
        continue;
      }

      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Insert into Meta
        const metaQuery = `
          INSERT INTO Meta (rumourHash, timestamp)
          VALUES (?, ?)
        `;
        await connection.query(metaQuery, [rumourHash, timestamp]);

        // Insert into RumoursDetails
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

        // Insert upvotes into RumoursMeta
        const metaInsertQuery = `
          INSERT INTO RumoursMeta (rumourHash, transactionHash, type, userAddress)
          VALUES (?, ?, ?, ?)
        `;
        for (const user of upvoteWallets) {
          await connection.query(metaInsertQuery, [rumourHash, txnHash, 1, user]);
        }

        // Insert downvotes into RumoursMeta
        for (const user of downvoteWallets) {
          await connection.query(metaInsertQuery, [rumourHash, txnHash, 0, user]);
        }

        await connection.commit();
        connection.release();

        console.log(`✅ Inserted rumour: ${txnHash}`);
        insertedCount++;
      } catch (error) {
        await connection.rollback();
        connection.release();

        if (error.code === "ER_DUP_ENTRY") {
          console.warn(`⚠️ Duplicate entry for txnHash: ${txnHash}`);
          continue;
        }

        console.error(`❌ Error inserting txnHash: ${txnHash}`, error.message);
        continue;
      }
    }

    console.log(`✅ Successfully inserted ${insertedCount} rumour(s)`);
    return { error: false, insertedCount };
  } catch (error) {
    console.error("❌ Error performing inserts:", error.message);
    return { error: true, error };
  }
}

module.exports = { addRumours };
