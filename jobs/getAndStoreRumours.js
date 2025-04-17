const { pool } = require("../Models/database");
const { addRumours } = require("../Models/addRumours.js");

const { getConfessions } = require("../Services/getConfessions.js");

// 1744360669162
// 1744360698000
// 1744360669162
// 1744360669162

const getLastRumourTimestamp = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT timestamp FROM rumours ORDER BY timestamp DESC LIMIT 1"
    );

    if (rows.length > 0) {
      return rows[0].timestamp;
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
    let startTime = await getLastRumourTimestamp();
    console.log("Start Time: ", startTime);

    const pageSize = 10;
    let page = 1;

    let allConfessions = [];
    let confessions;

    while (true) {
      const currentTimestamp = Date.now();
      console.log("Current Timestamp: ", currentTimestamp);

      if (startTime >= currentTimestamp) {
        console.log("Reached up-to-date timestamp. Stopping the loop ⏹️");
        break;
      }

      confessions = await getConfessions(
        page,
        pageSize,
        startTime,
        (order = "ASC")
      );

      if (confessions.length === 0) {
        console.log("No new confessions found.");
        break;
      }

      allConfessions = allConfessions.concat(confessions);

      console.log("Adding rumours to DB");
      await addRumours(allConfessions);
      console.log("Added rumours to DB");

      // Update startTime with the latest timestamp
      startTime = await getLastRumourTimestamp();

      allConfessions = [];
      page++;

      if (confessions.length < pageSize) {
        console.log("Confessions less than pageSize.");
        break;
      }

      console.log("Starting the wait🟢");
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
      console.log("Wait Ended🔴");
    }
  } catch (error) {
    console.error("Error in getAndStoreRumours:", error);
  }
};

module.exports = { getAndStoreRumours };
