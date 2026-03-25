/**
 * Inserts the Sholinganallur Panguni Uthiram event (idempotent by city + slug).
 *
 * Live: `tsx scripts/seed-event-panguni.ts --live` — uses `.env.production.local`
 * Dev:  `tsx scripts/seed-event-panguni.ts` — uses `.env.local` then `.env`
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
  console.log("[seed-event] Live target DB host:", hostMatch?.[1] ?? "(unparsed)");
}

const db = drizzle(neon(url), { schema });

const SLUG = "subramanya-swamy-panguni-uthiram-sholinganallur-2026";

const DESCRIPTION = `Poster: https://myomr.in/omr-local-events/assets/Panguni-Uthiram-OMR-Murugan-Temple-Sholinganallur-2026.jpg

**Schedule (1 Apr 2026, Wednesday)**

- **5:45 AM** — Vinayagar Velukku Etru
- **6:00 AM** — Thirupalli Ezhichi Vizha — Early morning ritual to awaken Lord Murugan and bless devotees
- **6:30 AM** — Mahaganapathi Homam & Kalasa Abhishekam
- **7:15 AM** — Valli Devasena Sametha Subramanya Swamy Maha Abhishekam
- **9:00 AM** — Tirukalyanam — Grand celestial wedding of Sri Subramanya Swamy with Devasena & Valli. Celebrated on Panguni Uthiram (full moon with Uthiram star).
- **4:30 PM** — Sahasranama Archanai
- **6:30 PM** — Kalyana Kola Purappadu — Wedding procession of Subramanya Swamy with Valli & Devasena
- **8:30 PM** — Thiru Poon Oonjal & Palli Arai Vizha — Final night ritual marking rest of the deity. Includes prayers, music, and closing of the sanctum.

**Organizer / institution**
Sarva Sathagam Sri Sathurvedha Vidhya Ganapathy Vedhaashram Padasalai, Aathur – Chengalpattu

**Note**
All are welcome.`;

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
    title: "Subramanya Swamy – Panguni Uthiram Vaibhoha Festival",
    description: DESCRIPTION,
    startsAt: new Date("2026-04-01T00:15:00.000Z"),
    endsAt: new Date("2026-04-01T17:30:00.000Z"),
    allDay: false,
    venueName: "Sri Subramanya Swamy Temple, Sholinganallur",
    venueAddress: "Classic Farms Road, Sholinganallur, Tamil Nadu – 600119",
    localityLabel: "Sholinganallur",
    status: "scheduled",
    featured: false,
  });

  console.log("Inserted event:", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
