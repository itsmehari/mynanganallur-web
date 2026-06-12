/**
 * Published property: residential land for sale — Nanganallur 12th Street (near Anjaneyar temple).
 * Direct owner listing.
 *
 * Dev:  `npm run db:seed:property:nanganallur-12th-st-land`
 * Live: `npm run db:seed:property:nanganallur-12th-st-land:live`
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

const SLUG = "sale-residential-land-12th-st-anjaneyar-nanganallur";

const BODY = `## About this plot

**Residential land** for sale in **Nanganallur**, on **12th Street** near **Anjaneyar temple**.

### Plot details

- **Land area:** 1,012 sq ft
- **Dimensions:** 16.6 ft × 61.6 ft
- **Facing:** North
- **Approval:** Patta (as stated by the seller)
- **Road width:** 30 feet

## Terms

- **Price:** ₹1.85 Crore
- **Direct buyers only** — owner-promoted listing (no brokers)

## Enquire

- **WhatsApp / call:** [70103 93895](https://wa.me/917010393895)

## Before you proceed

This listing is **advertiser-submitted** (direct seller). **Visit in person**, verify title documents (patta, EC, tax receipts), survey boundaries, and approvals before paying any advance. Do not transfer money to unknown accounts. Execute the sale through proper registered documentation and legal counsel.`;

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

  const publishedAt = new Date("2026-06-02T12:00:00+05:30");

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "Residential land for sale — 12th Street near Anjaneyar temple, Nanganallur",
    summary:
      "1,012 sq ft, 16.6×61.6 ft, north facing, patta, 30 ft road. ₹1.85 Cr. Direct buyers only. WhatsApp 7010393895.",
    body: BODY,
    kind: "sale" as const,
    status: "published" as const,
    localityLabel: "Nanganallur 12th Street, Chennai",
    landmarkNote: "Near Anjaneyar temple",
    rentPerMonth: null as number | null,
    salePrice: 185_000_000,
    advanceMonths: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    areaSqft: 1012,
    floorLabel: null as string | null,
    facing: "North",
    furnishing: "unspecified" as const,
    parkingSummary: null as string | null,
    vegetarianHouseholdOnly: false,
    contactPhone: "7010393895",
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "owner",
    moderationNotes:
      "Direct buyers only — residential land, 12th Street near Anjaneyar temple",
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
