/**
 * Enable pg_trgm + create GIN trigram indexes on title/body of every searchable
 * entity. Idempotent.
 *
 * Live: `npm run db:apply:live-trgm`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

loadEnv({ path: ".env.production.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing (.env.production.local)");
  process.exit(1);
}

const db = drizzle(neon(url));

async function run(label: string, raw: string) {
  await db.execute(sql.raw(raw));
  console.log("OK:", label);
}

async function main() {
  await run("extension pg_trgm", `CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

  const triplets: Array<[string, string, string]> = [
    ["articles", "title", "articles_title_trgm"],
    ["articles", "body", "articles_body_trgm"],
    ["articles", "summary", "articles_summary_trgm"],
    ["events", "title", "events_title_trgm"],
    ["events", "description", "events_description_trgm"],
    ["job_postings", "title", "job_postings_title_trgm"],
    ["job_postings", "body", "job_postings_body_trgm"],
    ["property_listings", "title", "property_listings_title_trgm"],
    ["property_listings", "body", "property_listings_body_trgm"],
    ["directory_entries", "name", "directory_entries_name_trgm"],
    ["directory_entries", "address", "directory_entries_address_trgm"],
  ];

  for (const [table, col, idx] of triplets) {
    await run(
      idx,
      `CREATE INDEX IF NOT EXISTS "${idx}" ON "${table}" USING gin ("${col}" gin_trgm_ops);`,
    );
  }

  console.log("\nDone — pg_trgm indexes applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
