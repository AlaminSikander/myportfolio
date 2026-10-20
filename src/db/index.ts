import "server-only";
import { createDb, type Database } from "./client";

export * from "./schema";

declare global {
  var __portfolioDb: Database | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. See README → Database setup.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export function getDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseNotConfiguredError();
  if (!globalThis.__portfolioDb) {
    globalThis.__portfolioDb = createDb(url);
  }
  return globalThis.__portfolioDb;
}
