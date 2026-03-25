"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { MegaNavDesktop } from "./mega-nav-desktop";
import { MegaNavMobile } from "./mega-nav-mobile";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="site-header-bar sticky top-0 z-[60] w-full border-b border-[var(--border)] border-t-[3px] border-t-[var(--accent)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface)_78%,transparent)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--accent)_35%,transparent)] to-transparent" />

      <div className="relative mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-4 md:gap-4 md:py-5">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          onClick={closeMobile}
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--accent-fg)] shadow-md transition group-hover:scale-[1.03] group-hover:shadow-lg md:h-12 md:w-12 md:rounded-2xl md:text-base"
            aria-hidden
          >
            MN
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="font-serif text-base font-bold tracking-tight text-[var(--foreground)] md:text-lg">
              mynanganallur
            </span>
            <span className="text-[11px] text-[var(--muted)] md:text-xs">
              News · directory · jobs · local events
            </span>
          </span>
        </Link>

        <MegaNavDesktop />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="focus-ring hidden min-h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--muted)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--foreground)] sm:inline-flex"
            aria-disabled
            title="Search coming soon"
          >
            Search
          </button>
          <button
            type="button"
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--foreground)] md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-mega-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-mega-nav" aria-live="polite">
        <MegaNavMobile open={mobileOpen} onClose={closeMobile} />
      </div>
    </header>
  );
}
