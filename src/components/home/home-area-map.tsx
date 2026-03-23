"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CHENNAI_GEO_VERSION,
  chennaiZones,
  type ChennaiZone,
} from "@/lib/chennai-zones";

function ZoneCard({
  zone,
  active,
  onHover,
  onLeave,
}: {
  zone: ChennaiZone;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={`/areas/${zone.slug}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${active ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] shadow-md" : "border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:shadow-md"} ${zone.gridClass}`}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {zone.label}
        </p>
        {zone.gccZoneNumber ? (
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            GCC zone ref · {zone.gccZoneNumber}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        {zone.blurb}
      </p>
      <span className="mt-4 inline-flex items-center text-xs font-semibold text-[var(--accent)]">
        Open area hub
        <span
          className="ml-1 transition group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </span>
    </Link>
  );
}

export function HomeAreaMap() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,280px)] lg:items-start">
      <div>
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-[auto_auto_auto]"
          role="list"
          aria-label="Greater Chennai macro regions"
        >
          {chennaiZones.map((zone) => (
            <div key={zone.slug} role="listitem" className="min-h-[120px]">
              <ZoneCard
                zone={zone}
                active={activeSlug === zone.slug}
                onHover={() => setActiveSlug(zone.slug)}
                onLeave={() => setActiveSlug(null)}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Map data version <code className="rounded bg-[var(--background)] px-1 py-0.5">{CHENNAI_GEO_VERSION}</code>
          . We will merge official GCC polygons when published in open form.
        </p>
      </div>

      <aside
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--wave)_35%,var(--surface))] p-6"
        aria-hidden={false}
      >
        <div className="animate-gentle-float pointer-events-none absolute -right-6 -top-10 h-40 w-40 rounded-full bg-[var(--accent)] opacity-15 blur-3xl" />
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Bay-side orientation
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          This bento grid is a navigational map: tap a tile to open hyperlocal
          hubs for news, events, and listings as we wire data in.
        </p>
        <svg
          viewBox="0 0 200 220"
          className="mt-6 w-full text-[var(--accent)] opacity-80"
          aria-hidden
        >
          <path
            fill="currentColor"
            fillOpacity="0.12"
            d="M20 180 Q60 140 100 150 T180 130 L185 200 L15 205 Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            d="M30 175 C70 120 120 100 175 95"
          />
          <text
            x="100"
            y="195"
            textAnchor="middle"
            fill="currentColor"
            fillOpacity="0.5"
            fontSize="10"
          >
            Bay of Bengal →
          </text>
        </svg>
      </aside>
    </div>
  );
}
