/** Build GET query string preserving existing params when toggling a chip/tab. */
export function buildListingQuery(
  base: Record<string, string | undefined | null>,
  patch: Record<string, string | null | undefined>,
): string {
  const params = new URLSearchParams();
  const merged = { ...base, ...patch };
  for (const [key, value] of Object.entries(merged)) {
    if (value?.trim()) params.set(key, value.trim());
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
