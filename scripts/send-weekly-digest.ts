/**
 * Weekly digest of Nanganallur news / events / jobs / properties.
 * Sent every Sunday morning to confirmed newsletter_subscribers.
 *
 *   npm run cron:weekly-digest:live
 */
import { config as loadEnv } from "dotenv";
import { and, desc, eq, gte, isNotNull, isNull } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  articles,
  events,
  jobPostings,
  newsletterSubscribers,
  propertyListings,
} from "../src/db/schema";
import * as schema from "../src/db/schema";

loadEnv({ path: ".env.production.local" });
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "mynanganallur.in <hello@mynanganallur.in>";
  if (!apiKey) {
    console.info("[email:dev]", subject, "->", to);
    return;
  }
  const r = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!r.ok) {
    console.warn("[email] failed", r.status, await r.text());
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function buildBody(): Promise<{ subject: string; html: string }> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [arts, evts, jobs, props] = await Promise.all([
    db
      .select({
        title: articles.title,
        slug: articles.slug,
        summary: articles.summary,
      })
      .from(articles)
      .where(and(eq(articles.status, "published"), gte(articles.publishedAt, since)))
      .orderBy(desc(articles.publishedAt))
      .limit(5),
    db
      .select({
        title: events.title,
        slug: events.slug,
        startsAt: events.startsAt,
      })
      .from(events)
      .where(eq(events.status, "scheduled"))
      .orderBy(events.startsAt)
      .limit(5),
    db
      .select({
        title: jobPostings.title,
        slug: jobPostings.slug,
      })
      .from(jobPostings)
      .where(eq(jobPostings.status, "open"))
      .orderBy(desc(jobPostings.createdAt))
      .limit(5),
    db
      .select({
        title: propertyListings.title,
        slug: propertyListings.slug,
      })
      .from(propertyListings)
      .where(eq(propertyListings.status, "published"))
      .orderBy(desc(propertyListings.createdAt))
      .limit(5),
  ]);

  const sections: string[] = [];

  function section(title: string, items: string[]) {
    if (!items.length) return;
    sections.push(
      `<h2 style="font-family:Poppins,sans-serif;font-size:18px;margin:20px 0 8px">${escapeHtml(title)}</h2><ul>${items.join("")}</ul>`,
    );
  }

  section(
    "This week in Nanganallur",
    arts.map(
      (a) =>
        `<li><a href="${SITE}/local-news/${a.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(a.title)}</a>${a.summary ? ` — <span style="color:#555">${escapeHtml(a.summary.slice(0, 120))}</span>` : ""}</li>`,
    ),
  );
  section(
    "Upcoming events",
    evts.map(
      (e) =>
        `<li><a href="${SITE}/local-events/${e.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(e.title)}</a></li>`,
    ),
  );
  section(
    "Fresh jobs",
    jobs.map(
      (j) =>
        `<li><a href="${SITE}/jobs/${j.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(j.title)}</a></li>`,
    ),
  );
  section(
    "Properties",
    props.map(
      (p) =>
        `<li><a href="${SITE}/properties/${p.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(p.title)}</a></li>`,
    ),
  );

  if (sections.length === 0) {
    return { subject: "", html: "" };
  }

  const subject = `Nanganallur weekly · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto">
    <h1 style="font-family:Poppins,sans-serif;font-size:22px;margin:0 0 4px">mynanganallur.in weekly</h1>
    <p style="color:#666;font-size:13px;margin:0 0 12px">5-minute read · curated for Nanganallur and around</p>
    ${sections.join("")}
    <hr style="margin:24px 0;border:0;border-top:1px solid #eee">
    <p style="color:#888;font-size:12px">You receive this because you subscribed at mynanganallur.in.<br>
    <a href="{{UNSUB}}">Unsubscribe</a></p>
  </div>`;

  return { subject, html };
}

async function main() {
  const { subject, html } = await buildBody();
  if (!subject) {
    console.log("Nothing to send this week.");
    return;
  }

  const subs = await db
    .select({ email: newsletterSubscribers.email })
    .from(newsletterSubscribers)
    .where(
      and(
        isNotNull(newsletterSubscribers.confirmedAt),
        isNull(newsletterSubscribers.unsubscribedAt),
      ),
    );

  console.log(`Sending to ${subs.length} subscribers…`);
  for (const s of subs) {
    const personal = html.replace(
      "{{UNSUB}}",
      `${SITE}/api/newsletter/unsubscribe?email=${encodeURIComponent(s.email)}`,
    );
    await sendEmail(s.email, subject, personal);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
