const express = require("express");
const cors = require("cors");

const helmet = require("helmet");

const { jobScheduler } = require("./jobs/jobScheduler.js");

require("dotenv").config();

const {
  sortRoute,
  ownerRumourRoute,
  websocketRoute,
} = require("./Routes/index.js");

const app = express();

// Middleware for json body
app.use(express.json());

// CORS: Allow only your frontend domain
const allowedOrigins = [
  "https://your-frontend-domain.com",
  "http://localhost:3000",
  "http://192.168.31.144",
];
app.use(
  cors({
    origin: function (origin, callback) {
      const env = process.env.ENVIRONMENT;

      if (env === "DEV") {
        return callback(null, true); // Allow all in development
      }

      if (!origin) return callback(null, true); // Allow Postman/mobile/etc.

      if (env === "PROD" && allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(helmet());

const PORT = 3001;

// Routes
app.use("/api/sort", sortRoute);
app.use("/api/my-rumours", ownerRumourRoute);
app.use("/websocket", websocketRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  // Start the job scheduler
  // console.log("Starting job scheduler...");
  // jobScheduler();
});
app.get("/", function (req, res) {
  res.send("Hello World everyone! Server for Rumors Dapp");
});
