"use client";

import { usePathname } from "next/navigation";
import { WhatsappCommunityBand } from "@/components/community/whatsapp-community-band";
import { WHATSAPP_PAGE_PATH } from "@/lib/community/whatsapp";

/** Hides the global promo band on the dedicated WhatsApp landing page. */
export function WhatsappBandGate() {
  const pathname = usePathname();
  if (pathname === WHATSAPP_PAGE_PATH) return null;
  return <WhatsappCommunityBand />;
}
