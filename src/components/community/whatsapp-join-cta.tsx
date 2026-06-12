"use client";

import { track } from "@/lib/analytics";
import { WHATSAPP_COMMUNITY_INVITE_URL } from "@/lib/community/whatsapp";

type Source = "hero" | "sticky" | "mid" | "band";

type Props = {
  source: Source;
  className?: string;
  children?: React.ReactNode;
};

export function WhatsappJoinCta({ source, className = "", children }: Props) {
  return (
    <a
      href={WHATSAPP_COMMUNITY_INVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("whatsapp_join_click", { source })}
    >
      {children ?? "Join group on WhatsApp"}
    </a>
  );
}
