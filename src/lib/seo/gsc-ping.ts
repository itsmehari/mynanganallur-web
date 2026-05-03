/**
 * Best-effort GSC sitemap ping. Used by the admin Approve action and the
 * nightly cron — never throws so it can't block publishing.
 *
 * If `GSC_SITE_URL` and either `GSC_SERVICE_ACCOUNT_JSON` or
 * `GOOGLE_APPLICATION_CREDENTIALS` are not set, this no-ops with a console
 * note so it's obvious in dev.
 */
const SCOPE = "https://www.googleapis.com/auth/webmasters";

const SITEMAPS = ["sitemap.xml", "sitemap-news.xml", "sitemap-images.xml"];

export async function pingGoogleSitemaps(): Promise<{
  pinged: string[];
  skipped?: string;
}> {
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  if (!siteUrl) return { pinged: [], skipped: "GSC_SITE_URL not set" };

  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!inline && !keyFile) {
    return { pinged: [], skipped: "no GSC credentials" };
  }

  type GoogleAuthCtor = new (opts: {
    credentials?: object;
    keyFile?: string;
    scopes: string[];
  }) => { getAccessToken: () => Promise<string> };

  type GoogleApis = {
    auth: { GoogleAuth: GoogleAuthCtor };
  };

  let google: GoogleApis | null = null;
  try {
    google = (await import("googleapis")) as unknown as GoogleApis;
  } catch {
    return { pinged: [], skipped: "googleapis not installed" };
  }

  let token: string;
  try {
    const auth = inline
      ? new google.auth.GoogleAuth({
          credentials: JSON.parse(inline) as object,
          scopes: [SCOPE],
        })
      : new google.auth.GoogleAuth({ keyFile: keyFile!, scopes: [SCOPE] });
    token = await auth.getAccessToken();
  } catch (e) {
    console.warn("[gsc] auth failed", e);
    return { pinged: [], skipped: "auth failed" };
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in";
  const pinged: string[] = [];

  for (const path of SITEMAPS) {
    const feedpath = `${base}/${path}`;
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`;
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) pinged.push(feedpath);
      else console.warn(`[gsc] PUT ${feedpath} → ${res.status}`);
    } catch (e) {
      console.warn(`[gsc] ${feedpath}`, e);
    }
  }
  return { pinged };
}
