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

export { HomeHero } from "./home-hero";

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
      subtitle="Curated Mar 25 2026 from Chennai tech employers and public listings — external cards open the company careers site. Always verify the role before you apply."
      action={{ href: "/jobs", label: "Browse all jobs" }}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockJobs.map((j, i) => {
          const className = `home-bento-tile flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
            i === 0
              ? "relative overflow-hidden bg-[color-mix(in_srgb,var(--accent)_7%,var(--surface))] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent_40%,color-mix(in_srgb,var(--accent)_12%,transparent)_100%)] lg:min-h-[11rem] lg:flex-row lg:items-center lg:gap-8 lg:p-8"
              : ""
          }`;
          const inner = (
            <>
              <div className={i === 0 ? "lg:max-w-md" : ""}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  {i === 0 ? "Featured role" : j.external ? "Employer site" : "Open role"}
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
                {j.external ? " · ↗" : ""}
              </p>
            </>
          );
          return (
            <li
              key={`${j.href}-${j.title}`}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              {j.external ? (
                <a
                  href={j.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link href={j.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function HomeEventsFeatured() {
  return (
    <Section
      eyebrow="Calendar"
      title="Featured events"
      subtitle="Picked Mar 25 2026 from public listings (Mar–Apr). External rows open the organiser or ticket page — confirm time and price before you go."
      action={{ href: "/chennai-local-events", label: "All local events" }}
    >
      <ul className="grid gap-4 lg:grid-cols-2">
        {mockEvents.map((e, i) => {
          const className = `home-bento-tile flex rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
            i === 0
              ? "flex-col gap-4 border-l-4 border-l-[var(--accent-warm)] p-6 sm:flex-row sm:items-center sm:justify-between"
              : "flex-col p-5"
          }`;
          const inner = (
            <>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-warm)]">
                  {i === 0 ? "Headline" : e.external ? "Tickets / info" : "On our calendar"}
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
                {e.external ? " · ↗" : ""}
              </p>
            </>
          );
          return (
            <li key={`${e.href}-${e.title}`} className={i === 0 ? "lg:col-span-2" : ""}>
              {e.external ? (
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link href={e.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
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
            href="/chennai-local-events"
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
