import { config } from "dotenv";
config({ path: [".env.local", ".env"], quiet: true });
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("DATABASE_URL is not set."); process.exit(1); }
  if (/supabase\.(co|com)|amazonaws|neon\.tech/.test(url)) {
    console.error("Refusing to drop a hosted database. Reset it from its own dashboard.");
    process.exit(1);
  }
  const sql = postgres(url, { onnotice: () => {} });
  await sql.unsafe("drop schema public cascade; create schema public;").simple();
  console.log("  public schema dropped and recreated.");
  await sql.end();
}
main();
