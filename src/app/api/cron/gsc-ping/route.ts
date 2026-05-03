import { NextResponse } from "next/server";
import { pingGoogleSitemaps } from "@/lib/seo/gsc-ping";

export const dynamic = "force-dynamic";

/**
 * Cron-friendly endpoint to nudge GSC to recrawl all sitemaps.
 *
 * Wire on Vercel: project → Settings → Cron Jobs →
 *   Path: /api/cron/gsc-ping  Schedule: 0 1 * * * (01:00 UTC daily)
 *
 * Secured by `CRON_SECRET`; pass via `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const result = await pingGoogleSitemaps();
  return NextResponse.json({ ok: true, ...result });
}
