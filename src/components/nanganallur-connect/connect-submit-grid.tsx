import Link from "next/link";
import { CONNECT_SUBMIT_TILES } from "@/lib/nanganallur-connect-content";

export function ConnectSubmitGrid() {
  return (
    <section
      aria-labelledby="connect-submit-heading"
      className="mt-12 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] p-6 sm:p-8"
    >
      <h2
        id="connect-submit-heading"
        className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
      >
        List on mynanganallur.in
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Post a job, property, event, business, or Open to Work profile — free
        standard listings, reviewed before they go live.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECT_SUBMIT_TILES.map((tile) => (
          <li key={tile.href}>
            <Link
              href={tile.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: tile.accent }}
                aria-hidden
              >
                {tile.label.charAt(0)}
              </span>
              <p className="mt-4 text-base font-semibold text-[var(--foreground)]">
                {tile.label}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                {tile.description}
              </p>
              <span className="mt-4 text-xs font-semibold text-[var(--accent)]">
                Start
                <span
                  className="ml-1 inline-block transition group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Not sure which form to use?{" "}
        <Link
          href="/submit"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          See all submit options
        </Link>
        .
      </p>
    </section>
  );
}
