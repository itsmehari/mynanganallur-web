import Link from "next/link";

const ALERT = {
  message:
    "Northeast monsoon readiness: GCC desilting dashboards and ward helplines — guides coming soon.",
  href: "/local-news",
  cta: "Read civic desk",
};

export function AlertBar() {
  return (
    <div
      className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--background))] text-xs sm:text-sm"
      role="region"
      aria-label="Site notice"
    >
      <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-3 px-3 sm:px-4">
        <p className="min-w-0 truncate text-[var(--foreground)]">{ALERT.message}</p>
        <Link
          href={ALERT.href}
          className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold text-[var(--accent-fg)] transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:text-xs"
        >
          {ALERT.cta}
        </Link>
      </div>
    </div>
  );
}
