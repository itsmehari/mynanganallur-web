/**
 * Published property: 2 BHK independent-house flat for rent — near Independence Park, Nanganallur.
 * Vegetarians only. Top floor (2nd), 700 sqft, bike parking only.
 *
 * Dev:  `npm run db:seed:property:independence-park-2bhk-rent`
 * Live: `npm run db:seed:property:independence-park-2bhk-rent:live`
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

const SLUG = "rent-2bhk-independence-park-nanganallur";

const BODY = `## About this home

**2 BHK flat** in an **independent house** for rent in **Nanganallur**, near **Independence Park**. **Vegetarians only.**

### Layout

- **Built-up area:** 700 sq ft
- **Configuration:** 2 BHK, 2 bathrooms (both western)
- **Floor:** 2nd floor — **top floor**, with roof access for cooling
- **Type:** Independent house, flat-style unit

### Building & parking

- **No lift**
- **No car parking**
- **Bike parking only**

## Terms

- **Rent:** ₹20,000/month
- **Advance:** 4 months
- **Household:** vegetarians only

## Enquire (owner)

- **Call / WhatsApp:** [73057 10601](https://wa.me/917305710601)

## Before you pay

This listing is **advertiser-submitted**. **Visit in person**, confirm identity, and read the lease terms. Do not transfer advance or rent to unknown accounts. Verify floor access, bathrooms, roof use, and parking before moving in.`;

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
      "2 BHK independent-house flat for rent near Independence Park, Nanganallur — vegetarians only",
    summary:
      "Top floor (2nd), 700 sq ft, 2 BHK 2 western baths, roof for cooling. No lift, no car park — bike parking only. ₹20,000/mo, 4 months advance. Owner: 7305710601.",
    body: BODY,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Nanganallur, Chennai",
    landmarkNote: "Near Independence Park",
    rentPerMonth: 20_000,
    salePrice: null as number | null,
    advanceMonths: 4,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 700,
    floorLabel: "2nd Floor (top floor)",
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: "Bike parking only — no car parking, no lift",
    vegetarianHouseholdOnly: true,
    contactPhone: "7305710601",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    submittedByName: null as string | null,
    submittedByPhone: "7305710601",
    faqJson: {
      items: [
        {
          q: "What is the rent and advance?",
          a: "Rent is ₹20,000 per month with 4 months’ advance. Confirm final terms with the owner on 7305710601.",
        },
        {
          q: "Is this for vegetarians only?",
          a: "Yes. The owner has stated vegetarians only.",
        },
        {
          q: "Which floor is the flat on, and is there a lift?",
          a: "It is on the 2nd floor (top floor), with roof access for cooling. There is no lift.",
        },
        {
          q: "Is there car parking?",
          a: "No car parking. Bike parking only.",
        },
        {
          q: "How do I contact the owner?",
          a: "Call or WhatsApp 7305710601 using the buttons on this page.",
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
    await db
      .update(propertyListings)
      .set({
        ...values,
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
