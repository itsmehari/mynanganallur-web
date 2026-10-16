/**
 * Production Next may pass percent-encoded Tamil route params.
 * Rewrite nanganallur Tamil VV job slugs to percent-encoded form so exact
 * match works; browsers still show Tamil script in the address bar.
 *
 * Live: `npx tsx scripts/fix-vv-tamil-slugs-percent-encoded.ts --live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { cities, jobPostings } from "../src/db/schema/tables";

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

const PAIRS: { en: string; taUnicode: string }[] = [
  {
    en: "ac-technician-helper-50-vacancies-madipakkam-chennai",
    taUnicode: "ஏசி-டெக்னீஷன்-ஹெல்பர்-50-காலியிடம்-மடிப்பாக்கம்-சென்னை",
  },
  {
    en: "hr-recruiter-10-vacancies-sembakkam-chennai",
    taUnicode: "எச்ஆர்-ரெக்ரூட்டர்-10-காலியிடம்-செம்பாக்கம்-சென்னை",
  },
];

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);
  if (!city) {
    console.error("nanganallur city missing");
    process.exit(1);
  }

  for (const { en, taUnicode } of PAIRS) {
    const taEncoded = encodeURIComponent(taUnicode);

    const [taRow] = await db
      .select({ id: jobPostings.id, slug: jobPostings.slug })
      .from(jobPostings)
      .where(
        and(
          eq(jobPostings.cityId, city.id),
          eq(jobPostings.slug, taUnicode),
        ),
      )
      .limit(1);

    if (taRow) {
      // If encoded slug already taken in this city, remove it first (shouldn't happen).
      const [clash] = await db
        .select({ id: jobPostings.id })
        .from(jobPostings)
        .where(
          and(
            eq(jobPostings.cityId, city.id),
            eq(jobPostings.slug, taEncoded),
          ),
        )
        .limit(1);
      if (clash && clash.id !== taRow.id) {
        await db.delete(jobPostings).where(eq(jobPostings.id, clash.id));
        console.log("Removed clash encoded slug row", clash.id);
      }

      await db
        .update(jobPostings)
        .set({
          slug: taEncoded,
          alternateSlug: en,
          locale: "ta-IN",
          updatedAt: new Date(),
        })
        .where(eq(jobPostings.id, taRow.id));
      console.log("Updated TA slug → percent-encoded for", en);
    } else {
      // Maybe already encoded
      const [existingEnc] = await db
        .select({ id: jobPostings.id })
        .from(jobPostings)
        .where(
          and(
            eq(jobPostings.cityId, city.id),
            eq(jobPostings.slug, taEncoded),
          ),
        )
        .limit(1);
      console.log(
        existingEnc
          ? `Already encoded: ${en}`
          : `MISSING Tamil row for ${en}`,
      );
    }

    await db
      .update(jobPostings)
      .set({
        alternateSlug: taEncoded,
        updatedAt: new Date(),
      })
      .where(
        and(eq(jobPostings.cityId, city.id), eq(jobPostings.slug, en)),
      );
    console.log("Updated EN alternateSlug → encoded TA for", en);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
