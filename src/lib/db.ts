import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Pool } from 'pg';
import path from "path";

let db: Database | null = null;
let pgPool: Pool | null = null;

export async function getDB() {
  // If DATABASE_URL starts with 'postgres://' or 'postgresql://', use PostgreSQL
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
    }
    return pgPool;
  }
  
  // Otherwise use SQLite
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), "dev.db"), // Stores DB in project root
      driver: sqlite3.Database,
    });
  }
  return db;
}

// Helper function to execute queries that works with both SQLite and PostgreSQL
export async function executeQuery(query: string, params: any[] = []) {
  const db = await getDB();
  
  if (db instanceof Pool) {
    // PostgreSQL
    const result = await db.query(query, params);
    return result.rows;
  } else {
    // SQLite
    return await db.all(query, params);
  }
}

// Helper function to execute single row queries
export async function executeQuerySingle(query: string, params: any[] = []) {
  const db = await getDB();
  
  if (db instanceof Pool) {
    // PostgreSQL
    const result = await db.query(query, params);
    return result.rows[0];
  } else {
    // SQLite
    return await db.get(query, params);
  }
}

// Helper function to execute insert/update/delete queries
export async function executeQueryRun(query: string, params: any[] = []) {
  const db = await getDB();
  
  if (db instanceof Pool) {
    // PostgreSQL
    const result = await db.query(query, params);
    return { lastID: result.rows[0]?.id, changes: result.rowCount };
  } else {
    // SQLite
    return await db.run(query, params);
  }
}