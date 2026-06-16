"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { directoryEntries } from "@/db/schema";
import { getSiteUrl } from "@/lib/env";
import { shortToken, slugify } from "@/lib/slug";
import { ensureListingOwnerAccount } from "@/lib/listing-owner/accounts";
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
  verifyHCaptcha,
} from "@/lib/submissions";

const ROUTE = "/submit/business";

const ALLOWED_TYPES = new Set([
  "bank",
  "school",
  "hospital",
  "park",
  "restaurant",
  "atm",
  "it_company",
  "it_park",
  "government_office",
  "industry",
  "temple",
  "tutor",
] as const);

type DirectoryType =
  | "bank"
  | "school"
  | "hospital"
  | "park"
  | "restaurant"
  | "atm"
  | "it_company"
  | "it_park"
  | "government_office"
  | "industry"
  | "temple"
  | "tutor";

export async function submitBusinessAction(formData: FormData): Promise<void> {
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

    const name = readField(formData, "name", {
      required: true,
      max: 140,
      label: "Business name",
    });
    titleForRedirect = name;
    const typeRaw = readField(formData, "type", {
      required: true,
      label: "Business type",
    });
    if (!ALLOWED_TYPES.has(typeRaw as DirectoryType)) {
      throw new SubmissionRejected("validation", "Unsupported business type.");
    }
    const type = typeRaw as DirectoryType;
    const address = readField(formData, "address", { max: 240 });
    const locality = readField(formData, "locality", { max: 80 });
    const phone = readField(formData, "phone", { max: 24 });
    const website = readField(formData, "website", { max: 240 });
    const hours = readField(formData, "hours", { max: 240 });
    const submitterName = readField(formData, "submitter_name", { max: 80 });
    const submitterPhone = readField(formData, "submitter_phone", {
      required: true,
      max: 24,
      label: "Your phone",
    });
    const submitterEmail = readField(formData, "submitter_email", {
      required: true,
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
      label: "Your email",
    });

    const ownerUserId = await ensureListingOwnerAccount({
      email: submitterEmail,
      phone: submitterPhone,
      name: submitterName,
    }).catch((err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Could not create owner account.";
      throw new SubmissionRejected("validation", msg);
    });

    const db = getDb();
    const cityId = await getCityId();

    const baseSlug = slugify(name) || `dir-${shortToken(6)}`;
    const slug = `${baseSlug}-${shortToken(4)}`;

    const [row] = await db
      .insert(directoryEntries)
      .values({
        cityId,
        type,
        name,
        slug,
        address: address || null,
        localityLabel: locality || null,
        phone: phone || null,
        websiteUrl: website || null,
        verified: false,
        hoursSummary: hours || null,
        ownerUserId,
        source: "web" as const,
        submittedByName: submitterName || null,
        submittedByEmail: submitterEmail || null,
        submittedByPhone: submitterPhone || null,
        submittedAt: new Date(),
      })
      .returning({ id: directoryEntries.id });

    await logSubmission({
      route: ROUTE,
      entityType: "directory",
      entityId: row.id,
      ipHash,
      userAgent: await getUserAgent(),
    });

    const adminUrl = `${getSiteUrl()}/admin/queue?type=directory`;
    await Promise.all([
      notifyAdminOfSubmission({
        entityType: "business",
        title: name,
        submitterName,
        submitterEmail,
        submitterPhone,
        adminUrl,
      }),
      notifySubmitterOfReceipt({
        entityType: "business",
        title: name,
        submitterName,
        submitterEmail,
        submitterPhone,
        adminUrl,
      }),
    ]);
  } catch (e) {
    if (e instanceof SubmissionRejected) {
      const params = new URLSearchParams({ err: e.code, msg: e.message });
      redirect(`/submit/business?${params.toString()}`);
    }
    if (e instanceof Error && e.message.includes("different phone")) {
      const params = new URLSearchParams({
        err: "validation",
        msg: e.message,
      });
      redirect(`/submit/business?${params.toString()}`);
    }
    throw e;
  }

  const out = new URLSearchParams({ kind: "business", title: titleForRedirect });
  redirect(`/submit/thanks?${out.toString()}`);
}
