"use client";

import { useEffect, useState } from "react";
import { WhatsappJoinCta } from "@/components/community/whatsapp-join-cta";

export function WhatsappStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:hidden"
      role="region"
      aria-label="Join WhatsApp group"
    >
      <WhatsappJoinCta
        source="sticky"
        className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      />
    </div>
  );
}
