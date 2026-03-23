import { Section } from "@/components/home/section";
import {
  EditorsRevealGrid,
  NewsRevealGrid,
} from "@/components/home/news-reveal-cards";
import type { PublicArticleRow } from "@/domains/news";

export function HomeDbNewsSections({
  latest,
  featured,
}: {
  latest: PublicArticleRow[];
  featured: PublicArticleRow[];
}) {
  return (
    <>
      <Section
        eyebrow="Live desk"
        title="News bulletin"
        subtitle="Stories load from our Neon database — report, analysis, and one interactive per piece."
        action={{
          href: "/chennai-local-news",
          label: "Newspaper layout",
        }}
      >
        <NewsRevealGrid articles={latest} variant="bulletin" />
      </Section>
      <Section
        eyebrow="Curated"
        title="Editor's picks"
        subtitle="Featured on the desk — hover a card on desktop, tap on mobile to reveal the deck."
        action={{
          href: "/chennai-local-news",
          label: "All stories",
        }}
      >
        <EditorsRevealGrid articles={featured} />
      </Section>
    </>
  );
}
