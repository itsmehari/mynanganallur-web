import Link from "next/link";
import { Section } from "@/components/home/section";
import {
  categoryTiles,
  cityPulseBullets,
  homeStats,
  mockEvents,
  mockJobs,
  mockListings,
  sponsors,
  trendingTags,
  zoneShortcuts,
} from "@/lib/home-mock";

function IconNews({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
      <path d="m9 5 6 2v14" />
    </svg>
  );
}

function IconBriefcase({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <rect x={3} y={7} width={18} height={13} rx={2} />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <rect x={3} y={5} width={18} height={16} rx={2} />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l1.8 5.5h5.7l-4.6 3.3 1.8 5.5L12 14.5 7.3 16.3l1.8-5.5L4.5 7.5h5.7L12 2z" />
    </svg>
  );
}

export function HomeHero() {
  const bentoLinks = [
    {
      href: "/chennai-local-news",
      label: "Local news",
      sub: "Report + analysis",
      Icon: IconNews,
    },
    {
      href: "/directory",
      label: "Directory",
      sub: "Places & services",
      Icon: IconMap,
    },
    {
      href: "/jobs",
      label: "Jobs",
      sub: "Hiring signals",
      Icon: IconBriefcase,
    },
    {
      href: "/events",
      label: "Events",
      sub: "This week",
      Icon: IconCalendar,
    },
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="home-hero-mesh pointer-events-none absolute inset-0 opacity-90" />
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[var(--accent)] opacity-[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--accent-warm)] opacity-[0.07] blur-3xl" />
      <div className="relative grid gap-12 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="max-w-xl animate-home-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_85%,var(--background))] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <IconSpark className="text-[var(--accent-warm)]" />
            Chennai-wide · not corridor-only
          </p>
          <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]">
            News, places, jobs, and events — mapped to how you actually move
            through the city.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            mychennaicity.in is the home page for Greater Chennai: from
            Tiruvottiyur to Sholinganallur, Ambattur to Adyar — with hyperlocal
            hubs you can click on a living map.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/chennai-local-news"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-fg)] shadow-md transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Read the news desk
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Explore listings
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Find jobs
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Browse events
            </Link>
          </div>
        </div>

        <aside
          className="animate-home-fade-up lg:justify-self-end"
          style={{ animationDelay: "80ms" }}
          aria-label="Quick links"
        >
          <div className="mx-auto w-full max-w-md rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-4 shadow-[0_20px_50px_-20px_color-mix(in_srgb,var(--foreground)_25%,transparent)] backdrop-blur-sm sm:p-5">
            <p className="px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Start here
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {bentoLinks.map(({ href, label, sub, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="home-bento-tile group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent)] transition group-hover:bg-[color-mix(in_srgb,var(--accent)_20%,var(--surface))]">
                    <Icon />
                  </span>
                  <span className="mt-3 text-sm font-bold text-[var(--foreground)]">
                    {label}
                  </span>
                  <span className="mt-0.5 text-xs text-[var(--muted)]">
                    {sub}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="#areas"
              className="mt-4 flex items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-4 py-3 text-center text-xs font-semibold text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_6%,var(--surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Jump to the Greater Chennai map →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function HomeTrustStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center shadow-sm sm:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          Access
        </p>
        <p className="mt-2 text-sm leading-snug text-[var(--muted)]">
          <strong className="font-semibold text-[var(--foreground)]">
            Free to browse
          </strong>{" "}
          — no paywall on public discovery.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center shadow-sm sm:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          Trust
        </p>
        <p className="mt-2 text-sm leading-snug text-[var(--muted)]">
          Editorial standards & corrections policy — publishing soon.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center shadow-sm sm:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          Mobile
        </p>
        <p className="mt-2 text-sm leading-snug text-[var(--muted)]">
          Built for mobile Chennai — fast pages, clear type.
        </p>
      </div>
    </div>
  );
}

export function HomeCategoryMosaic() {
  return (
    <Section
      eyebrow="Directory"
      title="Explore Chennai"
      subtitle="Directory tiles pick up live counts once the unified listings API lands."
      action={{ href: "/directory", label: "Full directory" }}
    >
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categoryTiles.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="home-bento-tile flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] border-t-4 border-t-[var(--accent)] bg-[var(--surface)] p-4 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] text-2xl"
                aria-hidden
              >
                {c.emoji}
              </span>
              <span className="mt-3 text-sm font-bold text-[var(--foreground)]">
                {c.label}
              </span>
              <span className="mt-1 text-xs font-medium text-[var(--muted)]">
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
      eyebrow="Macro hubs"
      title="Zone shortcuts"
      subtitle="Jump straight into macro hubs — same destinations as the map below."
      action={{ href: "#areas", label: "Skip to map" }}
    >
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible">
        {zoneShortcuts.map((z) => (
          <Link
            key={z.slug}
            href={`/areas/${z.slug}`}
            className="shrink-0 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,var(--accent)_4%)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {z.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function HomeStatsRibbon() {
  const stats = [
    {
      value: `${homeStats.jobsLive}+`,
      label: "Live job signals",
      Icon: IconBriefcase,
      tint: "var(--accent)",
    },
    {
      value: String(homeStats.eventsWeek),
      label: "Events this week",
      Icon: IconCalendar,
      tint: "var(--accent-warm)",
    },
    {
      value: String(homeStats.guidesNew),
      label: "New guides (mock)",
      Icon: IconSpark,
      tint: "var(--accent)",
    },
  ] as const;
  return (
    <div className="grid grid-cols-1 gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-4 rounded-2xl bg-[var(--background)] px-4 py-4 ring-1 ring-[var(--border)]"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[var(--accent-fg)]"
            style={{
              background: `linear-gradient(135deg, ${s.tint}, color-mix(in srgb, ${s.tint} 65%, #000))`,
            }}
            aria-hidden
          >
            <s.Icon className="opacity-95" />
          </span>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-[var(--foreground)]">
              {s.value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeJobsSpotlight() {
  return (
    <Section
      eyebrow="Careers"
      title="Jobs spotlight"
      subtitle="Employer accounts and applications ship in P1 — today’s cards are representative mock data."
      action={{ href: "/jobs", label: "Browse all jobs" }}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockJobs.map((j, i) => (
          <li
            key={j.title + j.company}
            className={i === 0 ? "sm:col-span-2" : ""}
          >
            <Link
              href={j.href}
              className={`home-bento-tile flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                i === 0
                  ? "relative overflow-hidden bg-[color-mix(in_srgb,var(--accent)_7%,var(--surface))] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent_40%,color-mix(in_srgb,var(--accent)_12%,transparent)_100%)] lg:min-h-[11rem] lg:flex-row lg:items-center lg:gap-8 lg:p-8"
                  : ""
              }`}
            >
              <div className={i === 0 ? "lg:max-w-md" : ""}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  {i === 0 ? "Featured role" : "Open role"}
                </p>
                <p
                  className={`mt-1 font-semibold text-[var(--foreground)] ${
                    i === 0 ? "text-lg sm:text-xl" : "text-sm"
                  }`}
                >
                  {j.title}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{j.company}</p>
              </div>
              <p
                className={`mt-3 text-xs font-bold text-[var(--accent)] lg:mt-0 ${
                  i === 0 ? "lg:ml-auto lg:text-sm" : ""
                }`}
              >
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
      eyebrow="Calendar"
      title="Featured events"
      subtitle="Community calendars, workshops, and civic meets — filtered by area soon."
      action={{ href: "/events", label: "All events" }}
    >
      <ul className="grid gap-4 lg:grid-cols-2">
        {mockEvents.map((e, i) => (
          <li key={e.title} className={i === 0 ? "lg:col-span-2" : ""}>
            <Link
              href={e.href}
              className={`home-bento-tile flex rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                i === 0
                  ? "flex-col gap-4 border-l-4 border-l-[var(--accent-warm)] p-6 sm:flex-row sm:items-center sm:justify-between"
                  : "flex-col p-5"
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-warm)]">
                  {i === 0 ? "Headline" : "Event"}
                </p>
                <p
                  className={`font-semibold text-[var(--foreground)] ${
                    i === 0 ? "text-lg sm:text-xl" : "text-sm"
                  }`}
                >
                  {e.title}
                </p>
                <p className="text-xs text-[var(--muted)]">{e.when}</p>
              </div>
              <p className="shrink-0 rounded-xl bg-[color-mix(in_srgb,var(--accent-warm)_12%,var(--surface))] px-4 py-2 text-center text-xs font-bold text-[var(--accent-warm)] sm:text-left">
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
      eyebrow="Peer listings"
      title="Marketplace teaser"
      subtitle="Peer listings and classifieds will share one moderation pipeline — here is the visual language early."
      action={{ href: "/directory", label: "List something" }}
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {mockListings.map((l) => (
          <li key={l.title}>
            <Link
              href={l.href}
              className="home-bento-tile flex flex-col rounded-2xl border border-[var(--border)] border-t-4 border-t-[var(--accent-warm)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent-warm)_3%)] p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-sm font-bold text-[var(--foreground)]">
                {l.title}
              </p>
              <p className="mt-3 text-lg font-bold text-[var(--accent)]">
                {l.price}
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--muted)]">
                {l.area}
              </p>
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
      eyebrow="Discover"
      title="Trending topics"
      subtitle="Tag pages wire to Elasticsearch or Postgres full-text later — links land on news for now."
    >
      <div className="flex flex-wrap gap-2">
        {trendingTags.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-full bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm ring-1 ring-[var(--border)] transition hover:-translate-y-0.5 hover:ring-2 hover:ring-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            #{t.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function HomeCityPulse() {
  return (
    <Section
      eyebrow="Infra & civic"
      title="City pulse"
      subtitle="Infra, water, and mobility — a distinct lane from the main news river."
      action={{ href: "/chennai-local-news", label: "Civic desk" }}
    >
      <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        {cityPulseBullets.map((b) => (
          <li key={b.title}>
            <Link
              href={b.href}
              className="group flex items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[color-mix(in_srgb,var(--accent)_6%,var(--background))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span className="min-w-0 pr-2">{b.title}</span>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[var(--accent)] ring-1 ring-[var(--border)] transition group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)] group-hover:ring-transparent"
                aria-hidden
              >
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
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent-warm)_14%,var(--surface))] p-6 shadow-md sm:p-10">
      <div
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full opacity-40 blur-2xl"
        style={{
          background: `radial-gradient(circle, var(--accent-warm), transparent 70%)`,
        }}
      />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent-warm)]">
            Seasonal hub
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Tamil Nadu Assembly Election 2026 — Chennai voter desk
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Constituency explainers, roll updates, and polling-day checklists —
            we’ll host a dedicated guide path; this band is the home-page slot
            for timely campaigns.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/chennai-local-news/topic/elections"
            className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-8 py-3 text-center text-sm font-bold text-[var(--background)] shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Open election desk
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--foreground)_25%,transparent)] bg-[var(--surface)] px-8 py-3 text-center text-sm font-bold text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Town-hall events
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HomeSponsoredRow() {
  return (
    <Section
      eyebrow="Transparency"
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
              className="home-bento-tile block h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                {s.external ? "External" : "Editorial"}
              </p>
              <p className="mt-2 text-base font-bold text-[var(--foreground)]">
                {s.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {s.blurb}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)]">
                Learn more →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
