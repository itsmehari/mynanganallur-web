import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FormStatus,
  PhoneField,
  SubmitButton,
  TextField,
} from "@/components/forms";
import { getListingOwnerSession } from "@/lib/listing-owner/auth";
import { formatPhoneDisplay } from "@/lib/listing-owner/phone";
import { ownerLoginFormAction } from "./actions";

export const metadata: Metadata = {
  title: "Manage my listings · Sign in",
  description:
    "Sign in with your email and mobile number to update your business listings on mynanganallur.in.",
};

type Props = {
  searchParams: Promise<{
    step?: string;
    email?: string;
    phone?: string;
    returnTo?: string;
    err?: string;
    msg?: string;
  }>;
};

export default async function ListingOwnerLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await getListingOwnerSession();
  const returnTo = sp.returnTo?.startsWith("/my/")
    ? sp.returnTo
    : "/my/listings";

  if (session) {
    redirect(returnTo);
  }

  const isVerify = sp.step === "verify" && sp.email && sp.phone;

  return (
    <div className="mx-auto max-w-[480px] px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        Business listings
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {isVerify ? "Enter login code" : "Sign in to manage listings"}
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {isVerify
          ? `We emailed a 6-digit code to ${sp.email}. Your login pair is that email plus ${formatPhoneDisplay(sp.phone!)}.`
          : "Use the same email and mobile number you gave when you listed your business."}
      </p>

      <form action={ownerLoginFormAction} className="mt-8 space-y-5">
        <FormStatus status={sp.err ? "error" : undefined} message={sp.msg} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <input type="hidden" name="step" value={isVerify ? "verify" : "request"} />

        {isVerify ? (
          <>
            <input type="hidden" name="email" value={sp.email ?? ""} />
            <input type="hidden" name="phone" value={sp.phone ?? ""} />
            <TextField
              id="code"
              label="6-digit code"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              hint="Check your inbox (and spam folder)."
            />
          </>
        ) : (
          <>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              defaultValue={sp.email}
            />
            <PhoneField
              id="phone"
              name="phone"
              label="Mobile number"
              required
              defaultValue={sp.phone}
              hint="Same number you used when submitting your business."
            />
          </>
        )}

        <SubmitButton
          label={isVerify ? "Verify & sign in" : "Email me a login code"}
        />
      </form>

      <p className="mt-8 text-sm text-[var(--muted)]">
        {isVerify ? (
          <Link
            href={`/my/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            ← Use a different email or phone
          </Link>
        ) : (
          <>
            No account yet?{" "}
            <Link
              href="/submit/business"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              List your business
            </Link>{" "}
            first with your email and phone.
          </>
        )}
      </p>
    </div>
  );
}
