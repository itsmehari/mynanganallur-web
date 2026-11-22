/**
 * Post-event coverage: SriSon Naturopathy and Yoga Centre at the
 * 2nd National Yogasana Championship (SRM Agricultural College, Acharapakkam).
 *
 * Dev:  `npm run db:seed:article:srison-yogasana-2026`
 * Live: `npm run db:seed:article:srison-yogasana-2026:live`
 */
import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { articles, cities } from "../src/db/schema/tables";

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
    "[seed-article-srison-yogasana-2026] Live target DB host:",
    hostMatch?.[1] ?? "(unparsed)",
  );
}

const db = drizzle(neon(url), { schema });

const SLUG = "srison-yogasana-championship-srm-acharapakkam-november-2026";

const HERO =
  "/news/srison-yogasana-2026-prize-distribution.jpg";
const IMG_MERIT = "/news/srison-yogasana-2026-merit-certificates.jpg";
const IMG_HONOUR = "/news/srison-yogasana-2026-institution-honour.jpg";
const IMG_GROUP = "/news/srison-yogasana-2026-students-medals.jpg";

const TITLE =
  "Nanganallur SriSon students place at 2nd National Yogasana Championship";

const SUMMARY =
  "Students from SriSon Naturopathy and Yoga Centre, Nanganallur, took part in the 2nd National Yogasana Championship at SRM Agricultural College, Acharapakkam. Adarsh, Elandeeran and Sri Raman won championship titles; the centre received an Institution Honour citation.";

const DEK =
  "Event held on 22 November 2026 at SRM’s Acharapakkam campus. Coverage based on details shared by the centre after the championship.";

const FAQ = {
  items: [
    {
      q: "Which championship was this?",
      a: "The 2nd National Yogasana Championship, held at SRM Agricultural College, Acharapakkam (SRM Institute of Science & Technology, Acharapakkam campus), on 22 November 2026.",
    },
    {
      q: "Which Nanganallur centre took part?",
      a: "SriSon Naturopathy and Yoga Centre, Nanganallur, Chennai 600061. Students from the centre competed; the centre also received an Institution Honour citation at the event.",
    },
    {
      q: "Which students were named as winners?",
      a: "According to the centre, Adarsh, Elandeeran and Sri Raman won championship titles. Full category-wise result sheets from the organisers were not published with this tip.",
    },
    {
      q: "What honour did the centre receive?",
      a: "An Institution Honour memento for SriSon Naturopathy and Yoga Center, Nanganallur. The plaque names the Directorate of Sports, SRM Institute of Science & Technology, and Easy Yoga Studioz – Padmam Yoga among the organisers.",
    },
  ],
};

const REPORT = `Students from **SriSon Naturopathy and Yoga Centre**, Nanganallur, took part in the **2nd National Yogasana Championship** at **SRM Agricultural College, Acharapakkam**, on **22 November 2026**.

According to an update shared by the centre after the meet, students **Adarsh**, **Elandeeran** and **Sri Raman** won championship titles. Other SriSon students also competed and returned with certificates and medals.

The centre was recognised with an **Institution Honour** citation. The memento names **SriSon Naturopathy and Yoga Center, Nanganallur, Chennai – 600061**, and lists the venue as **SRM Institute of Science & Technology, Acharapakkam Campus**. Organiser lines on the plaque include the **Directorate of Sports, SRM IST**, and **Easy Yoga Studioz – Padmam Yoga**.

My Nanganallur has not independently verified a full category-wise results sheet. This report follows what the centre stated and what appears on the honour memento and prize photographs shared with us.

![Prize distribution at the 2nd National Yogasana Championship, Acharapakkam](${IMG_MERIT})

## Event details

- **Event:** 2nd National Yogasana Championship
- **Date:** 22 November 2026
- **Venue:** SRM Agricultural College / SRM IST, Acharapakkam campus
- **Local centre:** SriSon Naturopathy and Yoga Centre, Nanganallur
- **Named winners (per centre):** Adarsh, Elandeeran, Sri Raman
- **Centre recognition:** Institution Honour

![Institution Honour memento presented to SriSon Naturopathy and Yoga Center, Nanganallur](${IMG_HONOUR})

![SriSon students with certificates and medals after the championship](${IMG_GROUP})`;

const ANALYSIS = `Nanganallur has several yoga and naturopathy centres that train children and adults through the year. A national-level meet at a nearby SRM campus gives those students a formal stage without long-distance travel for every family.

Named winners should be read as reported by the centre. For official category ranks, ask the organisers or the centre for the published results. Neighbours seeking local yogasana coaching can reach SriSon on [8148888604](tel:+918148888604).`;

const INTERACTIVE = null;

async function main() {
  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "nanganallur"))
    .limit(1);

  if (!city) {
    console.error(
      "City slug 'nanganallur' not found. Seed cities first (npm run db:seed:live).",
    );
    process.exit(1);
  }

  const body = `${REPORT}\n\n---\n\n${ANALYSIS}`;
  const articleValues = {
    cityId: city.id,
    slug: SLUG,
    title: TITLE,
    summary: SUMMARY,
    dek: DEK,
    body,
    reportBody: REPORT,
    analysisBody: ANALYSIS,
    interactiveJson: INTERACTIVE as Record<string, unknown> | null,
    category: "Local",
    status: "published" as const,
    publishedAt: new Date("2026-11-22T12:45:00.000Z"),
    featured: true,
    heroImageUrl: HERO,
    faqJson: FAQ,
    source: "admin" as const,
    sourceName: "SriSon Naturopathy and Yoga Centre",
    submittedByPhone: "8148888604",
    moderationNotes:
      "Community tip via WhatsApp (+91 81488 88604), 22 Nov 2026. Photos from centre. Careful wording: winners named by centre; Institution Honour from memento text; full results sheet not attached.",
  };

  const [existing] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.cityId, city.id), eq(articles.slug, SLUG)))
    .limit(1);

  if (existing) {
    await db
      .update(articles)
      .set({ ...articleValues, updatedAt: new Date() })
      .where(eq(articles.id, existing.id));
    console.log("Updated article:", SLUG, existing.id);
  } else {
    const [inserted] = await db
      .insert(articles)
      .values(articleValues)
      .returning({ id: articles.id });
    console.log("Inserted article:", SLUG, inserted.id);
  }

  console.log("News:  /local-news/" + SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
