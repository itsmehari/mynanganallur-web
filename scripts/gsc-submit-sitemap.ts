/**
 * Submit sitemap.xml to Google Search Console via API (Webmasters v3).
 *
 * One-time Google Cloud setup:
 * 1. Create a project → APIs & Services → enable "Google Search Console API".
 * 2. IAM → Service Accounts → create SA → Keys → JSON key (local only; never commit).
 * 3. Search Console → Settings → Users and permissions → Add user → paste SA email
 *    (e.g. name@project.iam.gserviceaccount.com) with Full permission.
 *
 * GSC_SITE_URL must match the property exactly:
 * - URL-prefix property: https://mynanganallur.in/ (note trailing slash)
 * - Domain property: sc-domain:mynanganallur.in
 *
 * Run: npm run gsc:submit-sitemap
 */

import { config as loadEnv } from "dotenv";
import { google } from "googleapis";

loadEnv({ path: ".env.local" });
loadEnv();

const SCOPE = "https://www.googleapis.com/auth/webmasters";

function loadAuth(): InstanceType<typeof google.auth.GoogleAuth> {
  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    const credentials = JSON.parse(inline) as object;
    return new google.auth.GoogleAuth({ credentials, scopes: [SCOPE] });
  }
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (keyFile) {
    return new google.auth.GoogleAuth({
      keyFile,
      scopes: [SCOPE],
    });
  }
  throw new Error(
    "Set GOOGLE_APPLICATION_CREDENTIALS (path to SA JSON) or GSC_SERVICE_ACCOUNT_JSON (raw JSON string).",
  );
}

function resolveSiteUrl(): string {
  const explicit = process.env.GSC_SITE_URL?.trim();
  if (explicit) return explicit;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (base) return `${base}/`;
  throw new Error(
    "Set GSC_SITE_URL (must match Search Console property) or NEXT_PUBLIC_SITE_URL.",
  );
}

function resolveSitemapUrl(siteUrl: string): string {
  const explicit = process.env.GSC_SITEMAP_URL?.trim();
  if (explicit) return explicit;
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length);
    return `https://${domain}/sitemap.xml`;
  }
  const origin = siteUrl.replace(/\/$/, "");
  return `${origin}/sitemap.xml`;
}

async function main() {
  const auth = loadAuth();
  const siteUrl = resolveSiteUrl();
  const feedpath = resolveSitemapUrl(siteUrl);

  const webmasters = google.webmasters({ version: "v3", auth });
  await webmasters.sitemaps.submit({ siteUrl, feedpath });

  console.log("Submitted sitemap to Search Console.");
  console.log(`  property: ${siteUrl}`);
  console.log(`  sitemap:  ${feedpath}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
