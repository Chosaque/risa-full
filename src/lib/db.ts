import "server-only";
import postgres from "postgres";

declare global {
  var __risa_sql: ReturnType<typeof postgres> | undefined;
}

const connection = process.env.DATABASE_URL;
if (!connection) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");

/** Single pooled client, reused across HMR reloads in dev. */
export const sql =
  global.__risa_sql ??
  postgres(connection, {
    max: 10,
    idle_timeout: 20,
    transform: { undefined: null },
  });

if (process.env.NODE_ENV !== "production") global.__risa_sql = sql;
