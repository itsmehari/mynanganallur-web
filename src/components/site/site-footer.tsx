import Link from "next/link";
import { chennaiZones } from "@/lib/chennai-zones";

const newsLinks = [
  { href: "/news", label: "Latest stories" },
  { href: "/news", label: "Civic & GCC" },
  { href: "/news", label: "Mobility & Metro" },
  { href: "/news", label: "Environment" },
  { href: "/news", label: "Elections desk" },
  { href: "/news", label: "Editor’s picks" },
];

const discoverLinks = [
  { href: "/directory", label: "Full directory" },
  { href: "/directory", label: "Schools & colleges" },
  { href: "/directory", label: "Hospitals" },
  { href: "/directory", label: "Food & dining" },
  { href: "/events", label: "Events calendar" },
  { href: "/jobs", label: "Jobs board" },
  { href: "/#areas", label: "Area map (home)" },
];

const workLinks = [
  { href: "/jobs", label: "Browse jobs" },
  { href: "/jobs", label: "Post a job (soon)" },
  { href: "/directory", label: "List your business" },
  { href: "/events", label: "Submit an event (soon)" },
];

const companyLinks = [
  { href: "/news", label: "About us" },
  { href: "/news", label: "Contact & tips" },
  { href: "/news", label: "Advertise" },
  { href: "/news", label: "Careers" },
  { href: "/news", label: "Corrections policy" },
];

const legalLinks = [
  { href: "/news", label: "Privacy" },
  { href: "/news", label: "Terms of use" },
  { href: "/news", label: "Cookies" },
  { href: "/news", label: "Community guidelines" },
];

const tagLinks = [
  { href: "/news", label: "Metro" },
  { href: "/news", label: "GCC" },
  { href: "/news", label: "Monsoon" },
  { href: "/news", label: "OMR" },
  { href: "/news", label: "Marina" },
  { href: "/news", label: "Startups" },
  { href: "/events", label: "Weekend" },
  { href: "/jobs", label: "Remote" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-sm text-[color-mix(in_srgb,var(--foreground)_88%,var(--muted))] transition hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const areaLinks = chennaiZones.slice(0, 8).map((z) => ({
    href: `/areas/${z.slug}`,
    label: z.label,
  }));

  return (
    <footer
      className="relative mt-20 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_65%,var(--background))]"
      role="contentinfo"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
        {/* Top CTA band */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              Greater Chennai, one tab
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
              Save mychennaicity.in — your fat footer is the backup navigation.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Jump to news, jobs, events, directory, or a neighbourhood hub
              without scrolling the whole home page again.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:flex-shrink-0">
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-fg)] shadow-sm transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Open news desk
            </Link>
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Email digest
            </Link>
          </div>
        </div>

        {/* Main fat grid */}
        <div className="mt-14 grid gap-12 border-b border-[var(--border)] pb-14 lg:mt-16 lg:grid-cols-12 lg:gap-10 lg:pb-16">
          {/* Brand + social */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-fg)] shadow"
                aria-hidden
              >
                MC
              </span>
              <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                mychennaicity.in
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              City-scale local: news, discovery, jobs, and listings for the whole
              of Greater Chennai — from the harbour belt to OMR, Ambattur to
              Adyar.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
              Map tiles and area outlines are simplified for browsing; not a legal
              cadastral survey.
            </p>
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Follow (coming soon)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["WhatsApp", "Instagram", "YouTube", "X / Twitter"].map(
                  (label) => (
                    <span
                      key={label}
                      className="inline-flex cursor-not-allowed items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
                      title="Social links go live with community policy"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
            <p className="mt-8 text-xs text-[var(--muted)]">
              Web-first experience · Mobile apps on the roadmap.
            </p>
          </div>

          {/* Link columns */}
          <nav
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4 lg:gap-8"
            aria-label="Footer"
          >
            <FooterColumn title="News & guides" links={newsLinks} />
            <FooterColumn title="Discover" links={discoverLinks} />
            <FooterColumn title="Work & list" links={workLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </nav>
        </div>

        {/* Popular areas — full width row */}
        <div className="mt-12 lg:mt-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Popular area hubs
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {areaLinks.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="text-sm font-medium text-[var(--foreground)] underline decoration-[var(--border)] underline-offset-4 transition hover:decoration-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {a.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#areas"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                All areas on map →
              </Link>
            </li>
          </ul>
        </div>

        {/* Tags strip */}
        <div className="mt-10 rounded-2xl bg-[var(--surface)] px-4 py-5 ring-1 ring-[var(--border)] sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Explore by topic
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tagLinks.map((t) => (
              <Link
                key={t.href + t.label}
                href={t.href}
                className="rounded-full bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] ring-1 ring-[var(--border)] transition hover:ring-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                #{t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal + meta bar */}
        <div className="mt-12 flex flex-col gap-6 border-t border-[var(--border)] pt-10 lg:flex-row lg:items-start lg:justify-between">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Legal"
          >
            {legalLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="text-xs leading-relaxed text-[var(--muted)] lg:text-right">
            <p>© {new Date().getFullYear()} mychennaicity.in</p>
            <p className="mt-1">
              Chennai · Tamil Nadu · India · Content in English (தமிழ் soon)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
