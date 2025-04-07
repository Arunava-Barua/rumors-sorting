const { pool } = require("../Models/database");
const { addRumours } = require("../Models/addRumours.js");

const { getConfessions } = require("../Services/getConfessions.js");

const getLastRumourTimestamp = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT timestamp FROM rumours ORDER BY timestamp DESC LIMIT 1"
    );

    if (rows.length > 0) {
      return new Date(rows[0].timestamp).getTime();
    } else {
      return new Date.now().getTime();
    }
  } catch (error) {
    console.error("Error fetching last rumour timestamp:", error);
    throw error;
  }
};

const getAndStoreRumours = async () => {
  try {
    const startTime = await getLastRumourTimestamp();

    let page = 1;
    let allConfessions = [];
    let confessions;

    do {
      confessions = await getConfessions(page, 30, startTime);
      allConfessions = allConfessions.concat(confessions);
      page++;

      console.log("Adding rumours to DB");
      await addRumours(allConfessions);
      console.log("Added rumours to DB");
      allConfessions = [];

      console.log("Starting the wait🟢");
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
      console.log("Wait Ended🔴");
    } while (confessions.length > 0);
  } catch (error) {
    console.error("Error in getAndStoreRumours:", error);
  }
};

module.exports = { getAndStoreRumours };
