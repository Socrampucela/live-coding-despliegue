const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/db.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const empty = { users: [], notes: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
