const express = require("express");
const cors = require("cors");

const helmet = require("helmet");

const { jobScheduler } = require("./jobs/jobScheduler.js");
const { initDatabase } = require("./Services/initDatabase.js");

require("dotenv").config();

const { rumoursRoute, websocketRoute } = require("./Routes/index.js");

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
app.use("/api/rumours", rumoursRoute);
app.use("/websocket", websocketRoute);

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Listening on port ${PORT}`);

  // Step 1: Initialize DB
  console.log("🛠️ Running DB init...");
  try {
    await initDatabase();
    console.log("✅ Database initialized.");
  } catch (err) {
    console.error("❌ Database init failed:", err);
    process.exit(1); // Stop the server if DB init fails
  }

  // Start the job scheduler
  console.log("Starting job scheduler...");
  jobScheduler();
});
app.get("/", function (req, res) {
  res.send("Hello World everyone! Server for Rumors Dapp");
});
