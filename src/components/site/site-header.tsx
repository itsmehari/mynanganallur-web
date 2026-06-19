"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { MegaNavDesktop } from "./mega-nav-desktop";
import { MegaNavMobile } from "./mega-nav-mobile";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="site-header-bar w-full border-b border-[var(--border)] border-t-2 border-t-[var(--accent)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface)_82%,transparent)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--accent)_35%,transparent)] to-transparent" />

      <div className="relative mx-auto flex h-14 max-w-[1280px] items-center gap-2 px-3 sm:px-4 lg:h-[58px] lg:gap-3">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:gap-2.5"
          onClick={closeMobile}
        >
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)] shadow-sm ring-1 ring-[var(--border)] transition group-hover:scale-[1.02] group-hover:shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
            <Image
              src="/MyNanganallur-logo.png"
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-contain p-0.5"
              priority
            />
          </span>
          <span className="hidden min-w-0 flex-col leading-none lg:flex">
            <span className="truncate font-serif text-base font-bold tracking-tight text-[var(--foreground)] xl:text-lg">
              mynanganallur
            </span>
            <span className="mt-0.5 hidden truncate text-[10px] text-[var(--muted)] xl:block">
              News · directory · jobs · events
            </span>
          </span>
        </Link>

        <MegaNavDesktop />

        <div className="ml-auto flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
          <Link
            href="/submit/business"
            className="hidden min-h-9 items-center rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:inline-flex lg:px-3.5"
          >
            <span className="lg:hidden">List</span>
            <span className="hidden lg:inline">List your business</span>
          </Link>

          <Link
            href="/search"
            className="focus-ring hidden min-h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] hover:text-[var(--accent)] md:inline-flex xl:hidden"
            aria-label="Search mynanganallur.in"
          >
            <SearchIcon />
          </Link>

          <form
            action="/search"
            method="get"
            role="search"
            className="hidden min-h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-3 pr-1 xl:inline-flex"
          >
            <label htmlFor="header-search" className="sr-only">
              Search mynanganallur.in
            </label>
            <SearchIcon className="shrink-0 text-[var(--muted)]" />
            <input
              id="header-search"
              type="search"
              name="q"
              placeholder="Search…"
              className="w-28 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none 2xl:w-36"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              Go
            </button>
          </form>

          <button
            type="button"
            className="focus-ring inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-mega-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
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
