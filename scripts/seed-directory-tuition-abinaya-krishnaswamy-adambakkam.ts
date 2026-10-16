/**
 * All subjects tuition — Abinaya Krishnaswamy (Adambakkam).
 *
 * Dev:  `npm run db:seed:directory:tuition-abinaya-adambakkam`
 * Live: `npm run db:seed:directory:tuition-abinaya-adambakkam:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, directoryEntries } from "../src/db/schema/tables";

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
  console.error(
    live
      ? "Live: DATABASE_URL missing. Add to .env.production.local."
      : "DATABASE_URL missing — add to .env.local",
  );
  process.exit(1);
}

if (live) {
  const hostMatch = url.match(/@([^/?]+)/);
  console.log(
    "[seed-directory-tuition-abinaya] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const TYPE = "tutor" as const;
const SLUG = "all-subjects-tuition-abinaya-krishnaswamy-adambakkam";

const faqJson = {
  items: [
    {
      q: "What subjects are covered?",
      a: "All subjects — home tuition for school students. Confirm grade, board, and subject coverage directly with the tutor before enrolling.",
    },
    {
      q: "What are the class timings?",
      a: "Evening batches: 5:00 PM to 8:00 PM. Confirm exact days and batch size by phone before joining.",
    },
    {
      q: "Where are classes held?",
      a: "Adambakkam, next to Prime Care Hospital, Chennai — convenient for Adambakkam and nearby Nanganallur belt families.",
    },
    {
      q: "How do I enquire?",
      a: "Contact Abinaya Krishnaswamy on 7695921320 or 6374754350. Confirm timings, fees, and subjects directly before enrolling.",
    },
  ],
};

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City slug 'nanganallur' not found. Seed cities first.");
    process.exit(1);
  }

  const [existing] = await db
    .select({ id: directoryEntries.id })
    .from(directoryEntries)
    .where(
      and(
        eq(directoryEntries.cityId, city.id),
        eq(directoryEntries.type, TYPE),
        eq(directoryEntries.slug, SLUG),
      ),
    )
    .limit(1);

  const row = {
    cityId: city.id,
    type: TYPE,
    name: "All subjects tuition — Abinaya Krishnaswamy",
    slug: SLUG,
    address:
      "Adambakkam, next to Prime Care Hospital, Chennai, Tamil Nadu",
    localityLabel: "Adambakkam",
    phone: "7695921320 / 6374754350",
    websiteUrl: null,
    hoursSummary: "Mon–Sat evenings: 5:00 PM – 8:00 PM (confirm by phone)",
    faqJson,
    verified: false,
    metadata: JSON.stringify({
      sources: ["Reader-submitted listing for mynanganallur.in"],
      contactPerson: "Abinaya Krishnaswamy",
      note: "Details provided by the tutor; confirm timings, fees, and subjects by phone before enrolling.",
    }),
    updatedAt: new Date(),
  };

  if (existing) {
    await db
      .update(directoryEntries)
      .set(row)
      .where(eq(directoryEntries.id, existing.id));
    console.log("Updated directory:", TYPE, SLUG, existing.id);
  } else {
    await db.insert(directoryEntries).values(row);
    console.log("Inserted directory:", TYPE, SLUG);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
