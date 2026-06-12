import Link from "next/link";

type Props = {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
};

export function ListingEmptyState({ title, body, ctaHref, ctaLabel }: Props) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center">
      <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
      <Link
        href={ctaHref}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
