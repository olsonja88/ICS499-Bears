import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function getDB() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), "dev.db"), // Stores DB in project root
      driver: sqlite3.Database,
    });
  }
  return db;
}