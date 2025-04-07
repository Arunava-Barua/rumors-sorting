const express = require("express");
const cors = require("cors");

const helmet = require("helmet");

require("dotenv").config();

const {
  sortRoute,
  ownerRumourRoute,
  websocketRoute,
} = require("./Routes/index.js");

const app = express();

// Middleware for json body
app.use(express.json());
app.use(cors()); // Access-Control-Allow-Origin (Response) can be set to the Origin (Request) header: {origin: "https://url.com"}
app.use(helmet());

const PORT = 3001;

// Routes
app.use("/api/sort", sortRoute);
app.use("/api/my-rumours", ownerRumourRoute);
app.use("/websocket", websocketRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
app.get("/", function (req, res) {
  res.send("Hello World everyone! Server for Rumors Dapp");
});


