const { PushChain } = require("@pushchain/devnet");
const { Confession, Upvotes, Downvotes } = require("../Schema/schema.js");
const { addSingleRumour } = require("../Models/addSingleRumour.js");
const { updateVotes } = require("./updateVotes.js");

const { parseTxData } = require("../utils/parseTxData.js");

let pushChain;
let subscriptionId = null;

const customFilters = [
  {
    type: "CATEGORY",
    value: ["CUSTOM:RUMORS", "RUMORS:UPVOTES", "RUMORS:DOWNVOTES"],
  },
];

const handleTx = async (tx) => {
  const category = tx.category;
  const logPrefix = category.includes("UPVOTES")
    ? "🟢"
    : category.includes("DOWNVOTES")
    ? "🔴"
    : "🔵";

  console.log(
    `${logPrefix} Found transaction with hash ${tx.hash} and category ${category}`
  );

  try {
    const txDetails = await pushChain.tx.get(tx.hash);
    const fetchedTx = txDetails?.blocks?.[0]?.transactions?.[0];
    if (!fetchedTx) return console.warn(`No details found for tx ${tx.hash}`);

    if (category === "CUSTOM:RUMORS") {
      try {
        const dataBytes = new Uint8Array(Buffer.from(fetchedTx.data, "hex"));
        const decoded = Confession.decode(dataBytes);
        const object = Confession.toObject(decoded, {
          longs: String,
          enums: String,
          bytes: String,
        });
        await addSingleRumour({ ...object, txnHash: tx.hash });
      } catch (error) {
        return;
      }
    } else if (category === "RUMORS:UPVOTES") {
      const object = parseTxData(fetchedTx.data);
      await updateVotes(1, object, tx.hash, pushChain);
    } else if (category === "RUMORS:DOWNVOTES") {
      const object = parseTxData(fetchedTx.data);
      await updateVotes(0, object, tx.hash, pushChain);
    }
  } catch (error) {
    console.error("Error handling transaction:", error);
  }
};

const subscribeToBlocks = async () => {
  if (!pushChain.ws.isConnected()) {
    console.log("WebSocket not connected, trying to reconnect...");
    await pushChain.ws.connect();
  }

  console.log("Subscribing to filtered transactions...");

  // Unsubscribe if already subscribed
  if (subscriptionId) {
    try {
      await pushChain.ws.unsubscribe(subscriptionId);
      console.log("Previous subscription cleared.");
    } catch (e) {
      console.warn("Failed to unsubscribe previous:", e.message);
    }
  }

  // Subscribe and store subscriptionId
  subscriptionId = await pushChain.ws.subscribe(async (block) => {
    for (const tx of block.transactions) {
      console.log(tx);
      await handleTx(tx);
    }
  }, customFilters);
};

const monitorConnection = () => {
  setInterval(async () => {
    if (!pushChain.ws.isConnected()) {
      console.warn("WebSocket disconnected. Reconnecting...");
      try {
        await pushChain.ws.disconnect();
        await subscribeToBlocks();
        console.log("Reconnected.");
      } catch (err) {
        console.error("Reconnection failed:", err.message);
      }
    }
  }, 10000); // check every 10 seconds
};

const startWebsocketMonitoring = async () => {
  console.log("Initializing PushChain...");
  pushChain = await PushChain.initialize(null, {
    rpcUrl: process.env.SEPOLIA_RPC,
    printTraces: true,
  });

  await subscribeToBlocks();
  monitorConnection(); // start the reconnection monitor
};

module.exports = { startWebsocketMonitoring };
