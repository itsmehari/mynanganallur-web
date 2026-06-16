import Link from "next/link";
import { CONNECT_ACTION_TILES } from "@/lib/nanganallur-connect-content";

export function ConnectActionGrid() {
  return (
    <section aria-labelledby="connect-actions-heading" className="mt-10">
      <h2
        id="connect-actions-heading"
        className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
      >
        Start here
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Jump to the section you need — everything links back to live listings and
        editorial on mynanganallur.in.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECT_ACTION_TILES.map((tile) => (
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
                Open
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
    </section>
  );
}
