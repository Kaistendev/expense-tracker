import Database from "better-sqlite3";
import { randomBytes } from "crypto";
import * as path from "path";
import * as fs from "fs";

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'expense',
    category_id TEXT NOT NULL REFERENCES categories(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

const testDbs: string[] = [];

export function createTestDbPath(): string {
  const dbDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, `test-${randomBytes(4).toString("hex")}.db`);
  testDbs.push(dbPath);
  return dbPath;
}

export function initTestDb(dbPath: string): void {
  const sqlite = new Database(dbPath);
  sqlite.exec("PRAGMA journal_mode = WAL");
  sqlite.exec("PRAGMA foreign_keys = ON");
  sqlite.exec(SCHEMA_SQL);
  sqlite.close();
}

export function cleanupTestDbs(): void {
  for (const dbPath of testDbs) {
    try {
      if (fs.existsSync(dbPath)) {
        const walPath = dbPath + "-wal";
        const shmPath = dbPath + "-shm";
        if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
        if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
        fs.unlinkSync(dbPath);
      }
    } catch {}
  }
  testDbs.length = 0;
}
