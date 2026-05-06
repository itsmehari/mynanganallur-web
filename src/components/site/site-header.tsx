"use client";

import Image from "next/image";
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
          className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:gap-4"
          onClick={closeMobile}
        >
          <span className="relative flex h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-[var(--surface)] shadow-md ring-1 ring-[var(--border)] transition group-hover:scale-[1.03] group-hover:shadow-lg md:h-24 md:w-24 md:rounded-3xl">
            <Image
              src="/MyNanganallur-logo.png"
              alt=""
              width={192}
              height={192}
              className="h-full w-full object-contain p-1"
              priority
            />
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
              mynanganallur
            </span>
            <span className="text-sm text-[var(--muted)] md:text-base">
              News · directory · jobs · local events
            </span>
          </span>
        </Link>

        <MegaNavDesktop />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <form
            action="/search"
            method="get"
            role="search"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 sm:inline-flex"
          >
            <label htmlFor="header-search" className="sr-only">
              Search mynanganallur.in
            </label>
            <input
              id="header-search"
              type="search"
              name="q"
              placeholder="Search…"
              className="w-44 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white"
            >
              Go
            </button>
          </form>
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
