import type { Metadata } from "next";
import { HCaptchaWidget } from "@/components/forms/hcaptcha";
import {
  CheckboxField,
  FormStatus,
  HoneypotField,
  PhoneField,
  SelectField,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/forms";
import { submitPropertyAction } from "./actions";

export const metadata: Metadata = {
  title: "List your property",
  description:
    "List a flat, house, or commercial space for rent or sale on mynanganallur.in. Free, reviewed within 24 hours.",
};

const KIND_OPTIONS = [
  { value: "rent", label: "For rent" },
  { value: "sale", label: "For sale" },
  { value: "other", label: "Other" },
];

const FURNISHING_OPTIONS = [
  { value: "unspecified", label: "Not specified" },
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi_furnished", label: "Semi-furnished" },
  { value: "fully_furnished", label: "Fully furnished" },
];

type PageProps = {
  searchParams: Promise<{ err?: string; msg?: string }>;
};

export default async function SubmitPropertyPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <form action={submitPropertyAction} className="space-y-6">
      <FormStatus status={sp.err ? "error" : undefined} message={sp.msg} />
      <HoneypotField />

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-[var(--foreground)]">
          About the property
        </legend>
        <TextField
          id="title"
          label="Listing title"
          required
          placeholder="e.g. 2BHK flat near Anjaneyar Temple"
          maxLength={160}
        />
        <TextField
          id="summary"
          label="One-line summary (optional)"
          placeholder="e.g. Sunlit 2BHK, gated apartment, walk to temple."
          maxLength={240}
        />
        <TextArea
          id="body"
          label="Description"
          required
          rows={8}
          maxLength={6000}
          hint="House rules, parking, water timing, society fees — anything that helps a serious applicant decide."
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Type & price
        </legend>
        <SelectField
          id="kind"
          label="Listing kind"
          required
          options={KIND_OPTIONS}
          defaultValue="rent"
        />
        <SelectField
          id="furnishing"
          label="Furnishing"
          options={FURNISHING_OPTIONS}
          defaultValue="unspecified"
        />
        <TextField
          id="rent_per_month"
          label="Monthly rent (₹)"
          inputMode="numeric"
          placeholder="e.g. 22000"
        />
        <TextField
          id="advance_months"
          label="Advance (months)"
          inputMode="numeric"
          placeholder="e.g. 5"
        />
        <TextField
          id="sale_price"
          label="Asking price (₹) — for sale listings"
          inputMode="numeric"
          placeholder="e.g. 8500000"
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Specs
        </legend>
        <TextField id="bedrooms" label="Bedrooms" inputMode="numeric" />
        <TextField id="bathrooms" label="Bathrooms" inputMode="numeric" />
        <TextField
          id="area_sqft"
          label="Built-up area (sqft)"
          inputMode="numeric"
        />
        <div className="sm:col-span-3">
          <CheckboxField
            id="vegetarian_only"
            label="Vegetarian household only"
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Where
        </legend>
        <TextField
          id="locality"
          label="Locality / area"
          placeholder="e.g. Nanganallur"
          maxLength={80}
        />
        <TextField
          id="landmark"
          label="Nearest landmark"
          placeholder="e.g. behind Reliance Fresh"
          maxLength={240}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Public contact
        </legend>
        <PhoneField id="contact_phone" label="Contact phone" required />
        <TextField
          id="contact_email"
          label="Contact email (optional)"
          type="email"
          maxLength={120}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          About you (private — for review only)
        </legend>
        <TextField id="submitter_name" label="Your name" maxLength={80} />
        <PhoneField id="submitter_phone" label="Your phone" />
        <TextField
          id="submitter_email"
          label="Your email"
          type="email"
          maxLength={120}
        />
      </fieldset>

      <div>
        <HCaptchaWidget />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-[var(--muted)]">
          We screen for fraud before publishing. Photos can be added by our
          editor when you reply to the email.
        </p>
        <SubmitButton label="Submit listing" />
      </div>
    </form>
  );
}
