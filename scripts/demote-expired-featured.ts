/**
 * Clears featured flag when featured_until has passed.
 *
 *   npm run cron:demote-featured:live
 */
import { config as loadEnv } from "dotenv";
import { and, isNotNull, lt } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  directoryEntries,
  events,
  jobPostings,
  propertyListings,
} from "../src/db/schema";
import * as schema from "../src/db/schema";

loadEnv({ path: ".env.production.local" });
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

async function main() {
  const now = new Date();
  const tables = [
    { name: "events", table: events },
    { name: "job_postings", table: jobPostings },
    { name: "property_listings", table: propertyListings },
    { name: "directory_entries", table: directoryEntries },
  ] as const;

  for (const { name, table } of tables) {
    const res = await db
      .update(table)
      .set({
        featured: false,
        featuredUntil: null,
        updatedAt: new Date(),
      })
      .where(
        and(isNotNull(table.featuredUntil), lt(table.featuredUntil, now)),
      )
      .returning({ id: table.id });
    console.log(`${name}: demoted ${res.length}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
