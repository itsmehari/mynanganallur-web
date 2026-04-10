/**
 * Idempotent: add articles.faq_json if missing (Neon / Postgres).
 * Run: `node --env-file=.env.production.local ./node_modules/tsx/dist/cli.mjs scripts/ensure-article-faq-column.ts`
 * or with `.env.local` for dev.
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";

loadEnv({ path: ".env.production.local" });
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS faq_json jsonb`;
  console.log("OK: articles.faq_json present");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
