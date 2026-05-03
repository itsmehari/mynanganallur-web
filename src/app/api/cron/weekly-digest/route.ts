import { NextResponse } from "next/server";
import { and, desc, eq, gte, isNotNull, isNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  articles,
  events,
  jobPostings,
  newsletterSubscribers,
  propertyListings,
} from "@/db/schema";
import { getSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "mynanganallur.in <hello@mynanganallur.in>";
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

export async function GET(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected && auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const SITE = getSiteUrl();

  const [arts, evts, jobs, props, subs] = await Promise.all([
    db
      .select({ title: articles.title, slug: articles.slug, summary: articles.summary })
      .from(articles)
      .where(and(eq(articles.status, "published"), gte(articles.publishedAt, since)))
      .orderBy(desc(articles.publishedAt))
      .limit(5),
    db
      .select({ title: events.title, slug: events.slug })
      .from(events)
      .where(eq(events.status, "scheduled"))
      .orderBy(events.startsAt)
      .limit(5),
    db
      .select({ title: jobPostings.title, slug: jobPostings.slug })
      .from(jobPostings)
      .where(eq(jobPostings.status, "open"))
      .orderBy(desc(jobPostings.createdAt))
      .limit(5),
    db
      .select({ title: propertyListings.title, slug: propertyListings.slug })
      .from(propertyListings)
      .where(eq(propertyListings.status, "published"))
      .orderBy(desc(propertyListings.createdAt))
      .limit(5),
    db
      .select({ email: newsletterSubscribers.email })
      .from(newsletterSubscribers)
      .where(
        and(
          isNotNull(newsletterSubscribers.confirmedAt),
          isNull(newsletterSubscribers.unsubscribedAt),
        ),
      ),
  ]);

  if (arts.length + evts.length + jobs.length + props.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no content" });
  }

  const sections: string[] = [];
  function add(title: string, items: string[]) {
    if (!items.length) return;
    sections.push(
      `<h2 style="font-family:Poppins,sans-serif;font-size:18px;margin:20px 0 8px">${escapeHtml(title)}</h2><ul>${items.join("")}</ul>`,
    );
  }
  add(
    "This week in Nanganallur",
    arts.map(
      (a) =>
        `<li><a href="${SITE}/local-news/${a.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(a.title)}</a>${a.summary ? ` — <span style=\"color:#555\">${escapeHtml(a.summary.slice(0, 120))}</span>` : ""}</li>`,
    ),
  );
  add(
    "Upcoming events",
    evts.map(
      (e) =>
        `<li><a href="${SITE}/local-events/${e.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(e.title)}</a></li>`,
    ),
  );
  add(
    "Fresh jobs",
    jobs.map(
      (j) =>
        `<li><a href="${SITE}/jobs/${j.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(j.title)}</a></li>`,
    ),
  );
  add(
    "Properties",
    props.map(
      (p) =>
        `<li><a href="${SITE}/properties/${p.slug}?utm_source=newsletter&utm_medium=email">${escapeHtml(p.title)}</a></li>`,
    ),
  );

  const subject = `Nanganallur weekly · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  const baseHtml = `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto">
    <h1 style="font-family:Poppins,sans-serif;font-size:22px;margin:0 0 4px">mynanganallur.in weekly</h1>
    <p style="color:#666;font-size:13px;margin:0 0 12px">5-minute read · curated for Nanganallur and around</p>
    ${sections.join("")}
    <hr style="margin:24px 0;border:0;border-top:1px solid #eee">
    <p style="color:#888;font-size:12px">You receive this because you subscribed at mynanganallur.in.<br>
    <a href="{{UNSUB}}">Unsubscribe</a></p>
  </div>`;

  let sent = 0;
  for (const s of subs) {
    const personal = baseHtml.replace(
      "{{UNSUB}}",
      `${SITE}/api/newsletter/unsubscribe?email=${encodeURIComponent(s.email)}`,
    );
    try {
      await sendEmail(s.email, subject, personal);
      sent++;
    } catch (e) {
      console.warn("[weekly-digest] send failed", s.email, e);
    }
  }
  return NextResponse.json({ ok: true, sent });
}
