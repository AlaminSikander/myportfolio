import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

export function isNeonUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

/**
 * Neon databases use the HTTP driver (no connection pool to exhaust on serverless).
 * Any other Postgres URL (for example a local server) uses a regular TCP connection.
 * Both expose the same Drizzle query builder; transactions are not used anywhere because
 * the Neon HTTP driver does not support them.
 */
export function createDb(url: string): Database {
  if (isNeonUrl(url)) {
    return drizzleNeon(neon(url), { schema }) as unknown as Database;
  }
  return drizzlePostgres(postgres(url, { max: 5, prepare: false }), { schema });
}
