import { AlertBar } from "@/components/site/alert-bar";
import { WhatsappCommunityBand } from "@/components/community/whatsapp-community-band";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AlertBar />
      <SiteHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <WhatsappCommunityBand />
      <SiteFooter />
    </>
  );
}
