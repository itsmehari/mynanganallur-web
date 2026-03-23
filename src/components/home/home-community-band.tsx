"use client";

import { Section } from "@/components/home/section";

export function HomeCommunityBand() {
  return (
    <Section
      id="newsletter"
      eyebrow="Community"
      title="Stay in the loop"
      subtitle="Newsletter + chat groups — hooks only until Resend and community policies ship."
    >
      <div className="grid gap-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Weekly Chennai digest
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Jobs, civic deadlines, weekend events — one concise email. No spam.
          </p>
          <form
            className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="flex flex-wrap gap-3 lg:flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Follow
          </span>
          <div className="flex gap-2">
            {["WhatsApp", "Instagram", "YouTube"].map((label) => (
              <button
                key={label}
                type="button"
                disabled
                title="Coming soon"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
