import { SiteTopChrome } from "@/components/site/site-top-chrome";
import { WhatsappBandGate } from "@/components/community/whatsapp-band-gate";
import { SiteFooter } from "@/components/site/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteTopChrome />
      <main className="min-w-0 flex-1">{children}</main>
      <WhatsappBandGate />
      <SiteFooter />
    </>
  );
}
