"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

type Props = {
  entityType: "article" | "event" | "job" | "property" | "directory";
  entityId: string;
};

type Counts = { helpful: number; not_helpful: number };

export function HelpfulButtons({ entityType, entityId }: Props) {
  const [counts, setCounts] = useState<Counts>({ helpful: 0, not_helpful: 0 });
  const [voted, setVoted] = useState<"helpful" | "not_helpful" | null>(null);
  const storageKey = `mn-react:${entityType}:${entityId}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "helpful" || saved === "not_helpful") setVoted(saved);
    fetch(`/api/reactions?entityType=${entityType}&entityId=${entityId}`)
      .then((r) => r.json())
      .then((c: Counts) => setCounts(c))
      .catch(() => undefined);
  }, [entityType, entityId, storageKey]);

  async function vote(value: "helpful" | "not_helpful") {
    setVoted(value);
    setCounts((c) => ({ ...c, [value]: c[value] + 1 }));
    window.localStorage.setItem(storageKey, value);
    try {
      const r = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId, value }),
      });
      if (r.ok) track("reaction_click", { kind: entityType, value });
    } catch {
      /* swallow */
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <span className="text-sm font-semibold text-[var(--foreground)]">
        Was this useful?
      </span>
      <button
        type="button"
        onClick={() => vote("helpful")}
        disabled={voted === "helpful"}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${voted === "helpful" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-[var(--border)] text-[var(--foreground)]"}`}
      >
        Yes ({counts.helpful})
      </button>
      <button
        type="button"
        onClick={() => vote("not_helpful")}
        disabled={voted === "not_helpful"}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${voted === "not_helpful" ? "border-red-400 bg-red-50 text-red-700" : "border-[var(--border)] text-[var(--foreground)]"}`}
      >
        No ({counts.not_helpful})
      </button>
    </div>
  );
}
