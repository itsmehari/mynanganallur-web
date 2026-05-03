"use client";

import { useCallback, useState } from "react";
import { track } from "@/lib/analytics";

type Props = {
  url: string;
  title: string;
  /** Used in analytics so we can compare reach across entity types. */
  channelLabel: string;
};

function withUtm(url: string, source: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) {
      u.searchParams.set("utm_source", source);
      u.searchParams.set("utm_medium", "share");
      u.searchParams.set("utm_campaign", "share-row");
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function ShareRow({ url, title, channelLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${withUtm(url, "wa")}`)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${withUtm(url, "email")}`)}`;

  const handleWa = useCallback(() => {
    track("share_click", { channel: "whatsapp", kind: channelLabel });
  }, [channelLabel]);

  const handleEmail = useCallback(() => {
    track("share_click", { channel: "email", kind: channelLabel });
  }, [channelLabel]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(withUtm(url, "copy"));
      setCopied(true);
      track("share_click", { channel: "copy", kind: channelLabel });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* swallow */
    }
  }, [url, channelLabel]);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Share
      </span>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWa}
        className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
      >
        WhatsApp
      </a>
      <a
        href={mailUrl}
        onClick={handleEmail}
        className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
      >
        Email
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
