import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
const sqlite = sqlite3.verbose();

const dataDir = path.join(import.meta.dirname, "..", "..", "data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error("Не вдалося відкрити базу даних, ", err.message);
    process.exit(1);
  }
  console.log("DB відкрито: ", dbPath);
});
