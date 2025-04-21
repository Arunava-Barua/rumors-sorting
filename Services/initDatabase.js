// initDatabase.js
const mysql = require("mysql2/promise");

async function initDatabase() {
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  const [dbs] = await connection.query("SHOW DATABASES LIKE ?", [DB_NAME]);
  if (dbs.length === 0) {
    console.log(`📦 Creating database "${DB_NAME}"...`);
    await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
  }

  await connection.query(`USE \`${DB_NAME}\``);

  const tableExists = async (table) => {
    const [rows] = await connection.query("SHOW TABLES LIKE ?", [table]);
    return rows.length > 0;
  };

  if (!(await tableExists("Meta"))) {
    await connection.query(`
      CREATE TABLE Meta (
        rumourHash VARCHAR(66) PRIMARY KEY,
        timestamp BIGINT NOT NULL
      );
      CREATE INDEX idx_meta_rumourHash_timestamp ON Meta(rumourHash, timestamp DESC);
    `);
  }

  if (!(await tableExists("RumoursDetails"))) {
    await connection.query(`
      CREATE TABLE RumoursDetails (
        rumourHash VARCHAR(66) PRIMARY KEY,
        post TEXT,
        owner VARCHAR(255) NOT NULL,
        upvotes INT DEFAULT 0,
        downvotes INT DEFAULT 0,
        FOREIGN KEY (rumourHash) REFERENCES Meta(rumourHash)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX idx_rd_votes ON RumoursDetails(upvotes DESC, downvotes ASC, rumourHash);
    `);
  }

  if (!(await tableExists("RumoursMeta"))) {
    await connection.query(`
      CREATE TABLE RumoursMeta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rumourHash VARCHAR(66),
        transactionHash VARCHAR(66) UNIQUE NOT NULL,
        type TINYINT NOT NULL,
        userAddress VARCHAR(255) NOT NULL,
        FOREIGN KEY (rumourHash) REFERENCES Meta(rumourHash)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  }

  await connection.end();
}

module.exports = { initDatabase };
