import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events",
  description: "Chennai events, meetups, and civic calendars — coming soon.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14">
      <p className="text-sm font-medium text-[var(--accent-warm)]">Events</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        What&apos;s on in Chennai
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Public event listings and submission flows will connect to the `events`
        schema. For now this route anchors the home page CTAs.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
