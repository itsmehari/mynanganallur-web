/**
 * Inserts Thirumurai Music Journey (S.B. Padmanathan) — idempotent by city + slug.
 *
 * Live: `tsx scripts/seed-event-thirumurai-music.ts --live` — uses `.env.production.local`
 * Dev:  `tsx scripts/seed-event-thirumurai-music.ts` — uses `.env.local` then `.env`
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
  console.log("[seed-event-thirumurai] Live target DB host:", hostMatch?.[1] ?? "(unparsed)");
}

const db = drizzle(neon(url), { schema });

const SLUG = "thirumurai-music-journey-sb-padmanathan";

const DESCRIPTION = `**Theme / purpose**  
அர்ப்பணிப்பு, அனுபவம், ஆன்மிகம் – திருமுறை இசை பயணத்திற்கு நம்பகமான வழிகாட்டி

**Organizer / instructor**  
S.B. பத்மநாதன் — ஆன்மிக இசைப் பயிற்சியாளர்  
10+ ஆண்டுகள் இசை அனுபவம்

**What will be taught**

- பக்தி பாடல்கள்  
- தேவாரம்  
- திருப்புகழ்  
- திருவாசகம்  
- ஆதியவை சிறப்பு பயிற்சிகள்  

**Mode of training**  
ஆன்லைன் வகுப்புகள் — Zoom / Google Meet மூலம்

**Additional details**

- குழுவாகவும் தனிப்பட்ட வகுப்புகளும் கிடைக்கும்  
- ஆரம்பநிலை முதல் முன்னோடி வரை பயிற்சி  
- கோயில்கள் மற்றும் கலாச்சார நிகழ்வுகளுக்கான ஆன்மிக இசை நிகழ்த்தும் பயிற்சி  

**Call to action**  
இன்றே பதிவு செய்து, அடியார்களுடன் பகிருங்கள்

**Contact**  
+91 93613 85463

---

**WhatsApp share (My Nanganallur)**  
திருமுறை, தேவாரம், திருப்புகழ் கற்க ஆர்வமா?  
10+ ஆண்டுகள் அனுபவமுள்ள ஆசிரியருடன் ஆன்லைன் பயிற்சி.  
Zoom / Google Meet மூலம் வகுப்புகள்.  
தொடர்பு: 93613 85463`;

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
    title: "திருமுறை இசைப் பயணம் (Thirumurai Music Journey)",
    description: DESCRIPTION,
    startsAt: new Date("2026-04-01T00:00:00+05:30"),
    endsAt: null,
    allDay: false,
    venueName: "Online — Zoom / Google Meet",
    venueAddress: null,
    localityLabel: "Online",
    status: "scheduled",
    featured: false,
  });

  console.log("Inserted event:", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
