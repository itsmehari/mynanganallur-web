import type { Metadata } from "next";
import { HCaptchaWidget } from "@/components/forms/hcaptcha";
import {
  CheckboxField,
  FormStatus,
  HoneypotField,
  PhoneField,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/forms";
import { submitEventAction } from "./actions";
import { buildPageMetadata } from "@/lib/seo/hub-page-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/submit/event",
  title: "Submit an event",
  description:
    "Announce a Nanganallur-area event — temple festival, market day, workshop, RWA notice, or blood drive. Free, reviewed within 24 hours.",
});

type PageProps = {
  searchParams: Promise<{ err?: string; msg?: string }>;
};

export default async function SubmitEventPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <form action={submitEventAction} className="space-y-6">
      <FormStatus status={sp.err ? "error" : undefined} message={sp.msg} />
      <HoneypotField />

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-[var(--foreground)]">
          About the event
        </legend>
        <TextField
          id="title"
          label="Event title"
          required
          placeholder="e.g. Karthigai Deepam — Anjaneyar Temple"
          maxLength={160}
        />
        <TextArea
          id="description"
          label="Description"
          rows={6}
          maxLength={4000}
          placeholder={`What is happening, who can come, parking notes, contact.\n\nMarkdown supported.`}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          When
        </legend>
        <TextField
          id="starts_at"
          label="Start (date & time)"
          type="datetime-local"
          required
          hint="In Chennai time (IST)."
        />
        <TextField
          id="ends_at"
          label="End (optional)"
          type="datetime-local"
        />
        <div className="sm:col-span-2">
          <CheckboxField id="all_day" label="All-day event" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-[var(--foreground)]">
          Where
        </legend>
        <TextField
          id="venue_name"
          label="Venue / hall name"
          placeholder="e.g. Anjaneyar Temple"
          maxLength={120}
        />
        <TextField
          id="venue_address"
          label="Address"
          placeholder="e.g. Nanganallur Main Road, Chennai 600061"
          maxLength={240}
        />
        <TextField
          id="locality"
          label="Locality / area"
          placeholder="e.g. Nanganallur core"
          maxLength={80}
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
          By submitting you agree to our community guidelines.
        </p>
        <SubmitButton label="Submit event" />
      </div>
    </form>
  );
}
