const { pool } = require("./database.js");

async function getAllRumours() {
  try {
    const query = `SELECT * FROM rumours ORDER BY timestamp DESC`; // optional: order by most recent
    const [rows] = await pool.query(query);

    console.log(`Fetched ${rows.length} rumours`);
    return { error: false, rumours: rows };
  } catch (error) {
    console.error("Error fetching all rumours:", error.message);
    return { error: true, message: error.message };
  }
}

module.exports = { getAllRumours };
