const { PushChain } = require("@pushchain/devnet");

const { Confession, Upvotes, Downvotes } = require("../Schema/schema.js");

const { addSingleRumour } = require("../Models/addSingleRumour.js");
const { updateVotes } = require("./updateVotes.js");

const startWebsocket = async () => {
  console.log("Starting websocket...");
  const pushChain = await PushChain.initialize(null, {
    rpcUrl: `${process.env.SEPOLIA_RPC}`,
    printTraces: true,
  });
  console.log("User alice init...");

  // Connect to the WebSocket server
  await pushChain.ws.connect();
  console.log("WebSocket connected.");

  // Define a custom filter to only subscribe to blocks that include transactions with the category 'CUSTOM:RUMORS'
  const customFilters = [
    {
      type: "CATEGORY",
      value: ["CUSTOM:RUMORS", "RUMORS:UPVOTES", "RUMORS:DOWNVOTES"],
    },
  ];

  // Subscribe to block updates using the custom filter
  await pushChain.ws.subscribe(async (block) => {
    // Iterate over each transaction in the block
    for (const tx of block.transactions) {
      // Check when a new rumour has been posted
      if (tx.category === "CUSTOM:RUMORS") {
        console.log(
          `🔵Found transaction with hash ${tx.hash} and category ${tx.category}`
        );

        try {
          // Fetch the full transaction details using the transaction hash
          const txDetails = await pushChain.tx.get(tx.hash);

          // Assume the fetched result contains a list of blocks and each block contains an array of transactions
          if (txDetails.blocks && txDetails.blocks.length > 0) {
            const fetchedTx = txDetails.blocks[0].transactions[0];
            // Log the transaction data from the fetched transaction details
            const dataBytes = new Uint8Array(
              Buffer.from(fetchedTx.data, "hex")
            );
            const decodedData = Confession.decode(dataBytes);

            // Convert to plain object
            const confessionObject = Confession.toObject(decodedData, {
              longs: String,
              enums: String,
              bytes: String,
            });

            await addSingleRumour({ ...confessionObject, txnHash: tx.hash });
          } else {
            console.warn(`No details found for transaction hash ${tx.hash}`);
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error);
        }
      }
      // RUMORS:UPVOTES
      if (tx.category === "RUMORS:UPVOTES") {
        console.log(
          `🟢Found transaction with hash ${tx.hash} and category ${tx.category}`
        );
        try {
          // Fetch the full transaction details using the transaction hash
          const txDetails = await pushChain.tx.get(tx.hash);

          // Assume the fetched result contains a list of blocks and each block contains an array of transactions
          if (txDetails.blocks && txDetails.blocks.length > 0) {
            const fetchedTx = txDetails.blocks[0].transactions[0];
            // Log the transaction data from the fetched transaction details
            const dataBytes = new Uint8Array(
              Buffer.from(fetchedTx.data, "hex")
            );
            const decodedData = Upvotes.decode(dataBytes);

            // Convert to plain object
            const upvoteObject = Upvotes.toObject(decodedData, {
              longs: String,
              enums: String,
              bytes: String,
            });

            await updateVotes(1, upvoteObject, pushChain);
          } else {
            console.warn(`No details found for transaction hash ${tx.hash}`);
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error);
        }
      }
      // RUMORS:DOWNVOTES
      if (tx.category === "RUMORS:DOWNVOTES") {
        console.log(
          `🔴Found transaction with hash ${tx.hash} and category ${tx.category}`
        );
        try {
          // Fetch the full transaction details using the transaction hash
          const txDetails = await pushChain.tx.get(tx.hash);

          // Assume the fetched result contains a list of blocks and each block contains an array of transactions
          if (txDetails.blocks && txDetails.blocks.length > 0) {
            const fetchedTx = txDetails.blocks[0].transactions[0];
            // Log the transaction data from the fetched transaction details
            const dataBytes = new Uint8Array(
              Buffer.from(fetchedTx.data, "hex")
            );
            const decodedData = Downvotes.decode(dataBytes);

            // Convert to plain object
            const downvoteObject = Downvotes.toObject(decodedData, {
              longs: String,
              enums: String,
              bytes: String,
            });

            await updateVotes(0, downvoteObject, pushChain);
          } else {
            console.warn(`No details found for transaction hash ${tx.hash}`);
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error);
        }
      }
    }
  }, customFilters);
};

module.exports = { startWebsocket };
