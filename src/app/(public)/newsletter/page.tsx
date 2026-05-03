import type { Metadata } from "next";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export const metadata: Metadata = {
  title: "Newsletter · mynanganallur.in",
  description:
    "Get the weekly Nanganallur news, jobs, events and property digest in your inbox every Sunday.",
  alternates: { canonical: "https://mynanganallur.in/newsletter" },
};

type Props = {
  searchParams?: Promise<{
    confirmed?: string;
    unsubscribed?: string;
    error?: string;
  }>;
};

export default async function NewsletterPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  return (
    <div className="mx-auto max-w-[640px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        mynanganallur.in weekly digest
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Every Sunday: 5 stories, the week's events, fresh jobs &amp; properties
        — curated for Nanganallur, Madipakkam, Adambakkam, Pazhavanthangal and
        Puzhuthivakkam.
      </p>

      {sp.confirmed ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Subscription confirmed. See you Sunday!
        </div>
      ) : null}
      {sp.unsubscribed ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You've been unsubscribed. Sorry to see you go.
        </div>
      ) : null}
      {sp.error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Something went wrong. Try subscribing again.
        </div>
      ) : null}

      <div className="mt-8">
        <NewsletterForm source="newsletter-page" />
      </div>

      <p className="mt-8 text-xs text-[var(--muted)]">
        We send one email per week. Unsubscribe anytime via the link in the
        footer of every email.
      </p>
    </div>
  );
}
