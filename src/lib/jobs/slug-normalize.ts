/**
 * Next.js may hand us a decoded Unicode slug or a still-encoded one.
 * Build lookup candidates so Tamil-script job URLs resolve either way.
 */
export function jobSlugLookupCandidates(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const out: string[] = [trimmed];

  try {
    const decoded = decodeURIComponent(trimmed);
    if (decoded && decoded !== trimmed) out.push(decoded);
  } catch {
    /* ignore malformed sequences */
  }

  try {
    const encoded = encodeURIComponent(trimmed);
    if (encoded && encoded !== trimmed) out.push(encoded);
  } catch {
    /* ignore */
  }

  // Double-decoding guard for rows stored percent-encoded.
  try {
    const once = decodeURIComponent(trimmed);
    const twice = decodeURIComponent(once);
    if (twice && !out.includes(twice)) out.push(twice);
  } catch {
    /* ignore */
  }

  return [...new Set(out)];
}

/** True when the string looks like a percent-encoded path segment. */
export function isPercentEncodedSlug(slug: string): boolean {
  return /%[0-9A-Fa-f]{2}/.test(slug);
}

/**
 * Path segment for hrefs / sitemap.
 * If the DB already stores a percent-encoded Tamil slug, do not encode again.
 */
export function jobSlugPathSegment(slug: string): string {
  if (isPercentEncodedSlug(slug)) return slug;
  return encodeURIComponent(slug);
}
