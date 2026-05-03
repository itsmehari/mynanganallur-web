"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { employers, jobPostings } from "@/db/schema";
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

const ROUTE = "/submit/job";

export async function submitJobAction(formData: FormData): Promise<void> {
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

    const employerName = readField(formData, "employer", {
      required: true,
      max: 120,
      label: "Employer name",
    });
    const title = readField(formData, "title", {
      required: true,
      max: 140,
      label: "Job title",
    });
    titleForRedirect = title;
    const body = readField(formData, "body", {
      required: true,
      max: 6000,
      label: "Job description",
    });
    const locality = readField(formData, "locality", { max: 80 });
    const remotePolicy = readField(formData, "remote_policy", { max: 24 }) || "onsite";
    const salaryMin = readOptionalInt(formData, "salary_min");
    const salaryMax = readOptionalInt(formData, "salary_max");
    const contactPhone = readField(formData, "contact_phone", {
      required: true,
      max: 24,
      label: "Contact phone",
    });
    const contactEmail = readField(formData, "contact_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
      label: "Contact email",
    });
    const submitterName = readField(formData, "submitter_name", { max: 80 });
    const submitterPhone = readField(formData, "submitter_phone", { max: 24 });
    const submitterEmail = readField(formData, "submitter_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
    });

    const db = getDb();
    const cityId = await getCityId();

    const employerSlug = slugify(employerName);
    let employerId: string;
    const [existingEmp] = await db
      .select({ id: employers.id })
      .from(employers)
      .where(eq(employers.slug, employerSlug))
      .limit(1);
    if (existingEmp) {
      employerId = existingEmp.id;
    } else {
      const [ins] = await db
        .insert(employers)
        .values({ name: employerName, slug: employerSlug })
        .returning({ id: employers.id });
      employerId = ins.id;
    }

    const baseSlug = slugify(`${title}-${employerName}`) || `job-${shortToken(6)}`;
    const slug = `${baseSlug}-${shortToken(4)}`;

    const [job] = await db
      .insert(jobPostings)
      .values({
        employerId,
        cityId,
        slug,
        title,
        body,
        locationLabel: locality || null,
        salaryMin,
        salaryMax,
        salaryDisclosed: salaryMin != null || salaryMax != null,
        remotePolicy,
        contactPhone: contactPhone || null,
        contactEmail: contactEmail || null,
        status: "draft" as const,
        featured: false,
        source: "web" as const,
        submittedByName: submitterName || null,
        submittedByEmail: submitterEmail || null,
        submittedByPhone: submitterPhone || null,
        submittedAt: new Date(),
      })
      .returning({ id: jobPostings.id });

    await logSubmission({
      route: ROUTE,
      entityType: "job",
      entityId: job.id,
      ipHash,
      userAgent: await getUserAgent(),
    });

    const adminUrl = `${getSiteUrl()}/admin/queue?type=job`;
    await Promise.all([
      notifyAdminOfSubmission({
        entityType: "job",
        title,
        submitterName,
        submitterEmail,
        submitterPhone,
        adminUrl,
      }),
      notifySubmitterOfReceipt({
        entityType: "job",
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
      redirect(`/submit/job?${params.toString()}`);
    }
    throw e;
  }

  const out = new URLSearchParams({ kind: "job", title: titleForRedirect });
  redirect(`/submit/thanks?${out.toString()}`);
}
