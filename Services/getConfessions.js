// const { PushNetwork } = require("@pushprotocol/push-chain");
const { PushChain } = require("@pushchain/devnet");
const protobuf = require("protobufjs");

const { calculateVote } = require("./calculateVote.js");

const getConfessions = async (
  page,
  pageSize = 30,
  start = Math.floor(Date.now()),
  order = "DESC"
) => {
  try {
    // Initialize PushNetwork class instance
    // const userAlice = await PushNetwork.initialize("dev");
    const userAlice = await PushChain.initialize(null, {
      rpcUrl: `${process.env.SEPOLIA_RPC}`,
      printTraces: true,
    });
    console.log("User Alice intialized");

    // Define the schema
    const schema = `
      syntax = "proto3";

      message Confession {
        string post = 1;
        string address = 2;
        bool isVisible = 4;
        string timestamp = 5;
      }
    `;

    const root = await protobuf.parse(schema).root;
    const Confession = root.lookupType("Confession");

    const confessions = [];

    console.log("🔵Calling tx.get()");
    // fetch transactions
    const txRes = await userAlice.tx.get("*", {
      raw: true,
      category: "CUSTOM:RUMORS",
      startTime: start,
      order: order,
      page: page || 1,
      limit: pageSize || 10,
    });

    if (!txRes || txRes.blocks.length === 0) return [];

    for (let i = 0; i < txRes.blocks.length; i++) {
      const block = txRes.blocks[i];

      const { upvoteWallets, downvoteWallets } = await calculateVote(
        userAlice,
        block.transactions[0].hash
        // "52df1b8feb2a06b2a3f2a116d8acdfbc649a853f977426ebda2de0d1988ef65a"
      );

      const dataBytes = new Uint8Array(
        Buffer.from(block.transactions[0].data, "hex")
      );

      const decodedData = Confession.decode(dataBytes);

      // Convert to plain object
      const confessionObject = Confession.toObject(decodedData, {
        longs: String,
        enums: String,
        bytes: String,
      });
      console.log(
        JSON.stringify({
          ...confessionObject,
          markdownPost: decodedData.post,
          txnHash: block.transactions[0].hash,
          upvoteWallets: upvoteWallets,
          downvoteWallets: downvoteWallets,
        })
      );

      confessions.push({
        ...confessionObject,
        markdownPost: decodedData.post,
        txnHash: block.transactions[0].hash,
        upvoteWallets: upvoteWallets,
        downvoteWallets: downvoteWallets,
      });
    }

    return confessions;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getConfessions };
