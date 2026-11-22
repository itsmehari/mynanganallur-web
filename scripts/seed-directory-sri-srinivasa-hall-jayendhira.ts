/**
 * Sri Srinivasa A/C Hall + Sri Jayendhira A to Z Marriage Catering (West Mambalam).
 *
 * Dev:  `npm run db:seed:directory:sri-srinivasa-jayendhira`
 * Live: `npm run db:seed:directory:sri-srinivasa-jayendhira:live`
 *
 * Public URL: /directory/industry/sri-srinivasa-hall-jayendhira-catering
 * (alias /directory/business/…)
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
const SLUG = "sri-srinivasa-hall-jayendhira-catering";
const HERO_PATH = "/listings/sri-srinivasa-hall-jayendhira-catering.jpg";

const DESCRIPTION = `**Sri Srinivasa Hall (A/C)** and **Sri Jayendhira A to Z Marriage Catering Services** — an air-conditioned marriage hall in West Mambalam, with pure vegetarian catering that the flyer says can be booked on contract from West Mambalam to anywhere in Tamil Nadu.

The hall is in **West Mambalam**, not in Nanganallur. Listed here because families in the Nanganallur area often book halls and catering across the city.

## Hall

- Fully air-conditioned hall for small and medium gatherings
- Spacious and well-maintained, in the heart of West Mambalam
- Car parking and lift
- The business website also mentions a dining area, rooms, and full event support

## Catering

Pure vegetarian menu. The flyer lists custom menus for:

- Weddings and receptions
- Seemantham
- Nichayathartham
- Birthdays
- Upanayanam
- Other small and medium functions

The flyer says the service uses quality ingredients, prepares food hygienically, and offers affordable packages with timely delivery.

## Experience

The flyer says the hall and catering have been trusted for **25+ years**. The business website describes **30+ years** of Brahmin-style pure vegetarian catering. Confirm the current package with them before you book.

## Contact

- Call or WhatsApp **97917 46486** (on both the flyer and the website)
- Second number on the website: **98423 31424**
- The flyer prints **98423 31434** for that second line (one digit differs) — confirm which number to use
- Email on the website: sjcs.srinivasaan@gmail.com
- Website: [sjcscateringservices.com](https://sjcscateringservices.com/)

## Also listed by them

42 D, Valatheeswaran Koil Street, Kanchipuram 631501 (from the business website).`;

const faqJson = {
  items: [
    {
      q: "Where is Sri Srinivasa Hall?",
      a: "No. 19 (8/1), K.R. Koil Street, opposite Kothandaramar Koil, West Mambalam, Chennai 600033. This is not in Nanganallur. Address is from sjcscateringservices.com, which the flyer links to.",
    },
    {
      q: "Do they only serve West Mambalam?",
      a: "The hall is in West Mambalam. The flyer says pure veg catering is available on contract from West Mambalam to anywhere in Tamil Nadu.",
    },
    {
      q: "What functions do they cater?",
      a: "The flyer lists weddings, receptions, seemantham, nichayathartham, birthdays, upanayanam, and other small or medium functions. The website also mentions engagements, poojas, housewarmings, naming ceremonies, and baby showers.",
    },
    {
      q: "How do I book?",
      a: "Call or WhatsApp 9791746486. The website also lists 9842331424 and sjcs.srinivasaan@gmail.com. The flyer prints 9842331434 — confirm the second number when you call. Website: https://sjcscateringservices.com/",
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
    name: "Sri Srinivasa Hall & Sri Jayendhira Catering",
    slug: SLUG,
    address:
      "No. 19 (8/1), K.R. Koil Street, Opp. Kothandaramar Koil, West Mambalam, Chennai 600033",
    localityLabel: "West Mambalam",
    phone: "9791746486",
    websiteUrl: "https://sjcscateringservices.com/",
    hoursSummary:
      "Call or WhatsApp to book the A/C hall or pure veg catering — timings not printed on the flyer",
    heroImageUrl: HERO_PATH,
    featured: false,
    faqJson,
    verified: false,
    metadata: JSON.stringify({
      description: DESCRIPTION,
      sources: [
        "Community flyer — Sri Srinivasa Hall A/C and Sri Jayendhira A to Z Marriage Catering Services",
        "https://sjcscateringservices.com/ (address, email, and second phone)",
      ],
      note: "Hall is in West Mambalam. Flyer second phone is 9842331434; the website lists 9842331424. Confirm packages, capacity, and the second number before booking.",
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
