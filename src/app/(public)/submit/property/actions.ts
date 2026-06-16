"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { propertyListings } from "@/db/schema";
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
  readOptionalInt,
  verifyHCaptcha,
} from "@/lib/submissions";

const ROUTE = "/submit/property";

const ALLOWED_KIND = new Set(["rent", "sale", "other"] as const);
const ALLOWED_FURNISHING = new Set([
  "unfurnished",
  "semi_furnished",
  "fully_furnished",
  "unspecified",
] as const);

type Kind = "rent" | "sale" | "other";
type Furnishing =
  | "unfurnished"
  | "semi_furnished"
  | "fully_furnished"
  | "unspecified";

export async function submitPropertyAction(formData: FormData): Promise<void> {
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
      label: "Listing title",
    });
    titleForRedirect = title;
    const summary = readField(formData, "summary", { max: 240 });
    const body = readField(formData, "body", {
      required: true,
      max: 6000,
      label: "Description",
    });
    const kindRaw = readField(formData, "kind", { required: true });
    if (!ALLOWED_KIND.has(kindRaw as Kind)) {
      throw new SubmissionRejected("validation", "Unsupported listing kind.");
    }
    const kind = kindRaw as Kind;
    const furnishingRaw =
      readField(formData, "furnishing") || "unspecified";
    if (!ALLOWED_FURNISHING.has(furnishingRaw as Furnishing)) {
      throw new SubmissionRejected("validation", "Bad furnishing value.");
    }
    const furnishing = furnishingRaw as Furnishing;
    const locality = readField(formData, "locality", { max: 80 });
    const landmark = readField(formData, "landmark", { max: 240 });
    const bedrooms = readOptionalInt(formData, "bedrooms");
    const bathrooms = readOptionalInt(formData, "bathrooms");
    const areaSqft = readOptionalInt(formData, "area_sqft");
    const floorLabel = readField(formData, "floor_label", { max: 80 });
    const facing = readField(formData, "facing", { max: 80 });
    const parkingSummary = readField(formData, "parking_summary", { max: 120 });
    const rentPerMonth =
      kind === "rent" ? readOptionalInt(formData, "rent_per_month") : null;
    const salePrice =
      kind === "sale" ? readOptionalInt(formData, "sale_price") : null;
    const advanceMonths =
      kind === "rent" ? readOptionalInt(formData, "advance_months") : null;
    const vegetarianHouseholdOnly = readBool(formData, "vegetarian_only");
    const contactPhone = readField(formData, "contact_phone", {
      required: true,
      max: 24,
      label: "Contact phone",
    });
    const contactEmail = readField(formData, "contact_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
    });
    const submitterName = readField(formData, "submitter_name", { max: 80 });
    const submitterEmail = readField(formData, "submitter_email", {
      max: 120,
      pattern: /^\S+@\S+\.\S+$/,
    });
    const submitterPhone = readField(formData, "submitter_phone", { max: 24 });

    const db = getDb();
    const cityId = await getCityId();

    const baseSlug = slugify(title) || `prop-${shortToken(6)}`;
    const slug = `${baseSlug}-${shortToken(4)}`;

    const [row] = await db
      .insert(propertyListings)
      .values({
        cityId,
        slug,
        title,
        summary: summary || null,
        body,
        kind,
        status: "draft" as const,
        localityLabel: locality || null,
        landmarkNote: landmark || null,
        rentPerMonth,
        salePrice,
        advanceMonths,
        bedrooms,
        bathrooms,
        areaSqft,
        floorLabel: floorLabel || null,
        facing: facing || null,
        parkingSummary: parkingSummary || null,
        furnishing,
        vegetarianHouseholdOnly,
        contactPhone,
        contactEmail: contactEmail || null,
        listingSource: "reader_submitted",
        source: "web" as const,
        submittedByName: submitterName || null,
        submittedByEmail: submitterEmail || null,
        submittedByPhone: submitterPhone || null,
        submittedAt: new Date(),
      })
      .returning({ id: propertyListings.id });

    await logSubmission({
      route: ROUTE,
      entityType: "property",
      entityId: row.id,
      ipHash,
      userAgent: await getUserAgent(),
    });

    const adminUrl = `${getSiteUrl()}/admin/queue?type=property`;
    await Promise.all([
      notifyAdminOfSubmission({
        entityType: "property",
        title,
        submitterName,
        submitterEmail,
        submitterPhone,
        adminUrl,
      }),
      notifySubmitterOfReceipt({
        entityType: "property",
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
      redirect(`/submit/property?${params.toString()}`);
    }
    throw e;
  }

  const out = new URLSearchParams({ kind: "property", title: titleForRedirect });
  redirect(`/submit/thanks?${out.toString()}`);
}
