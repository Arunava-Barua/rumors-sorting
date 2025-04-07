const protobuf = require("protobufjs");

// Define the schema
const schemaConfession = `
    syntax = "proto3";
  
    message Confession {
      string post = 1;
      string address = 2;
      bool isVisible = 4;
      string timestamp = 5;
    }
`;

const rootConfession = protobuf.parse(schemaConfession).root;
const Confession = rootConfession.lookupType("Confession");

// Define the schema
const schemaUpvotes = `
    syntax = "proto3";
  
    message Upvotes {
      string rumourHash = 1;
      string address = 2;
    }
`;

const rootUpvotes = protobuf.parse(schemaUpvotes).root;
const Upvotes = rootUpvotes.lookupType("Upvotes");

// Define the schema
const schemaDownvotes = `
    syntax = "proto3";
  
    message Downvotes {
      string rumourHash = 1;
      string address = 2;
    }
`;

const rootDownvotes = protobuf.parse(schemaDownvotes).root;
const Downvotes = rootDownvotes.lookupType("Downvotes");

module.exports = { Confession, Upvotes, Downvotes };
