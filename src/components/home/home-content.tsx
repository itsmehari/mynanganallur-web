import Link from "next/link";
import { Section } from "@/components/home/section";
import {
  categoryTiles,
  cityPulseBullets,
  editorsPicks,
  homeStats,
  mockArticles,
  mockEvents,
  mockJobs,
  mockListings,
  sponsors,
  trendingTags,
  zoneShortcuts,
} from "@/lib/home-mock";

export function HomeHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-12 shadow-sm sm:px-10 sm:py-14">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--accent)] opacity-[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[var(--accent-warm)] opacity-[0.08] blur-3xl" />
      <div className="relative max-w-3xl animate-home-fade-up">
        <p className="text-sm font-medium text-[var(--accent)]">
          Chennai-wide · not corridor-only
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          News, places, jobs, and events — mapped to how you actually move
          through the city.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          mychennaicity.in is the home page for Greater Chennai: from
          Tiruvottiyur to Sholinganallur, Ambattur to Adyar — with hyperlocal
          hubs you can click on a living map.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/news"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] shadow-sm transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Read the news desk
          </Link>
          <Link
            href="/directory"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Explore listings
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Find jobs
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Browse events
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HomeTrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center text-sm text-[var(--muted)] sm:justify-between sm:text-left">
      <span>
        <strong className="font-medium text-[var(--foreground)]">
          Free to browse
        </strong>{" "}
        — no paywall on public discovery.
      </span>
      <span className="hidden h-4 w-px bg-[var(--border)] sm:block" aria-hidden />
      <span>Editorial standards & corrections policy — publishing soon.</span>
      <span className="hidden h-4 w-px bg-[var(--border)] sm:block" aria-hidden />
      <span>Built for mobile Chennai — fast pages, clear type.</span>
    </div>
  );
}

