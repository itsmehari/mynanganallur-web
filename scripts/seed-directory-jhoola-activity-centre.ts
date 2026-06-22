/**
 * Jhoola — The Activity Centre (library, play, board games, creative activities).
 *
 * Dev:  `npm run db:seed:directory:jhoola-activity-centre`
 * Live: `npm run db:seed:directory:jhoola-activity-centre:live`
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
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const db = drizzle(neon(url), { schema });

const TYPE = "industry" as const;
const SLUG = "jhoola-activity-centre-nanganallur";
const HERO_PATH = "/listings/jhoola-activity-centre-june-2026.png";

const DESCRIPTION = `**Jhoola — The Activity Centre** is a space to read, play, create and grow — for children, for families, for joy.

On a mission to create **1,000 readers before 2027**.

## What you'll find

- **Play spaces** — indoor open-ended play designed to spark imagination
- **Library** — 3,000+ books for children
- **Board games** — fun, friendly games for all ages
- **Creative activities** — express, explore, and enjoy

## Current offer

**Walk in and avail one month library membership free** for every child (confirm availability by phone before visiting).

## Location

8, 8th Street, 1st Floor, Nanganallur — opposite Hayagrivar Temple.

Call or WhatsApp **91765 83618** · [jhoola.co](https://jhoola.co/)`;

const faqJson = {
  items: [
    {
      q: "What is Jhoola Activity Centre?",
      a: "A screen-free neighbourhood space in Nanganallur for children and families — library, play areas, board games, and creative activities.",
    },
    {
      q: "Where is Jhoola in Nanganallur?",
      a: "8, 8th Street, 1st Floor, Nanganallur, opposite Hayagrivar Temple. Call 91765 83618 before visiting.",
    },
    {
      q: "Is there a library membership offer?",
      a: "Jhoola has promoted a complimentary one-month library membership on walk-in — confirm the offer is still active by phone or WhatsApp before you visit.",
    },
    {
      q: "How do I contact Jhoola?",
      a: "Phone or WhatsApp 91765 83618. Website: jhoola.co",
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
    name: "Jhoola — The Activity Centre",
    slug: SLUG,
    address: "8, 8th Street, 1st Floor, Nanganallur (Opposite Hayagrivar Temple)",
    localityLabel: "Nanganallur",
    phone: "9176583618",
    websiteUrl: "https://jhoola.co/",
    hoursSummary: "Call ahead for timings — library, play, board games & creative activities",
    heroImageUrl: HERO_PATH,
    featured: true,
    faqJson,
    verified: false,
    metadata: JSON.stringify({
      description: DESCRIPTION,
      sources: ["Jhoola Activity Centre — community flyer, June 2026"],
      note: "Promotional offers and timings change — confirm by phone before visiting.",
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

  console.log("Public URL: /directory/industry/" + SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
