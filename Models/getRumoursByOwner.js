const { pool } = require("./database.js");

async function getRumoursByOwner(ownerAddress) {
  try {
    const query = `SELECT * FROM rumours WHERE owner = ? ORDER BY timestamp DESC`;
    const [rows] = await pool.query(query, [ownerAddress]);

    if (rows.length === 0) {
      return { error: false, rumours: [], message: "No rumours found for this owner" };
    }

    console.log(`Fetched ${rows.length} rumours for owner: ${ownerAddress}`);
    return { error: false, rumours: rows };
  } catch (error) {
    console.error("Error fetching rumours by owner:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getRumoursByOwner };