export function HomeCategoryMosaic() {
  return (
    <Section
      title="Explore Chennai"
      subtitle="Directory tiles pick up live counts once the unified listings API lands."
      action={{ href: "/directory", label: "Full directory" }}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categoryTiles.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span className="text-2xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                {c.label}
              </span>
              <span className="mt-1 text-xs text-[var(--muted)]">
                {c.count} listings
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeZoneShortcuts() {
  return (
    <Section
      title="Zone shortcuts"
      subtitle="Jump straight into macro hubs — same destinations as the map below."
      action={{ href: "#areas", label: "Skip to map" }}
    >
      <div className="flex flex-wrap gap-2">
        {zoneShortcuts.map((z) => (
          <Link
            key={z.slug}
            href={`/areas/${z.slug}`}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {z.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function HomeStatsRibbon() {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-3">
      <div className="rounded-xl bg-[var(--background)] px-4 py-3 text-center sm:text-left">
        <p className="text-2xl font-semibold tabular-nums text-[var(--foreground)]">
          {homeStats.jobsLive}+
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Live job signals
        </p>
      </div>
      <div className="rounded-xl bg-[var(--background)] px-4 py-3 text-center sm:text-left">
        <p className="text-2xl font-semibold tabular-nums text-[var(--foreground)]">
          {homeStats.eventsWeek}
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Events this week
        </p>
      </div>
      <div className="rounded-xl bg-[var(--background)] px-4 py-3 text-center sm:text-left">
        <p className="text-2xl font-semibold tabular-nums text-[var(--foreground)]">
          {homeStats.guidesNew}
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          New guides (mock)
        </p>
      </div>
    </div>
  );
}

export function HomeJobsSpotlight() {
  return (
    <Section
      title="Jobs spotlight"
      subtitle="Employer accounts and applications ship in P1 — today’s cards are representative mock data."
      action={{ href: "/jobs", label: "Browse all jobs" }}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockJobs.map((j) => (
          <li key={j.title + j.company}>
            <Link
              href={j.href}
              className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {j.title}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{j.company}</p>
              <p className="mt-3 text-xs font-medium text-[var(--accent)]">
                {j.location}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeEventsFeatured() {
  return (
    <Section
      title="Featured events"
      subtitle="Community calendars, workshops, and civic meets — filtered by area soon."
      action={{ href: "/events", label: "All events" }}
    >
      <ul className="grid gap-4 lg:grid-cols-2">
        {mockEvents.map((e) => (
          <li key={e.title}>
            <Link
              href={e.href}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent-warm)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {e.title}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">{e.when}</p>
              <p className="mt-1 text-xs font-medium text-[var(--accent-warm)]">
                {e.where}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeMarketplaceTeaser() {
  return (
    <Section
      title="Marketplace teaser"
      subtitle="Peer listings and classifieds will share one moderation pipeline — here is the visual language early."
      action={{ href: "/directory", label: "List something" }}
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {mockListings.map((l) => (
          <li key={l.title}>
            <Link
              href={l.href}
              className="flex flex-col rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--background))] p-4 transition hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {l.title}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                {l.price}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{l.area}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeTrendingTags() {
  return (
    <Section
      title="Trending topics"
      subtitle="Tag pages wire to Elasticsearch or Postgres full-text later — links land on news for now."
    >
      <div className="flex flex-wrap gap-2">
        {trendingTags.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-full bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] ring-1 ring-[var(--border)] transition hover:ring-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            #{t.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function HomeNewsBulletin() {
  return (
    <Section
      title="News bulletin"
      subtitle="Latest stories — replace with Drizzle queries when Articles MVP merges."
      action={{ href: "/news", label: "View all stories" }}
    >
      <ul className="grid gap-4 lg:grid-cols-2">
        {mockArticles.map((a) => (
          <li key={a.title}>
            <Link
              href={a.href}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                {a.category}
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {a.title}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">{a.date}</p>
              {a.excerpt ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {a.excerpt}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeEditorsPicks() {
  return (
    <Section
      title="Editor’s picks"
      subtitle="Human-curated spotlight — three stories we’d put on a print fold."
      action={{ href: "/news", label: "More features" }}
    >
      <ul className="grid gap-4 lg:grid-cols-3">
        {editorsPicks.map((a) => (
          <li key={a.title}>
            <Link
              href={a.href}
              className="flex h-full flex-col rounded-2xl bg-[var(--foreground)] p-5 text-[var(--background)] transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--background)_65%,transparent)]">
                {a.category}
              </p>
              <p className="mt-3 text-sm font-semibold leading-snug">{a.title}</p>
              <p className="mt-auto pt-4 text-xs text-[color-mix(in_srgb,var(--background)_70%,transparent)]">
                {a.date}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeCityPulse() {
  return (
    <Section
      title="City pulse"
      subtitle="Infra, water, and mobility — a distinct lane from the main news river."
      action={{ href: "/news", label: "Civic desk" }}
    >
      <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {cityPulseBullets.map((b) => (
          <li key={b.title}>
            <Link
              href={b.href}
              className="flex items-center justify-between gap-4 px-4 py-4 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span>{b.title}</span>
              <span className="text-[var(--accent)]" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeSeasonalHub() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent-warm)_12%,var(--surface))] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-warm)]">
        Seasonal hub
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
        Tamil Nadu Assembly Election 2026 — Chennai voter desk
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Constituency explainers, roll updates, and polling-day checklists — we’ll
        host a dedicated guide path; this band is the home-page slot for timely
        campaigns.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/news"
          className="inline-flex rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Open election desk
        </Link>
        <Link
          href="/events"
          className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Town-hall events
        </Link>
      </div>
    </div>
  );
}

export function HomeSponsoredRow() {
  return (
    <Section
      title="Partners & sponsors"
      subtitle="Ethical disclosure — every paid placement will be labeled in production."
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {sponsors.map((s) => (
          <li key={s.name}>
            <a
              href={s.href}
              {...(s.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {s.external ? "External" : "Editorial"}
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {s.name}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">{s.blurb}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-[var(--accent)]">
                Learn more →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
