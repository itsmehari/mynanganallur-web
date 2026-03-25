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
      className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--background))] text-sm"
      role="region"
      aria-label="Site notice"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-center sm:justify-between sm:text-left">
        <p className="max-w-3xl text-[var(--foreground)]">{ALERT.message}</p>
        <Link
          href={ALERT.href}
          className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-medium text-[var(--accent-fg)] transition hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {ALERT.cta}
        </Link>
      </div>
    </div>
  );
}
