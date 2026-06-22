import Link from "next/link";

const TABS = [
  { href: "/submit/job", label: "Job" },
  { href: "/submit/open-to-work", label: "Open to Work" },
  { href: "/submit/event", label: "Event" },
  { href: "/submit/business", label: "Business" },
  { href: "/submit/property", label: "Property" },
];

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
        Submit to mynanganallur.in
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Tell us what to publish
      </h1>
      <p className="mt-3 max-w-prose text-sm text-[var(--muted)]">
        Free for residents. We review every submission within 24 hours. We do
        not sell your contact details.
      </p>
      <nav
        aria-label="Submit type"
        className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4"
      >
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
