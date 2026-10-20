import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

export function isNeonUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

function isLocalUrl(url: string) {
  try {
    return ["localhost", "127.0.0.1", "::1"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Neon databases use the HTTP driver (no connection pool to exhaust on serverless).
 * Any other Postgres URL uses node-postgres over TCP. For Supabase, use the transaction pooler
 * (port 6543): postgres.js hangs there when several queries are pipelined on one connection,
 * which node-postgres never does.
 * Both expose the same Drizzle query builder; transactions are not used anywhere because
 * the Neon HTTP driver does not support them.
 */
export function createDb(url: string): Database {
  if (isNeonUrl(url)) {
    return drizzleNeon(neon(url), { schema }) as unknown as Database;
  }
  const pool = new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    ssl: isLocalUrl(url) ? false : { rejectUnauthorized: false },
  });
  return drizzlePg(pool, { schema });
}
