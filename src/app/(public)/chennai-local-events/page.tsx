import type { Metadata } from "next";
import Link from "next/link";
import { mockEvents } from "@/lib/home-mock";

const canonicalPath = "/chennai-local-events";

export const metadata: Metadata = {
  title: "Chennai local events — festivals, culture & civic calendar",
  description:
    "Chennai local events: temple festivals, neighbourhood meetups, culture, and civic dates across Greater Chennai. Browse what’s on and submit listings.",
  alternates: { canonical: canonicalPath },
  openGraph: {
    title: "Chennai local events | mychennaicity.in",
    description:
      "Festivals, meetups, and civic calendars for Greater Chennai — from core city to OMR and suburbs.",
    url: canonicalPath,
  },
};

export default function ChennaiLocalEventsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent-warm)]">
        Chennai local events
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        What&apos;s on in Chennai
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Temple utsavams, concerts, theatre, and neighbourhood gatherings across
        Greater Chennai. Below is a{" "}
        <strong className="font-medium text-[var(--foreground)]">
          curated snapshot (updated 25 Mar 2026)
        </strong>
        — confirm dates and tickets on the organiser site.
      </p>

      <ul className="mt-10 space-y-4">
        {mockEvents.map((e) => (
          <li
            key={`${e.href}-${e.title}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm"
          >
            {e.external ? (
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[var(--foreground)] transition hover:text-[var(--accent)]"
              >
                <span className="text-sm font-semibold">{e.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {e.when} · {e.where} · opens in new tab
                </span>
              </a>
            ) : (
              <div className="text-[var(--foreground)]">
                <span className="text-sm font-semibold">{e.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {e.when} · {e.where}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
