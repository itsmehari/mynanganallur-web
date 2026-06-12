/**
 * Idempotent: sync directory_entry_type enum values on Neon / Postgres.
 * Run: `npm run db:ensure:tutor-enum:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";

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

/** Values in src/db/schema/tables.ts — add new types here when the enum grows. */
const DIRECTORY_ENTRY_TYPES = [
  "bank",
  "school",
  "hospital",
  "park",
  "restaurant",
  "atm",
  "it_company",
  "it_park",
  "government_office",
  "industry",
  "temple",
  "tutor",
] as const;

async function main() {
  for (const value of DIRECTORY_ENTRY_TYPES) {
    // Enum labels cannot be bound as query parameters in ALTER TYPE … ADD VALUE.
    await sql.query(
      `ALTER TYPE "public"."directory_entry_type" ADD VALUE IF NOT EXISTS '${value}'`,
    );
    console.log("OK:", value);
  }
  console.log("directory_entry_type enum synced");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
