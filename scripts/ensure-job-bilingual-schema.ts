/**
 * Idempotent: bilingual / expiry columns on job_postings + listing_page_views.
 * Run: `npm run db:ensure:job-bilingual:live`
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

const STATEMENTS = [
  `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "locale" text DEFAULT 'en-IN' NOT NULL`,
  `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "alternate_slug" text`,
  `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "job_benefits" text`,
  `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "published_at" timestamp with time zone`,
  `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "expires_at" timestamp with time zone`,
  `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "apply_by" timestamp with time zone`,
  `CREATE TABLE IF NOT EXISTS "listing_page_views" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "entity_type" text NOT NULL,
    "entity_id" uuid NOT NULL,
    "visitor_hash" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "listing_page_views_entity_idx"
    ON "listing_page_views" ("entity_type", "entity_id")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "listing_page_views_unique_visitor_uidx"
    ON "listing_page_views" ("entity_type", "entity_id", "visitor_hash")`,
];

async function main() {
  for (const statement of STATEMENTS) {
    await sql.query(statement);
    console.log("OK:", statement.slice(0, 72).replace(/\s+/g, " ") + "…");
  }
  console.log("job bilingual + page views schema ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
