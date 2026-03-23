import Link from "next/link";
import { chennaiZones } from "@/lib/chennai-zones";

const newsLinks = [
  { href: "/chennai-local-news", label: "Chennai local news" },
  { href: "/chennai-local-news/topic/chennai", label: "Civic & GCC" },
  { href: "/chennai-local-news/topic/mobility", label: "Mobility & Metro" },
  { href: "/chennai-local-news/topic/consumer", label: "Consumer" },
  { href: "/chennai-local-news/topic/elections", label: "Elections desk" },
  { href: "/chennai-local-news", label: "Editor’s picks" },
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
  { href: "/chennai-local-news/topic/mobility", label: "Metro" },
  { href: "/chennai-local-news/topic/chennai", label: "GCC" },
  { href: "/chennai-local-news/topic/chennai", label: "Monsoon" },
  { href: "/areas/omr-perungudi-sholinganallur", label: "OMR" },
  { href: "/chennai-local-news/topic/chennai", label: "Marina" },
  { href: "/jobs", label: "Startups" },
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
    <div className="min-w-0">
      <p className="border-b border-[var(--footer-border)] pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--footer-muted)]">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-sm leading-snug text-[var(--footer-link)] transition hover:text-[var(--footer-link-hover)]"
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
      className="site-footer relative mt-20 border-t-4 border-[var(--accent)] bg-[var(--footer-bg)] text-[var(--footer-fg)]"
      role="contentinfo"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--accent)]/12 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px] px-4 pb-12 pt-12 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-16">
        {/* Primary CTA — elevated card on the dark slab (classic fat-footer pattern) */}
        <div className="rounded-2xl border border-[var(--footer-border)] bg-[var(--footer-elevated)] p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Backup navigation
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[var(--footer-fg)] sm:text-3xl">
              Everything worth a second click — without scrolling the home page
              again.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--footer-muted)]">
              News desk, jobs, events, directory, and neighbourhood hubs in one
              fat footer. Same idea as multi-column footers on editorial and
              product sites.
            </p>
          </div>
          <div className="mt-8 flex flex-shrink-0 flex-wrap gap-3 lg:mt-0">
            <Link
              href="/chennai-local-news"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--accent-fg)] shadow-md transition hover:bg-[var(--accent-hover)]"
            >
              Open news desk
            </Link>
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center rounded-full border-2 border-[var(--footer-border)] bg-transparent px-6 py-3 text-sm font-bold text-[var(--footer-fg)] transition hover:border-[var(--footer-link-hover)] hover:text-[var(--footer-link-hover)]"
            >
              Email digest
            </Link>
          </div>
        </div>

        {/* Brand + dense link grid */}
        <div className="mt-14 grid gap-14 border-b border-[var(--footer-border)] pb-14 lg:mt-16 lg:grid-cols-12 lg:gap-12 lg:pb-16">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-fg)] shadow-lg ring-2 ring-[var(--footer-border)]"
                aria-hidden
              >
                MC
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-[var(--footer-fg)]">
                mychennaicity.in
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--footer-muted)]">
              City-scale local: news, discovery, jobs, and listings for Greater
              Chennai — harbour belt to OMR, Ambattur to Adyar.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[color-mix(in_srgb,var(--footer-muted)_92%,var(--footer-fg))]">
              Map tiles are simplified for browsing; not a legal cadastral
              survey.
            </p>

            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--footer-muted)]">
                Follow (coming soon)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["WhatsApp", "Instagram", "YouTube", "X / Twitter"].map(
                  (label) => (
                    <span
                      key={label}
                      className="inline-flex cursor-not-allowed items-center rounded-full border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-elevated)_70%,var(--footer-bg))] px-3 py-1.5 text-xs font-medium text-[var(--footer-muted)]"
                      title="Social links go live with community policy"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
            <p className="mt-8 text-xs text-[var(--footer-muted)]">
              Web-first · Mobile apps on the roadmap.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4 lg:gap-x-6"
            aria-label="Footer"
          >
            <FooterColumn title="News & guides" links={newsLinks} />
            <FooterColumn title="Discover" links={discoverLinks} />
            <FooterColumn title="Work & list" links={workLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </nav>
        </div>

        {/* Popular areas */}
        <div className="mt-12 lg:mt-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--footer-muted)]">
            Popular area hubs
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-5">
            {areaLinks.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="text-sm font-medium text-[var(--footer-link)] underline decoration-[var(--footer-border)] underline-offset-4 transition hover:text-[var(--footer-link-hover)] hover:decoration-[var(--footer-link-hover)]"
                >
                  {a.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#areas"
                className="text-sm font-bold text-[var(--footer-link-hover)] underline-offset-4 hover:underline"
              >
                All areas on map →
              </Link>
            </li>
          </ul>
        </div>

        {/* Topic chips */}
        <div className="mt-10 rounded-2xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-elevated)_55%,var(--footer-bg))] px-5 py-5 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--footer-muted)]">
            Explore by topic
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tagLinks.map((t) => (
              <Link
                key={t.href + t.label}
                href={t.href}
                className="rounded-full border border-[var(--footer-border)] bg-[var(--footer-bg)] px-3.5 py-1.5 text-xs font-semibold text-[var(--footer-link)] transition hover:border-[var(--footer-link-hover)] hover:text-[var(--footer-link-hover)]"
              >
                #{t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Subfooter */}
        <div className="mt-12 flex flex-col gap-8 border-t border-[var(--footer-border)] pt-10 lg:flex-row lg:items-center lg:justify-between">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Legal"
          >
            {legalLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="text-xs font-semibold text-[var(--footer-muted)] transition hover:text-[var(--footer-fg)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="text-xs leading-relaxed text-[var(--footer-muted)] lg:text-right">
            <p className="font-medium text-[var(--footer-link)]">
              © {new Date().getFullYear()} mychennaicity.in
            </p>
            <p className="mt-1">
              Chennai · Tamil Nadu · India · Content in English (தமிழ் soon)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
