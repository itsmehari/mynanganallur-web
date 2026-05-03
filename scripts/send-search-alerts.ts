/**
 * Nightly digest of new matches for saved search_alerts rows.
 *
 * Run locally:  `npm run cron:search-alerts:live`
 * Or trigger via Vercel cron at /api/cron/search-alerts (Phase 5+).
 */
import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { searchAlerts } from "../src/db/schema";
import * as schema from "../src/db/schema";
import { searchAcross, type SearchEntity } from "../src/domains/search";

loadEnv({ path: ".env.production.local" });
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "mynanganallur.in <hello@mynanganallur.in>";
  if (!apiKey) {
    console.info("[email:dev]", subject, "->", to);
    return;
  }
  await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
}

async function main() {
  const alerts = await db.select().from(searchAlerts).limit(1000);
  for (const a of alerts) {
    try {
      const entityType = (a.entityType || "jobs") as
        | "article"
        | "event"
        | "job"
        | "property"
        | "directory";
      const t = entityToSingular(entityType);
      const results = await searchAcross({
        q: a.query,
        locality: a.locality,
        type: t,
        limit: 8,
      });
      const hits = (results.hits[t] ?? []).slice(0, 5);
      if (hits.length === 0) continue;

      const html = `<p>New matches for your saved search <strong>${escapeHtml(
        a.query ?? "(no query)",
      )}</strong>${a.locality ? ` near <strong>${escapeHtml(a.locality)}</strong>` : ""}:</p>
      <ul>${hits
        .map(
          (h) =>
            `<li><a href="https://mynanganallur.in${h.href}">${escapeHtml(h.title)}</a></li>`,
        )
        .join("")}</ul>
      <p style="font-size:12px;color:#666">You're receiving this because you saved an alert on mynanganallur.in.</p>`;

      await sendEmail(
        a.email,
        `New ${t} matches near Nanganallur`,
        html,
      );
      await db
        .update(searchAlerts)
        .set({ lastSentAt: new Date() })
        .where(eq(searchAlerts.id, a.id));
    } catch (e) {
      console.warn("[search-alert]", a.id, e);
    }
  }
  console.log(`Done — processed ${alerts.length} alerts.`);
}

function entityToSingular(t: string): SearchEntity {
  if (t === "article" || t === "articles") return "article";
  if (t === "event" || t === "events") return "event";
  if (t === "job" || t === "jobs") return "job";
  if (t === "property" || t === "properties") return "property";
  return "directory";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
