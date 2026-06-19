import Link from "next/link";
import type { MegaNavSection } from "./nav-config";

type Props = {
  section: MegaNavSection;
  onNavigate?: () => void;
};

export function MegaNavPanel({ section, onNavigate }: Props) {
  const hasFeatured = Boolean(section.featured);
  const gridClass = hasFeatured
    ? section.columns.length >= 3
      ? "md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,240px)]"
      : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,280px)]"
    : section.columns.length > 1
      ? "md:grid-cols-2"
      : "";

  return (
    <div
      className={`mega-nav-panel-inner grid gap-8 lg:gap-10 ${gridClass} ${!hasFeatured && section.columns.length === 1 ? "max-w-lg" : ""}`}
    >
      {section.columns.map((col) => (
        <div key={col.heading}>
          <p className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
            {col.heading}
          </p>
          <ul className="mt-4 space-y-1">
            {col.links.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="group flex min-h-11 flex-col justify-center rounded-xl px-3 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-[var(--muted)]">
                      {link.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {section.featured && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] p-6 shadow-sm lg:row-span-1">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full opacity-40 blur-2xl"
            style={{
              background: `color-mix(in srgb, var(--accent-warm) 35%, transparent)`,
            }}
            aria-hidden
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Featured
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold tracking-tight text-[var(--foreground)]">
            {section.featured.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {section.featured.description}
          </p>
          <Link
            href={section.featured.href}
            onClick={onNavigate}
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-fg)] shadow-md transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {section.featured.cta}
          </Link>
        </div>
      )}
    </div>
  );
}
