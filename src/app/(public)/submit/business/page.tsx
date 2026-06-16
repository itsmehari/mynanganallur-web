import type { Metadata } from "next";
import { HCaptchaWidget } from "@/components/forms/hcaptcha";
import {
  FormStatus,
  HoneypotField,
  PhoneField,
  SelectField,
  SubmitButton,
  TextField,
} from "@/components/forms";
import { buildPageMetadata } from "@/lib/seo/hub-page-metadata";
import { submitBusinessAction } from "./actions";

export const metadata: Metadata = buildPageMetadata({
  path: "/submit/business",
  title: "List your business",
  description:
    "Add your shop, school, tuition, clinic, restaurant, ATM, or temple to the mynanganallur.in local directory. Free, reviewed within 24 hours.",
});

const TYPE_OPTIONS = [
  { value: "tutor", label: "Tuition / coaching / tutor" },
  { value: "restaurant", label: "Restaurant / cafe" },
  { value: "school", label: "School / college" },
  { value: "hospital", label: "Hospital / clinic" },
  { value: "bank", label: "Bank" },
  { value: "atm", label: "ATM" },
  { value: "park", label: "Park" },
  { value: "temple", label: "Temple / place of worship" },
  { value: "it_company", label: "IT company" },
  { value: "it_park", label: "IT park" },
  { value: "government_office", label: "Government office" },
  { value: "industry", label: "Other business" },
];

type PageProps = {
  searchParams: Promise<{ err?: string; msg?: string }>;
};

export default async function SubmitBusinessPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <form action={submitBusinessAction} className="space-y-6">
      <FormStatus status={sp.err ? "error" : undefined} message={sp.msg} />
      <HoneypotField />

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-[var(--foreground)]">
          About the business
        </legend>
        <TextField
          id="name"
          label="Business / place name"
          required
          maxLength={140}
        />
        <SelectField
          id="type"
          label="Type"
          required
          emptyLabel="Select a type"
          options={TYPE_OPTIONS}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Where & when
        </legend>
        <TextField
          id="address"
          label="Address"
          placeholder="e.g. #50 Ganesh Nagar Main Road, Puzhuthivakkam"
          maxLength={240}
        />
        <TextField
          id="locality"
          label="Locality / area"
          placeholder="e.g. Madipakkam"
          maxLength={80}
        />
        <TextField
          id="hours"
          label="Hours summary (optional)"
          placeholder="e.g. Mon–Sat 9 AM–9 PM"
          maxLength={240}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Public contact
        </legend>
        <PhoneField id="phone" label="Phone" />
        <TextField
          id="website"
          label="Website (optional)"
          type="url"
          placeholder="https://example.com"
          maxLength={240}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Your login (private — manage listings later)
        </legend>
        <TextField id="submitter_name" label="Your name" maxLength={80} />
        <PhoneField id="submitter_phone" label="Your mobile" required />
        <TextField
          id="submitter_email"
          label="Your email"
          type="email"
          required
          maxLength={120}
          hint="We email a login code to this address. Use the same email + phone to sign in at /my/login."
        />
      </fieldset>

      <div>
        <HCaptchaWidget />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-[var(--muted)]">
          Verified listings get a badge after we cross-check details.
        </p>
        <SubmitButton label="Submit business" />
      </div>
    </form>
  );
}
