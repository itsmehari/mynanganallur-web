import Link from "next/link";
import { listUpcomingEventsForSite } from "@/domains/events";
import { listOpenJobsForSite } from "@/domains/jobs";
import { latestArticlesForHome } from "@/domains/news";
import { listPublishedPropertiesForSite } from "@/domains/properties";

type SnapshotSection = {
  title: string;
  href: string;
  cta: string;
  items: { label: string; meta?: string; href: string }[];
};

function SnapshotColumn({ section }: { section: SnapshotSection }) {
  if (section.items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {section.title}
        </h3>
        <Link
          href={section.href}
          className="shrink-0 text-xs font-semibold text-[var(--accent)] hover:underline"
        >
          {section.cta}
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {section.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg px-1 py-0.5 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              {item.label}
            </Link>
            {item.meta ? (
              <p className="px-1 text-xs text-[var(--muted)]">{item.meta}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function ConnectLiveSnapshots() {
  let articles: Awaited<ReturnType<typeof latestArticlesForHome>> = [];
  let jobs: Awaited<ReturnType<typeof listOpenJobsForSite>> = [];
  let events: Awaited<ReturnType<typeof listUpcomingEventsForSite>> = [];
  let properties: Awaited<ReturnType<typeof listPublishedPropertiesForSite>> =
    [];

  try {
    [articles, jobs, events, properties] = await Promise.all([
      latestArticlesForHome(3),
      listOpenJobsForSite(3),
      listUpcomingEventsForSite(3),
      listPublishedPropertiesForSite(3),
    ]);
  } catch {
    /* DATABASE_URL unset */
  }

  const sections: SnapshotSection[] = [
    {
      title: "Latest news",
      href: "/local-news",
      cta: "All news",
      items: articles.map((a) => ({
        label: a.title,
        meta: a.category ?? undefined,
        href: `/local-news/${a.slug}`,
      })),
    },
    {
      title: "Open jobs",
      href: "/jobs",
      cta: "All jobs",
      items: jobs.map(({ job, employer }) => ({
        label: job.title,
        meta: employer.name,
        href: `/jobs/${job.slug}`,
      })),
    },
    {
      title: "Upcoming events",
      href: "/local-events",
      cta: "All events",
      items: events.map((e) => ({
        label: e.title,
        meta: e.startsAt.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeZone: "Asia/Kolkata",
        }),
        href: `/local-events/${e.slug}`,
      })),
    },
    {
      title: "Properties",
      href: "/properties",
      cta: "All listings",
      items: properties.map((p) => ({
        label: p.title,
        meta: p.localityLabel ?? (p.kind === "rent" ? "Rent" : "Sale"),
        href: `/properties/${p.slug}`,
      })),
    },
  ];

  const hasAny = sections.some((s) => s.items.length > 0);
  if (!hasAny) return null;

  return (
    <section aria-labelledby="connect-live-heading" className="mt-12">
      <h2
        id="connect-live-heading"
        className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
      >
        Live from Nanganallur
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Fresh picks from the site — updated as editors and advertisers publish.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <SnapshotColumn key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}
