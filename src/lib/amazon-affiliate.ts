/**
 * Amazon Associates — public storefront / short link from env.
 * Used by homepage and interior affiliate UI; unset = components render nothing.
 */
export function getAmazonAffiliateUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_URL?.trim();
  return u || null;
}
