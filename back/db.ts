const Pool = require("pg").Pool;
export const db = new Pool({
  user: "postgres",
  password: "p01f01",
  host: "localhost",
  port: 5432,
  database: "soc_chat",
});
