import Link from "next/link";
import { formatPublishedDate, jobSalaryLine } from "@/lib/listings/format";

type Props = {
  slug: string;
  title: string;
  employerName: string;
  locationLabel: string | null;
  remotePolicy: string;
  salaryDisclosed: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: Date;
  featured: boolean;
};

export function ListingCardJob({
  slug,
  title,
  employerName,
  locationLabel,
  remotePolicy,
  salaryDisclosed,
  salaryMin,
  salaryMax,
  createdAt,
  featured,
}: Props) {
  const sal = jobSalaryLine(
    { salaryDisclosed, salaryMin, salaryMax },
    { forHub: true },
  );
  const meta = [
    employerName,
    locationLabel,
    remotePolicy !== "onsite" ? remotePolicy : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li>
      <Link
        href={`/jobs/${slug}`}
        className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm transition hover:border-[var(--accent)] active:bg-[color-mix(in_srgb,var(--surface)_92%,var(--accent)_8%)]"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold leading-snug text-[var(--foreground)]">
              {title}
            </span>
            {featured ? (
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                Featured
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-xs text-[var(--muted)]">{meta}</span>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            {sal ? (
              <span className="text-xs font-semibold text-[var(--accent)]">{sal}</span>
            ) : null}
            <span className="text-[10px] text-[var(--muted)]">
              Posted {formatPublishedDate(createdAt)}
            </span>
          </span>
        </span>
        <span aria-hidden className="shrink-0 text-[var(--muted)]">
          →
        </span>
      </Link>
    </li>
  );
}
