require("dotenv").config();

const { createPool } = require("mysql2");

const pool = createPool({
  host: `${process.env.DB_HOST}`, // 127.0.0.1
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  connectionLimit: 100,
}).promise();

module.exports = { pool };
