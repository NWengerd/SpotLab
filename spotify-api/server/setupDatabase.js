import fs from "fs";
import Database from "better-sqlite3";

// Create database
const db = new Database("spotify.db");

db.pragma("foreign_keys = ON");

// Read and execute SQL schema from file
const schema = fs.readFileSync(
    "database/schema.sql",
    "utf8"
);
db.exec(schema);

console.log("Database created successfully!");

db.close();