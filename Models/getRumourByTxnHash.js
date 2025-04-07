const { pool } = require("./database.js");

async function getRumourByTxnHash(txnHash) {
  try {
    const query = `SELECT * FROM rumours WHERE transactionHash = ? LIMIT 1`;
    const [rows] = await pool.query(query, [txnHash]);

    if (rows.length === 0) {
      return { error: true, message: "No entry found for this transaction hash" };
    }

    console.log("Fetched Rumour:", rows[0]);
    return { error: false, rumour: rows[0] };
  } catch (error) {
    console.error("Error fetching rumour:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getRumourByTxnHash };
