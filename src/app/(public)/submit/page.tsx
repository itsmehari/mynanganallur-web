import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/hub-page-metadata";

export const metadata = buildPageMetadata({
  path: "/submit",
  title: "Submit a listing",
  description:
    "Submit a job, event, business, or property to mynanganallur.in. Free, reviewed within 24 hours.",
});

const CARDS = [
  {
    href: "/submit/job",
    title: "Hire help locally",
    body: "Post an opening at your shop, office, school, or home.",
  },
  {
    href: "/submit/open-to-work",
    title: "Share that you're open to work",
    body: "Seeking a role or referral? Publish your profile for the community.",
  },
  {
    href: "/submit/event",
    title: "Announce an event",
    body: "Temple festival, market day, workshop, RWA notice, blood drive.",
  },
  {
    href: "/submit/business",
    title: "List your business",
    body: "Get found by neighbours searching the directory.",
  },
  {
    href: "/submit/property",
    title: "Rent or sell property",
    body: "Reach genuine local renters and buyers.",
  },
];

export default function SubmitIndex() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CARDS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
        >
          <p className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
            {c.title}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{c.body}</p>
          <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
            Start →
          </span>
        </Link>
      ))}
    </div>
  );
}
