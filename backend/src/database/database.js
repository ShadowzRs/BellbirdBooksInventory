const Database = require("better-sqlite3");
const db = new Database("bellbird.db");

module.exports = db;
