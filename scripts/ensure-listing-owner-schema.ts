/**
 * Idempotent: listing-owner auth columns and tables on Neon.
 * Run: `npm run db:ensure:listing-owner:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const live =
  process.env.SEED_LIVE === "1" || process.argv.includes("--live");

if (live) {
  loadEnv({ path: ".env.production.local" });
} else {
  loadEnv({ path: ".env.local" });
  loadEnv({ path: ".env" });
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = neon(url);
const ddl = readFileSync(
  join(process.cwd(), "drizzle/0007_listing_owner_auth.sql"),
  "utf8",
);

async function main() {
  for (const stmt of ddl
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)) {
    await sql.query(stmt);
    console.log("OK:", stmt.slice(0, 60).replace(/\s+/g, " ") + "…");
  }
  console.log("listing-owner schema synced");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
