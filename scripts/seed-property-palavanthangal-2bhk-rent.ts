/**
 * Published property: 2 BHK flat for rent — Palavanthangal, near Railway Station.
 *
 * Set CONTACT_PHONE before live seed (or uses site enquiries relay on live).
 *
 * Dev:  `npm run db:seed:property:palavanthangal-2bhk-rent`
 * Live: `npm run db:seed:property:palavanthangal-2bhk-rent:live`
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

/** Owner mobile / WhatsApp (10 digits). Override: PROPERTY_PALAVANTHANGAL_CONTACT_PHONE env. */
const CONTACT_PHONE =
  process.env.PROPERTY_PALAVANTHANGAL_CONTACT_PHONE?.trim() ??
  process.env.CONTACT_PHONE?.trim() ??
  "";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const db = drizzle(neon(url), { schema });

const SLUG = "rent-2bhk-palavanthangal-railway-station-nanganallur";

const BODY = `## About this home

**2 BHK flat for rent** in **Palavanthangal, Nanganallur** — near **Palavanthangal Railway Station**.

### Layout & comfort

- **Built-up area:** 800 sq ft
- **Floor:** 1st floor
- **Configuration:** 2 BHK, 2 bathrooms
- **Balcony:** Road-facing balcony

### Parking & building

- **No car parking** (as stated by the advertiser)

## Terms

- **Rent:** ₹18,000/month
- **Advance:** 6 months
- **Service charges:** Applicable (confirm amount with the owner)
- **Tenant preference:** **Brahmin families only** (as stated by the advertiser)

## Before you pay

This listing is **advertiser-submitted**. **Visit in person**, confirm identity, and read the lease terms — including service charges. Do not transfer advance or rent to unknown accounts. Verify parking, balcony access, and building rules before moving in.`;

/** mynanganallur.in property enquiries (when owner number not supplied). */
const SITE_PROPERTY_ENQUIRIES_PHONE = "7200101497";

function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
}

async function main() {
  let phoneDigits = normalizePhoneDigits(CONTACT_PHONE);
  let usingSiteRelay = false;
  if (phoneDigits.length !== 10 && live) {
    phoneDigits = SITE_PROPERTY_ENQUIRIES_PHONE;
    usingSiteRelay = true;
    console.warn(
      `No owner phone — using mynanganallur enquiries ${phoneDigits}. Set PROPERTY_PALAVANTHANGAL_CONTACT_PHONE to override.`,
    );
  }

  const contactPhone = phoneDigits.length === 10 ? phoneDigits : "9000000000";

  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error("City nanganallur not found — run db:seed first.");
    process.exit(1);
  }

  const publishedAt = new Date("2026-06-25T12:00:00+05:30");

  const phoneSummary =
    phoneDigits.length === 10 ? ` Call ${contactPhone}.` : " Contact phone pending.";

  const body = usingSiteRelay
    ? `${BODY}

## Contact

Call or WhatsApp **mynanganallur** at **72001 01497** and mention this listing — we will connect you with the owner.`
    : BODY;

  const values = {
    cityId: city.id,
    slug: SLUG,
    title:
      "2 BHK flat for rent in Palavanthangal, Nanganallur — near Railway Station",
    summary: `1st floor, 800 sq ft, 2 bath, road-side balcony. No car parking. ₹18,000/mo, 6 months advance. Service charges apply. Brahmin families only.${phoneSummary}`,
    body,
    kind: "rent" as const,
    status: "published" as const,
    localityLabel: "Palavanthangal, Nanganallur, Chennai",
    landmarkNote: "Near Palavanthangal Railway Station",
    rentPerMonth: 18_000,
    salePrice: null as number | null,
    advanceMonths: 6,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 800,
    floorLabel: "1st Floor",
    facing: null as string | null,
    furnishing: "unspecified" as const,
    parkingSummary: "No car parking",
    vegetarianHouseholdOnly: false,
    contactPhone,
    contactEmail: null as string | null,
    featured: false,
    publishedAt,
    heroImageUrl: null as string | null,
    listingSource: "reader_submitted",
    moderationNotes: "Brahmin families only (advertiser-stated); service charges applicable",
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

  if (phoneDigits.length !== 10) {
    console.warn(
      "CONTACT_PHONE not set — dev seed used placeholder 9000000000. Update and re-run before live.",
    );
  }

  console.log(`URL slug: /properties/${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
