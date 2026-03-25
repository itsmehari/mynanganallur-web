/** URL segment → exact `articles.category` value (local news). */
export const TOPIC_SLUG_TO_CATEGORY: Record<string, string> = {
  politics: "Politics",
  local: "Local",
  elections: "Elections",
  economy: "Economy",
  consumer: "Consumer",
  mobility: "Mobility",
};

export function categoryToTopicSlug(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function topicSlugToCategory(topicSlug: string): string | undefined {
  return TOPIC_SLUG_TO_CATEGORY[topicSlug];
}
