"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { events } from "@/db/schema";
import { getSiteUrl } from "@/lib/env";
import { shortToken, slugify } from "@/lib/slug";
import {
  SubmissionRejected,
  assertSubmissionAllowed,
  getCityId,
  getClientIp,
  getUserAgent,
  hashIp,
  isHoneypotTriggered,
  logSubmission,
  notifyAdminOfSubmission,
  notifySubmitterOfReceipt,
  readBool,
  readField,
  verifyHCaptcha,
} from "@/lib/submissions";

const ROUTE = "/submit/event";

function parseIstDateTime(raw: string): Date {
  // <input type="datetime-local"> returns "YYYY-MM-DDTHH:MM" with no zone.
  // Treat as Asia/Kolkata local time (+05:30).
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) throw new SubmissionRejected("validation", "Invalid date/time.");
  const [, y, mo, d, h, mi] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:00+05:30`);
}

export async function submitEventAction(formData: FormData): Promise<void> {
  let titleForRedirect = "";
  try {
    if (isHoneypotTriggered(formData)) {
      throw new SubmissionRejected("honeypot", "Spam blocked.");
    }

    const ip = await getClientIp();
    const ipHash = hashIp(ip);
    await assertSubmissionAllowed(ROUTE, ipHash);

    const captchaToken = formData.get("h-captcha-response");
    const captchaOk = await verifyHCaptcha(
      typeof captchaToken === "string" ? captchaToken : null,
    );
    if (!captchaOk) {
      throw new SubmissionRejected("captcha", "Captcha failed. Try again.");
    }

    const title = readField(formData, "title", {
      required: true,
      max: 160,
      label: "Event title",
    });
    titleForRedirect = title;
    const description = readField(formData, "description", {
      max: 4000,
      label: "Description",
    });
    const startsAtRaw = readField(formData, "starts_at", {
      required: true,
      label: "Start date/time",
    });
    const endsAtRaw = readField(formData, "ends_at");
    const allDay = readBool(formData, "all_day");
    const venueName = readField(formData, "venue_name", { max: 120 });
    const venueAddress = readField(formData, "venue_address", { max: 240 });
    const locality = readField(formData, "locality", { max: 80 });
    const submitterName = readField(formData, "submitter_name", { max: 80 });
    const submitterPhone = readField(formData, "submitter_phone", { max: 24 });
    const submitterEmail = readField(formData, "submitter_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
    });

    const startsAt = parseIstDateTime(startsAtRaw);
    const endsAt = endsAtRaw ? parseIstDateTime(endsAtRaw) : null;

    const db = getDb();
    const cityId = await getCityId();

    const baseSlug = slugify(title) || `event-${shortToken(6)}`;
    const slug = `${baseSlug}-${shortToken(4)}`;

    const [row] = await db
      .insert(events)
      .values({
        cityId,
        slug,
        title,
        description: description || null,
        startsAt,
        endsAt,
        allDay,
        venueName: venueName || null,
        venueAddress: venueAddress || null,
        localityLabel: locality || null,
        status: "draft" as const,
        featured: false,
        source: "web" as const,
        submittedByName: submitterName || null,
        submittedByEmail: submitterEmail || null,
        submittedByPhone: submitterPhone || null,
        submittedAt: new Date(),
      })
      .returning({ id: events.id });

    await logSubmission({
      route: ROUTE,
      entityType: "event",
      entityId: row.id,
      ipHash,
      userAgent: await getUserAgent(),
    });

    const adminUrl = `${getSiteUrl()}/admin/queue?type=event`;
    await Promise.all([
      notifyAdminOfSubmission({
        entityType: "event",
        title,
        submitterName,
        submitterEmail,
        submitterPhone,
        adminUrl,
      }),
      notifySubmitterOfReceipt({
        entityType: "event",
        title,
        submitterName,
        submitterEmail,
        submitterPhone,
        adminUrl,
      }),
    ]);
  } catch (e) {
    if (e instanceof SubmissionRejected) {
      const params = new URLSearchParams({ err: e.code, msg: e.message });
      redirect(`/submit/event?${params.toString()}`);
    }
    throw e;
  }

  const out = new URLSearchParams({ kind: "event", title: titleForRedirect });
  redirect(`/submit/thanks?${out.toString()}`);
}
