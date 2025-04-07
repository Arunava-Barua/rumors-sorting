const { getConfessions } = require("../Services/getConfessions.js");

const { addRumours } = require("../Models/addRumours.js");

// 30 req per min - Read
// 10txn per min - Write
const getApiRumours = async (req, res) => {
  try {
    let page = 1;
    let allConfessions = [];
    let confessions;

    do {
      confessions = await getConfessions(page);
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

    allConfessions.sort(
      (a, b) => b.upvoteWallets.length - a.upvoteWallets.length
    );

    res.status(200).json({
      message: "SORT RUMOR",
      data: allConfessions,
      length: allConfessions.length,
      top5: allConfessions.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getApiRumours };
