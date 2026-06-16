import type { Metadata } from "next";
import { HCaptchaWidget } from "@/components/forms/hcaptcha";
import {
  FormStatus,
  HoneypotField,
  PhoneField,
  SelectField,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/forms";
import { buildPageMetadata } from "@/lib/seo/hub-page-metadata";
import { submitJobAction } from "./actions";

export const metadata: Metadata = buildPageMetadata({
  path: "/submit/job",
  title: "Post a job",
  description:
    "Hire help locally — list your opening on mynanganallur.in. Free, reviewed within 24 hours.",
});

const REMOTE_OPTIONS = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

type PageProps = {
  searchParams: Promise<{ err?: string; msg?: string }>;
};

export default async function SubmitJobPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <form action={submitJobAction} className="space-y-6">
      <FormStatus
        status={sp.err ? "error" : undefined}
        message={sp.msg}
      />
      <HoneypotField />

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-[var(--foreground)]">
          About the role
        </legend>
        <TextField
          id="title"
          label="Job title"
          required
          placeholder="e.g. Part-time team member"
          maxLength={140}
        />
        <TextField
          id="employer"
          label="Employer / company"
          required
          placeholder="e.g. Madipakkam Cafe"
          maxLength={120}
        />
        <TextArea
          id="body"
          label="Job description"
          required
          rows={8}
          maxLength={6000}
          placeholder={`Role, timings, who can apply, perks, how to apply.\n\nMarkdown supported.`}
          hint="Plain text or markdown. Include hours, pay (if disclosed), and how to apply."
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Location & format
        </legend>
        <TextField
          id="locality"
          label="Locality / area"
          placeholder="e.g. Madipakkam, Nanganallur"
          maxLength={80}
        />
        <SelectField
          id="remote_policy"
          label="Work format"
          defaultValue="onsite"
          options={REMOTE_OPTIONS}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Pay (optional)
        </legend>
        <TextField
          id="salary_min"
          label="Minimum monthly pay (₹)"
          inputMode="numeric"
          placeholder="e.g. 8000"
        />
        <TextField
          id="salary_max"
          label="Maximum monthly pay (₹)"
          inputMode="numeric"
          placeholder="e.g. 12000"
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Public contact (shown on the listing)
        </legend>
        <PhoneField id="contact_phone" label="Contact phone" required />
        <TextField
          id="contact_email"
          label="Contact email (optional)"
          type="email"
          autoComplete="email"
          placeholder="hr@example.com"
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
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={120}
        />
      </fieldset>

      <div>
        <HCaptchaWidget />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-[var(--muted)]">
          By submitting you agree to our community guidelines. Submissions are
          reviewed within 24 hours.
        </p>
        <SubmitButton label="Submit job" />
      </div>
    </form>
  );
}
