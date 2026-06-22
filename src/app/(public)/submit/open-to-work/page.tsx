import type { Metadata } from "next";
import { HCaptchaWidget } from "@/components/forms/hcaptcha";
import {
  FormStatus,
  HoneypotField,
  PhoneField,
  SubmitButton,
  TextArea,
  TextField,
} from "@/components/forms";
import { buildPageMetadata } from "@/lib/seo/hub-page-metadata";
import { submitOpenToWorkAction } from "./actions";

export const metadata: Metadata = buildPageMetadata({
  path: "/submit/open-to-work",
  title: "Share your Open to Work profile",
  description:
    "Looking for a role or referral? Share your profile on mynanganallur.in. Free, reviewed within 24 hours.",
});

type PageProps = {
  searchParams: Promise<{ err?: string; msg?: string }>;
};

const MODE_OPTIONS = [
  { id: "mode_remote", value: "remote", label: "Remote" },
  { id: "mode_hybrid", value: "hybrid", label: "Hybrid" },
  { id: "mode_onsite", value: "onsite", label: "On-site" },
] as const;

export default async function SubmitOpenToWorkPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <form action={submitOpenToWorkAction} className="space-y-6">
      <FormStatus status={sp.err ? "error" : undefined} message={sp.msg} />
      <HoneypotField />

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-[var(--foreground)]">
          About you
        </legend>
        <TextField
          id="display_name"
          label="Your name"
          required
          placeholder="e.g. Lakshmipriya"
          maxLength={80}
        />
        <TextField
          id="headline"
          label="Headline"
          required
          placeholder="e.g. MBA (Finance) · 10+ yrs Banking & IB Operations"
          maxLength={140}
        />
        <TextField
          id="domains_label"
          label="Domains / industries"
          placeholder="e.g. Banking, Finance, Investment banking operations"
          maxLength={120}
        />
        <TextArea
          id="body"
          label="Profile summary"
          required
          rows={10}
          maxLength={6000}
          placeholder={`Brief background, what roles you are seeking, urgency if any, and how referrers can help.\n\nMarkdown supported.`}
          hint="Keep it professional. Do not paste full LinkedIn posts with hashtags."
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Preferences
        </legend>
        <TextField
          id="preferred_locations"
          label="Preferred locations"
          required
          placeholder="e.g. Bangalore, Chennai, Coimbatore, Remote"
          maxLength={200}
        />
        <TextField
          id="years_experience"
          label="Years of experience (optional)"
          inputMode="numeric"
          placeholder="e.g. 10"
        />
        <div className="col-span-full">
          <p className="text-sm font-medium text-[var(--foreground)]">Work mode</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {MODE_OPTIONS.map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id={m.id}
                  name={m.id}
                  defaultChecked={m.value === "hybrid" || m.value === "remote"}
                  className="size-4 rounded border-[var(--border)]"
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Public contact (shown on your profile)
        </legend>
        <TextField
          id="contact_email"
          label="Contact email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={120}
        />
        <PhoneField id="contact_phone" label="Contact phone / WhatsApp" />
        <TextField
          id="linkedin_url"
          label="LinkedIn URL"
          type="url"
          placeholder="https://linkedin.com/in/..."
          maxLength={300}
        />
        <TextField
          id="facebook_url"
          label="Facebook profile URL"
          type="url"
          placeholder="https://facebook.com/..."
          maxLength={300}
        />
        <TextField
          id="source_post_url"
          label="Original post URL (optional)"
          type="url"
          placeholder="Link to your Facebook/LinkedIn post"
          maxLength={300}
        />
        <TextField
          id="resume_url"
          label="Resume link (optional)"
          type="url"
          placeholder="Google Drive, Dropbox, etc."
          maxLength={300}
        />
        <p className="col-span-full text-xs text-[var(--muted)]">
          At least one of email, phone, LinkedIn, or Facebook is required so referrers can reach you.
        </p>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="col-span-full text-base font-semibold text-[var(--foreground)]">
          Private (for review only)
        </legend>
        <TextField id="submitter_name" label="Submitter name" maxLength={80} />
        <PhoneField id="submitter_phone" label="Submitter phone" />
        <TextField
          id="submitter_email"
          label="Submitter email"
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
          Profiles are reviewed within 24 hours and expire after 90 days unless renewed.
          Never pay anyone to be listed.
        </p>
        <SubmitButton label="Submit profile" />
      </div>
    </form>
  );
}
