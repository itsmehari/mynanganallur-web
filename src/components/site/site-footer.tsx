import Link from "next/link";
import { nanganallurAreas } from "@/lib/nanganallur-areas";

const newsLinks = [
  { href: "/local-news", label: "Local news" },
  { href: "/local-news/topic/local", label: "Local & civic" },
  { href: "/local-news/topic/mobility", label: "Mobility & Metro" },
  { href: "/local-news/topic/consumer", label: "Consumer" },
  { href: "/local-news/topic/elections", label: "Elections desk" },
  { href: "/local-news", label: "Editor’s picks" },
];

const discoverLinks = [
  { href: "/directory", label: "Full directory" },
  { href: "/directory", label: "Schools & colleges" },
  { href: "/directory", label: "Hospitals" },
  { href: "/directory", label: "Food & dining" },
  { href: "/local-events", label: "Local events" },
  { href: "/jobs", label: "Jobs board" },
  { href: "/#areas", label: "Area map (home)" },
];

const workLinks = [
  { href: "/jobs", label: "Browse jobs" },
  { href: "/jobs", label: "Post a job (soon)" },
  { href: "/directory", label: "List your business" },
  { href: "/local-events", label: "Submit an event (soon)" },
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
  { href: "/local-news/topic/mobility", label: "Metro" },
  { href: "/local-news/topic/local", label: "GCC & wards" },
  { href: "/local-news/topic/local", label: "Monsoon" },
  { href: "/areas/omr-perungudi-near", label: "OMR" },
  { href: "/local-news/topic/local", label: "Temple season" },
  { href: "/jobs", label: "Startups" },
  { href: "/local-events", label: "Weekend" },
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
  const areaLinks = nanganallurAreas.slice(0, 8).map((z) => ({
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
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-lg font-semibold tracking-tight text-[var(--footer-fg)]"
            >
              mynanganallur.in
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--footer-muted)]">
              Nanganallur and nearby neighbourhoods — news, directory, jobs,
              events, and area hubs. Built for residents and commuters on the
              south Chennai belt.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tagLinks.map((t) => (
                <Link
                  key={t.href + t.label}
                  href={t.href}
                  className="rounded-full border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-bg)_88%,var(--accent)_12%)] px-3 py-1 text-[11px] font-semibold text-[var(--footer-link)] transition hover:border-[var(--accent)] hover:text-[var(--footer-link-hover)]"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          <FooterColumn title="News" links={newsLinks} />
          <FooterColumn title="Discover" links={discoverLinks} />
          <FooterColumn title="List & work" links={workLinks} />
        </div>

        <div className="mt-12 border-t border-[var(--footer-border)] pt-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--footer-muted)]">
            Area hubs
          </p>
          <ul className="mt-4 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
            {areaLinks.map((a) => (
              <li key={a.href} className="mb-2 break-inside-avoid">
                <Link
                  href={a.href}
                  className="text-sm text-[var(--footer-link)] hover:text-[var(--footer-link-hover)]"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-8 border-t border-[var(--footer-border)] pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
          <div>
            <p className="border-b border-[var(--footer-border)] pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--footer-muted)]">
              Follow
            </p>
            <p className="mt-4 text-sm text-[var(--footer-muted)]">
              Social links coming soon.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--footer-border)] pt-8 text-sm text-[var(--footer-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} mynanganallur.in
          </p>
          <p>
            Nanganallur · Chennai · Tamil Nadu · India · Content in English
            (தமிழ் soon)
          </p>
        </div>
      </div>
    </footer>
  );
}
