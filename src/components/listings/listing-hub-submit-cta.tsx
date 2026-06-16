import Link from "next/link";

type Props = {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

export function ListingHubSubmitCta({
  title,
  body,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
  className = "",
}: Props) {
  return (
    <aside
      className={`mt-8 rounded-2xl border border-[var(--accent)]/25 bg-[color-mix(in_srgb,var(--accent)_6%,var(--surface))] px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6 ${className}`.trim()}
      aria-label="Submit a listing"
    >
      <div className="min-w-0">
        <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
      </div>
      <div className="mt-4 flex shrink-0 flex-wrap items-center gap-3 sm:mt-0">
        <Link
          href={ctaHref}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {ctaLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
