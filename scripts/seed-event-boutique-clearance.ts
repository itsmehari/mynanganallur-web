/**
 * Nanganallur boutique clearance — lehengas & sarees at wholesale price (shop closing).
 *
 * Dev:  `npm run db:seed:event:boutique-clearance`
 * Live: `npm run db:seed:event:boutique-clearance:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, events } from "../src/db/schema/tables";

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
      ? "Live: DATABASE_URL missing. Add to .env.production.local (e.g. vercel env pull)."
      : "DATABASE_URL missing — add to .env.local",
  );
  process.exit(1);
}

if (live) {
  const hostMatch = url.match(/@([^/?]+)/);
  console.log(
    "[seed-event-boutique-clearance] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const SLUG = "boutique-clearance-lehenga-saree-nanganallur-2026";

const DESCRIPTION = `**Clearance sale — boutique closing**

A boutique shop in **Nanganallur** is closing down. The owner is offering the remaining **lehenga** and **saree** collection at **wholesale prices** while stock lasts.

## What's on offer

- Lehengas
- Sarees
- Wholesale pricing — great value for resellers and personal buyers

## Location

**Nanganallur**, Chennai — contact the seller for shop visit details.

## How to enquire

Interested buyers can **call or WhatsApp** on **[98848 83486](tel:+919889883486)**.

---

*Listing sourced from a community WhatsApp post (19 Jun 2026). Confirm availability, sizes, colours, and prices directly with the seller before you visit.*`;

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City slug 'nanganallur' not found. Seed cities first (npm run db:seed:live).");
    process.exit(1);
  }

  const [existing] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.cityId, city.id), eq(events.slug, SLUG)))
    .limit(1);

  if (existing) {
    console.log("Event already exists:", SLUG, existing.id);
    return;
  }

  await db.insert(events).values({
    cityId: city.id,
    slug: SLUG,
    title: "Boutique Clearance Sale — Lehengas & Sarees at Wholesale Price",
    description: DESCRIPTION,
    startsAt: new Date("2026-06-19T00:00:00+05:30"),
    endsAt: new Date("2026-07-19T23:59:59+05:30"),
    allDay: true,
    venueName: "Boutique shop (Nanganallur)",
    venueAddress: null,
    localityLabel: "Nanganallur",
    status: "scheduled",
    featured: false,
    submittedByPhone: "9884883486",
    source: "admin",
  });

  console.log("Inserted event:", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
