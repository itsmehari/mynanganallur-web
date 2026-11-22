/**
 * Published property: daytime co-working space for rent — Hindu Colony, Nanganallur.
 * Daily, weekly, or monthly. Monday to Saturday, 8:00am to 5:00pm.
 * Aimed at IT professionals, share trading, and similar desk work.
 *
 * Dev:  `npm run db:seed:property:coworking-hindu-colony`
 * Live: `npm run db:seed:property:coworking-hindu-colony:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, propertyListings } from "../src/db/schema/tables";

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

const SLUG = "rent-coworking-hindu-colony-nanganallur";

const BODY = `## About this space

**Co-working space for rent** in **Hindu Colony, Nanganallur**. The advertiser says it suits **IT professionals**, **share trading**, and similar daytime desk work.

## Hours and rental basis

- **Hours:** 8:00am to 5:00pm
- **Days:** Monday to Saturday
- **Tenure:** daily, weekly, or monthly — confirm rates and deposit when you enquire

## Amenities (as stated)

- Wi-Fi
- Air conditioning
- CCTV
- Power backup
- Restrooms
- Housekeeping

## Location

**Hindu Colony, Nanganallur**, Chennai. A full street address was not shared. Confirm the building, access, and seating when you call.

The same note is on [MyChennaiCity](https://mychennaicity.in/chennai-classifieds/coworking-space-rent-hindu-colony-nanganallur).

See other [properties for rent in Nanganallur](/properties?kind=rent) or the [Nanganallur core area guide](/areas/nanganallur-core).

## Enquire

- **Call / WhatsApp:** [98840 36077](https://wa.me/919884036077)

## Before you pay

This listing is **advertiser-submitted**. **Visit in person**, confirm identity, desk availability, hours, and commercial terms. Rent, deposit, and seat count were not stated in the original note. Do not transfer advance or rent to unknown accounts.`;

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City nanganallur not found — run db:seed first.");
    process.exit(1);
  }

  const publishedAt = new Date();

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "Co-working space for rent in Hindu Colony, Nanganallur — IT & share trading",
    summary:
      "Co-working space in Hindu Colony, Nanganallur. Monday to Saturday, 8:00am–5:00pm. Daily, weekly, or monthly. Wi-Fi, AC, CCTV, power backup, restrooms, housekeeping. Call 9884036077.",
    body: BODY,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Hindu Colony, Nanganallur, Chennai",
    landmarkNote: "Monday–Saturday, 8:00am–5:00pm · daily, weekly, or monthly",
    rentPerMonth: null as number | null,
    salePrice: null as number | null,
    advanceMonths: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    areaSqft: null as number | null,
    floorLabel: null as string | null,
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: null as string | null,
    vegetarianHouseholdOnly: false,
    contactPhone: "9884036077",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    submittedByName: null as string | null,
    submittedByPhone: "9884036077",
    moderationNotes:
      "Daytime co-working desk space, Hindu Colony; Mon–Sat 8:00am–5:00pm; daily/weekly/monthly; rent not stated",
    faqJson: {
      items: [
        {
          q: "Where is this co-working space?",
          a: "Hindu Colony, Nanganallur, Chennai. A full street address was not shared — confirm the building and access with the advertiser on 9884036077.",
        },
        {
          q: "Who is the space meant for?",
          a: "The advertiser lists it for IT professionals, share trading, and similar daytime desk work.",
        },
        {
          q: "What are the hours?",
          a: "The advertiser lists availability from 8:00am to 5:00pm, Monday to Saturday.",
        },
        {
          q: "Can I take it for a day, a week, or a month?",
          a: "Yes. The advertiser says daily, weekly, or monthly. Ask for current rates, deposit, and minimum stay on 9884036077.",
        },
        {
          q: "What amenities are included?",
          a: "As stated: Wi-Fi, air conditioning, CCTV, power backup, restrooms, and housekeeping. Confirm what is included in the quoted fee.",
        },
        {
          q: "What is the rent?",
          a: "Rent was not stated in the original note. Call or WhatsApp 9884036077 for current weekly and monthly rates.",
        },
        {
          q: "How do I contact the advertiser?",
          a: "Call or WhatsApp 9884036077 using the buttons on this page.",
        },
      ],
    },
  };

  const [existing] = await db
    .select({ id: propertyListings.id })
    .from(propertyListings)
    .where(
      and(eq(propertyListings.cityId, city.id), eq(propertyListings.slug, SLUG)),
    )
    .limit(1);

  if (existing) {
    const { publishedAt: _publishedAt, ...updateValues } = values;
    await db
      .update(propertyListings)
      .set({
        ...updateValues,
        updatedAt: new Date(),
      })
      .where(eq(propertyListings.id, existing.id));
    console.log("Updated property:", SLUG);
  } else {
    await db.insert(propertyListings).values(values);
    console.log("Inserted property:", SLUG);
  }

  console.log(`URL: https://mynanganallur.in/properties/${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
