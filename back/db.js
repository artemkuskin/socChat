const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "p01f01",
  host: "localhost",
  port: 5432,
  database: "soc_chat",
});

module.exports = pool;
