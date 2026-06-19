"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MegaNavPanel } from "./mega-nav-panel";
import { MEGA_NAV_SECTIONS, getMegaNavSection } from "./nav-config";

const CLOSE_DELAY_MS = 160;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`shrink-0 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function MegaNavDesktop() {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const reveal = useCallback(
    (id: string) => {
      clearCloseTimer();
      setOpenId(id);
    },
    [clearCloseTimer],
  );

  useEffect(() => {
    queueMicrotask(() => setOpenId(null));
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenId(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [clearCloseTimer],
  );

  const active = getMegaNavSection(openId);

  return (
    <div
      ref={rootRef}
      className="relative hidden min-w-0 flex-1 justify-center md:flex"
      onMouseLeave={scheduleClose}
    >
      <div className="relative inline-flex max-w-full flex-col items-center">
        <ul
          className="flex flex-nowrap items-center justify-center gap-0"
          role="menubar"
          aria-label="Site sections"
        >
          {MEGA_NAV_SECTIONS.map((s) => {
            const isOpen = openId === s.id;
            return (
              <li key={s.id} role="none" onMouseEnter={() => reveal(s.id)}>
                <button
                  type="button"
                  role="menuitem"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-controls={isOpen ? `mega-panel-${s.id}` : undefined}
                  id={`mega-trigger-${s.id}`}
                  className="focus-ring flex min-h-9 items-center gap-0.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-[13px] font-semibold text-[var(--muted)] transition hover:bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))] hover:text-[var(--foreground)] data-[open=true]:bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] data-[open=true]:text-[var(--accent)] lg:px-2.5 lg:text-sm"
                  data-open={isOpen}
                  onFocus={() => reveal(s.id)}
                  onClick={() =>
                    setOpenId((prev) => (prev === s.id ? null : s.id))
                  }
                >
                  {s.label}
                  <Chevron open={isOpen} />
                </button>
              </li>
            );
          })}
        </ul>

        {active ? (
          <div
            className="mega-nav-surface mega-nav-dropdown absolute left-1/2 top-full z-[55] w-[100dvw] max-w-[100dvw] -translate-x-1/2 border-b border-[var(--border)] shadow-[0_28px_56px_-16px_color-mix(in_srgb,var(--foreground)_14%,transparent)]"
            id={`mega-panel-${active.id}`}
            role="region"
            aria-labelledby={`mega-trigger-${active.id}`}
            onMouseEnter={clearCloseTimer}
          >
            <div className="mega-nav-mesh mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
              <MegaNavPanel section={active} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
