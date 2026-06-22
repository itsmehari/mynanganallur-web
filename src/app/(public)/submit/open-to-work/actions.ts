"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { openToWorkProfiles } from "@/db/schema";
import { getSiteUrl } from "@/lib/env";
import { slugify, shortToken } from "@/lib/slug";
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
  readField,
  readOptionalInt,
  verifyHCaptcha,
} from "@/lib/submissions";

const ROUTE = "/submit/open-to-work";

function readWorkModes(formData: FormData): string {
  const modes = ["remote", "hybrid", "onsite"]
    .filter((m) => formData.get(`mode_${m}`) === "on")
    .join(",");
  return modes || readField(formData, "work_mode_preferences", { max: 80 }) || "hybrid";
}

export async function submitOpenToWorkAction(formData: FormData): Promise<void> {
  let headlineForRedirect = "";
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

    const displayName = readField(formData, "display_name", {
      required: true,
      max: 80,
      label: "Your name",
    });
    const headline = readField(formData, "headline", {
      required: true,
      max: 140,
      label: "Headline",
    });
    headlineForRedirect = headline;
    const body = readField(formData, "body", {
      required: true,
      max: 6000,
      label: "Profile summary",
    });
    const domainsLabel = readField(formData, "domains_label", { max: 120 });
    const preferredLocations = readField(formData, "preferred_locations", {
      required: true,
      max: 200,
      label: "Preferred locations",
    });
    const workModePreferences = readWorkModes(formData);
    const yearsExperience = readOptionalInt(formData, "years_experience");
    if (yearsExperience != null && (yearsExperience < 0 || yearsExperience > 50)) {
      throw new SubmissionRejected("validation", "Experience must be between 0 and 50 years.");
    }

    const contactEmail = readField(formData, "contact_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
      label: "Contact email",
    });
    const contactPhone = readField(formData, "contact_phone", { max: 24 });
    const linkedInUrl = readField(formData, "linkedin_url", { max: 300 });
    const facebookUrl = readField(formData, "facebook_url", { max: 300 });
    const sourcePostUrl = readField(formData, "source_post_url", { max: 300 });
    const resumeUrl = readField(formData, "resume_url", { max: 300 });

    if (!contactEmail && !contactPhone && !linkedInUrl && !facebookUrl) {
      throw new SubmissionRejected(
        "validation",
        "Add at least one contact method: email, phone, LinkedIn, or Facebook.",
      );
    }

    const submitterName = readField(formData, "submitter_name", { max: 80 });
    const submitterPhone = readField(formData, "submitter_phone", { max: 24 });
    const submitterEmail = readField(formData, "submitter_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
    });

    const db = getDb();
    const cityId = await getCityId();

    const baseSlug = slugify(`${displayName}-${headline}`) || `profile-${shortToken(6)}`;
    const slug = `${baseSlug}-${shortToken(4)}`;

    const [profile] = await db
      .insert(openToWorkProfiles)
      .values({
        cityId,
        slug,
        displayName,
        headline,
        body,
        domainsLabel: domainsLabel || null,
        preferredLocations,
        workModePreferences,
        yearsExperience,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        linkedInUrl: linkedInUrl || null,
        facebookUrl: facebookUrl || null,
        sourcePostUrl: sourcePostUrl || null,
        resumeUrl: resumeUrl || null,
        status: "draft",
        featured: false,
        source: "web",
        submittedByName: submitterName || displayName,
        submittedByEmail: submitterEmail || contactEmail || null,
        submittedByPhone: submitterPhone || contactPhone || null,
        submittedAt: new Date(),
      })
      .returning({ id: openToWorkProfiles.id });

    await logSubmission({
      route: ROUTE,
      entityType: "open_to_work",
      entityId: profile.id,
      ipHash,
      userAgent: await getUserAgent(),
    });

    const adminUrl = `${getSiteUrl()}/admin/queue?type=open_to_work`;
    await Promise.all([
      notifyAdminOfSubmission({
        entityType: "open_to_work",
        title: `${displayName} — ${headline}`,
        submitterName: submitterName || displayName,
        submitterEmail: submitterEmail || contactEmail,
        submitterPhone: submitterPhone || contactPhone,
        adminUrl,
      }),
      notifySubmitterOfReceipt({
        entityType: "open_to_work",
        title: headline,
        submitterName: submitterName || displayName,
        submitterEmail: submitterEmail || contactEmail,
        submitterPhone: submitterPhone || contactPhone,
        adminUrl,
      }),
    ]);
  } catch (e) {
    if (e instanceof SubmissionRejected) {
      const params = new URLSearchParams({ err: e.code, msg: e.message });
      redirect(`/submit/open-to-work?${params.toString()}`);
    }
    throw e;
  }

  const out = new URLSearchParams({ kind: "open_to_work", title: headlineForRedirect });
  redirect(`/submit/thanks?${out.toString()}`);
}
