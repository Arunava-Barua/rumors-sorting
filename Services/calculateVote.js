const protobuf = require("protobufjs");

const calculateVote = async (pushNetwork, txHash) => {
  try {
    console.log("Calculating for ", txHash);
    // Define the schema
    const schema = `
        syntax = "proto3";
  
        message Upvotes {
          repeated string wallets = 2;
          repeated string downvoteWallets = 3;
        }
      `;

    // Create a protobuf root and load the schema
    const root = await protobuf.parse(schema).root;

    // Obtain a message type
    const Upvotes = root.lookupType("Upvotes");

    console.log("🔵Calling tx.get()");

    // Fetch transactions
    const txRes = await pushNetwork.tx.get("*", {
      raw: true,
      category: `RUMORS:${txHash}`,
      startTime: Math.floor(Date.now()),
      order: "DESC",
      page: 1,
      limit: 10,
    });

    if (txRes.blocks.length > 0) {
      const block = txRes.blocks[0];
      const dataBytes = new Uint8Array(
        Buffer.from(block.transactions[0].data, "hex")
      );

      const decodedData = Upvotes.decode(dataBytes);

      const decodedObject = Upvotes.toObject(decodedData, {
        longs: String,
        enums: String,
        bytes: String,
      });

      const upvoteWallets = decodedObject.wallets || [];
      const downvoteWallets = decodedObject.downvoteWallets || [];

      // console.log(upvoteWallets, downvoteWallets);

      return {
        upvoteWallets,
        downvoteWallets,
      };
    }

    return { upvoteWallets: [], downvoteWallets: [] };
  } catch (error) {
    console.error("Error at calculateVote():", error);
    return { upvoteWallets: [], downvoteWallets: [] };
  }
};

module.exports = { calculateVote };
