require("dotenv").config();
const { pool } = require("./database.js");

function generateRandomString(length = 64) {
  const chars = "abcdef0123456789"; // mimic hex characters
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const parseJSON = (input) => {
  console.log("\n🔍 Raw input:", input);

  // Already an array
  if (Array.isArray(input)) {
    console.log("✅ Already array");
    return input;
  }

  // Might be an object or undefined/null
  if (!input || typeof input !== "string") {
    console.warn("⚠️ Not a string or is null");
    return [];
  }

  try {
    // Try parsing raw (if valid JSON)
    return JSON.parse(input);
  } catch (_) {
    try {
      // Normalize single quotes → double quotes
      const normalized = input
        .replace(/\\'/g, "'") // unescape
        .replace(/(^|[,\[])\s*'/g, '$1"')
        .replace(/'\s*([,\]])/g, '"$1');

      console.log("🛠️ Normalized input:", normalized);

      const parsed = JSON.parse(normalized);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("❌ Final parsing failed:", input);
      return [];
    }
  }
};

const migrateVotes = async () => {
  try {
    const [rows] = await pool.query(`
          SELECT transactionHash, upvotes, downvotes
          FROM rumours
        `);

    for (const row of rows) {
      const rumourHash = row.transactionHash;

      const upvotes = parseJSON(row.upvotes);
      const downvotes = parseJSON(row.downvotes);

      for (const userAddress of upvotes) {
        const transactionHash = generateRandomString();
        try {
          // Check if the userAddress already has a vote
          const [existingUpvote] = await pool.query(
            `SELECT 1 FROM RumoursMeta WHERE rumourHash = ? AND userAddress = ? AND type = 1 LIMIT 1`,
            [rumourHash, userAddress]
          );

          if (existingUpvote.length > 0) {
            console.warn(`⚠️ Upvote already exists for ${userAddress}`);
            continue; // Skip if the user has already upvoted
          }

          await pool.query(
            `INSERT INTO RumoursMeta (rumourHash, transactionHash, type, userAddress)
                 VALUES (?, ?, ?, ?)`,
            [rumourHash, transactionHash, 1, userAddress]
          );
          console.log(`✅ Inserted upvote: ${userAddress}`);
        } catch (err) {
          console.error("❌ Error inserting upvote:", err.message);
          throw err; // rethrow unexpected errors
        }
      }

      for (const userAddress of downvotes) {
        const transactionHash = generateRandomString();
        try {
          // Check if the userAddress already has a downvote
          const [existingDownvote] = await pool.query(
            `SELECT 1 FROM RumoursMeta WHERE rumourHash = ? AND userAddress = ? AND type = 0 LIMIT 1`,
            [rumourHash, userAddress]
          );

          if (existingDownvote.length > 0) {
            console.warn(`⚠️ Downvote already exists for ${userAddress}`);
            continue; // Skip if the user has already downvoted
          }

          await pool.query(
            `INSERT INTO RumoursMeta (rumourHash, transactionHash, type, userAddress)
                 VALUES (?, ?, ?, ?)`,
            [rumourHash, transactionHash, 0, userAddress]
          );
          console.log(`✅ Inserted downvote: ${userAddress}`);
        } catch (err) {
          console.error("❌ Error inserting downvote:", err.message);
          throw err;
        }
      }
    }

    console.log("✅ Migration complete: RumoursMeta is now populated.");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    pool.end(); // Close connection pool
  }
};

// migrateVotes();
