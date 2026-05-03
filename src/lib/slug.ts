/**
 * Deterministic slug generator for user-submitted content.
 *
 * Aggressively conservative: lowercase ASCII, words separated by hyphens, no
 * leading/trailing hyphens, capped at 80 chars. Caller is responsible for
 * uniqueness checks against the DB.
 */
export function slugify(input: string, maxLen = 80): string {
  const normalized = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.slice(0, maxLen).replace(/-+$/g, "");
}

export function shortToken(length = 8): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}
