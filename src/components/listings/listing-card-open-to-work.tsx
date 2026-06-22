import Link from "next/link";
import { formatPublishedDate } from "@/lib/listings/format";

type Props = {
  slug: string;
  displayName: string;
  headline: string;
  domainsLabel: string | null;
  preferredLocations: string | null;
  workModePreferences: string;
  yearsExperience: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  featured: boolean;
};

function workModeLabel(raw: string): string {
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return "Flexible";
  return parts
    .map((p) => {
      if (p === "onsite") return "On-site";
      if (p === "hybrid") return "Hybrid";
      if (p === "remote") return "Remote";
      return p;
    })
    .join(" · ");
}

export function ListingCardOpenToWork({
  slug,
  displayName,
  headline,
  domainsLabel,
  preferredLocations,
  workModePreferences,
  yearsExperience,
  publishedAt,
  createdAt,
  featured,
}: Props) {
  const meta = [
    domainsLabel,
    preferredLocations,
    workModeLabel(workModePreferences),
    yearsExperience != null ? `${yearsExperience}+ yrs` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const posted = publishedAt ?? createdAt;

  return (
    <li>
      <Link
        href={`/careers/open-to-work/${slug}`}
        className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm transition hover:border-[var(--accent)] active:bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent)_8%)]"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold leading-snug text-[var(--foreground)]">
              {displayName}
            </span>
            {featured ? (
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                Featured
              </span>
            ) : null}
            <span className="rounded-full border border-emerald-300/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Open to Work
            </span>
          </span>
          <span className="mt-1 block text-xs font-medium text-[var(--foreground)]">
            {headline}
          </span>
          {meta ? (
            <span className="mt-1 block text-xs text-[var(--muted)]">{meta}</span>
          ) : null}
          <span className="mt-1 block text-[10px] text-[var(--muted)]">
            Listed {formatPublishedDate(posted)}
          </span>
        </span>
        <span aria-hidden className="shrink-0 text-[var(--muted)]">
          →
        </span>
      </Link>
    </li>
  );
}
