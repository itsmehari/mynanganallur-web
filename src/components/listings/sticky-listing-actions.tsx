"use client";

import { useCallback } from "react";
import { track } from "@/lib/analytics";
import { contactTelHref, contactWaHref } from "@/lib/listings/format";

export type StickyAction =
  | { type: "call"; phone: string; label?: string }
  | { type: "whatsapp"; phone: string; message?: string; label?: string }
  | { type: "link"; href: string; label: string; external?: boolean; variant?: "primary" | "secondary" }
  | { type: "share"; url: string; title: string; channelLabel: string };

type Props = {
  actions: StickyAction[];
  /** Hide on large screens when desktop sidebar has the same CTAs */
  hideOnDesktop?: boolean;
};

export function StickyListingActions({
  actions,
  hideOnDesktop = true,
}: Props) {
  const handleShare = useCallback(
    async (url: string, title: string, channelLabel: string) => {
      const text = `${title} — ${url}`;
      try {
        if (navigator.share) {
          await navigator.share({ title, url });
          track("share_click", { channel: "native", kind: channelLabel });
          return;
        }
        await navigator.clipboard.writeText(text);
        track("share_click", { channel: "copy", kind: channelLabel });
      } catch {
        /* user cancelled */
      }
    },
    [],
  );

  if (actions.length === 0) return null;

  const wrapClass = hideOnDesktop
    ? "fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
    : "fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md";

  return (
    <div className={wrapClass} role="region" aria-label="Quick actions">
      <div className="mx-auto flex max-w-[720px] gap-2">
        {actions.map((action) => {
          if (action.type === "call") {
            return (
              <a
                key="call"
                href={contactTelHref(action.phone)}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)]"
              >
                {action.label ?? "Call"}
              </a>
            );
          }
          if (action.type === "whatsapp") {
            return (
              <a
                key="wa"
                href={contactWaHref(action.phone, action.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white"
              >
                {action.label ?? "WhatsApp"}
              </a>
            );
          }
          if (action.type === "link") {
            const primary = action.variant !== "secondary";
            return (
              <a
                key={action.href}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className={
                  primary
                    ? "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white"
                    : "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)]"
                }
              >
                {action.label}
              </a>
            );
          }
          return (
            <button
              key="share"
              type="button"
              onClick={() =>
                handleShare(action.url, action.title, action.channelLabel)
              }
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--foreground)]"
            >
              Share
            </button>
          );
        })}
      </div>
    </div>
  );
}
