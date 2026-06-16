"use server";

import { and, desc, eq, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { listingOwnerOtps, users } from "@/db/schema/auth";
import { findListingOwnerByCredentials } from "@/lib/listing-owner/accounts";
import { sendOwnerLoginOtp } from "@/lib/listing-owner/email";
import {
  generateOtpCode,
  hashOtp,
  otpExpiresAt,
  verifyOtpCode,
} from "@/lib/listing-owner/otp";
import {
  formatPhoneDisplay,
  normalizeEmail,
  normalizePhone,
} from "@/lib/listing-owner/phone";
import {
  createListingOwnerSession,
  setListingOwnerCookie,
} from "@/lib/listing-owner/session";
import { OwnerAuthError } from "@/lib/listing-owner/errors";

function safeReturnTo(raw: string | null): string {
  if (!raw?.startsWith("/my/")) return "/my/listings";
  return raw;
}

export async function requestOwnerOtpAction(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const returnTo = safeReturnTo(String(formData.get("returnTo") ?? ""));

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new OwnerAuthError("validation", "Enter a valid email address.");
  }
  if (!phone) {
    throw new OwnerAuthError("validation", "Enter a valid 10-digit mobile number.");
  }

  const owner = await findListingOwnerByCredentials(email, phone);
  if (!owner) {
    throw new OwnerAuthError(
      "not_found",
      "No account found for this email and phone pair. List your business first, using the same contact details.",
    );
  }

  const db = getDb();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db
    .select({ id: listingOwnerOtps.id })
    .from(listingOwnerOtps)
    .where(
      and(
        eq(listingOwnerOtps.email, email),
        eq(listingOwnerOtps.phone, phone),
        gte(listingOwnerOtps.createdAt, since),
      ),
    );
  if (recent.length >= 5) {
    throw new OwnerAuthError(
      "rate_limit",
      "Too many login codes requested. Try again in an hour.",
    );
  }

  const code = generateOtpCode();
  await db.insert(listingOwnerOtps).values({
    email,
    phone,
    codeHash: hashOtp(code),
    expiresAt: otpExpiresAt(),
  });

  await sendOwnerLoginOtp({
    to: email,
    code,
    phoneDisplay: formatPhoneDisplay(phone),
  });

  const params = new URLSearchParams({
    step: "verify",
    email,
    phone,
    returnTo,
  });
  redirect(`/my/login?${params.toString()}`);
}

export async function verifyOwnerOtpAction(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const code = String(formData.get("code") ?? "").trim();
  const returnTo = safeReturnTo(String(formData.get("returnTo") ?? ""));

  if (!email || !phone || code.length !== 6) {
    throw new OwnerAuthError("validation", "Enter the 6-digit code from your email.");
  }

  const owner = await findListingOwnerByCredentials(email, phone);
  if (!owner) {
    throw new OwnerAuthError("not_found", "Account not found. Check email and phone.");
  }

  const db = getDb();
  const rows = await db
    .select({
      id: listingOwnerOtps.id,
      codeHash: listingOwnerOtps.codeHash,
      expiresAt: listingOwnerOtps.expiresAt,
    })
    .from(listingOwnerOtps)
    .where(and(eq(listingOwnerOtps.email, email), eq(listingOwnerOtps.phone, phone)))
    .orderBy(desc(listingOwnerOtps.createdAt))
    .limit(5);

  const match = rows.find(
    (r) => r.expiresAt >= new Date() && verifyOtpCode(code, r.codeHash),
  );
  if (!match) {
    throw new OwnerAuthError("invalid_code", "Invalid or expired code. Request a new one.");
  }

  await db
    .delete(listingOwnerOtps)
    .where(and(eq(listingOwnerOtps.email, email), eq(listingOwnerOtps.phone, phone)));

  await db
    .update(users)
    .set({ phoneVerified: new Date(), emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.id, owner.id));

  const sessionToken = await createListingOwnerSession(owner.id);
  await setListingOwnerCookie(sessionToken);
  redirect(returnTo);
}

export async function ownerLoginFormAction(
  formData: FormData,
): Promise<void> {
  const step = String(formData.get("step") ?? "request");
  try {
    if (step === "verify") {
      await verifyOwnerOtpAction(formData);
    } else {
      await requestOwnerOtpAction(formData);
    }
  } catch (e) {
    if (e instanceof OwnerAuthError) {
      const params = new URLSearchParams({
        err: e.code,
        msg: e.message,
        step: step === "verify" ? "verify" : "request",
      });
      const email = String(formData.get("email") ?? "");
      const phone = String(formData.get("phone") ?? "");
      const returnTo = String(formData.get("returnTo") ?? "");
      if (email) params.set("email", email);
      if (phone) params.set("phone", phone);
      if (returnTo) params.set("returnTo", returnTo);
      redirect(`/my/login?${params.toString()}`);
    }
    throw e;
  }
}
