const { Upvotes } = require("../Schema/schema.js");

const parseTxData = (txData) => {
  let voteObject;
  try {
    // Try parsing as JSON directly
    voteObject = JSON.parse(txData);
    console.log("✅ Parsed as JSON");

    return voteObject;
  } catch (jsonError) {
    try {
      // If JSON parsing fails, treat it as hex-encoded protobuf
      console.log("⚠️ Not valid JSON, trying as hex-encoded protobuf...");

      const dataBytes = new Uint8Array(Buffer.from(txData, "hex"));
      const decodedData = Upvotes.decode(dataBytes);

      // Convert to plain JS object
      voteObject = Upvotes.toObject(decodedData, {
        longs: String,
        enums: String,
        bytes: String,
      });

      console.log("✅ Successfully decoded protobuf data");
      return voteObject;
    } catch (protobufError) {
      console.error("❌ Failed to decode transaction data:", protobufError);
      throw new Error("Invalid transaction data format");
    }
  }
};

module.exports = { parseTxData };
