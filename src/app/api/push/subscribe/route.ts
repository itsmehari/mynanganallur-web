import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { webPushSubscriptions } from "@/db/schema";
import { isFlagOn } from "@/lib/flags";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (!isFlagOn("push")) {
    return NextResponse.json({ error: "push disabled" }, { status: 404 });
  }
  let body: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
    locality?: string;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* ignore */
  }
  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "Missing keys" }, { status: 400 });
  }
  try {
    const db = getDb();
    await db
      .insert(webPushSubscriptions)
      .values({
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        locality: body.locality ?? null,
      })
      .onConflictDoNothing({ target: webPushSubscriptions.endpoint });
  } catch (e) {
    console.warn("[push] subscribe failed", e);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
