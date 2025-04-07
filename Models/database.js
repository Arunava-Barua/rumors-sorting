const { createPool } = require("mysql2");

const pool = createPool({
    host: "localhost", // 127.0.0.1
    user: "root",
    password: `${process.env.SQL_PASS}`,
    database: "rumoursdb",
    connectionLimit: 10
}).promise();

module.exports = { pool };

