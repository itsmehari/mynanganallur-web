import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { reactions } from "@/db/schema";
import { hashIp } from "@/lib/submissions";

export const dynamic = "force-dynamic";

const VALID_VALUES = new Set(["helpful", "not_helpful"]);

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

export async function POST(req: Request): Promise<Response> {
  let body: { entityType?: string; entityId?: string; value?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* ignore */
  }

  const entityType = body.entityType?.trim();
  const entityId = body.entityId?.trim();
  const value = body.value?.trim();
  if (!entityType || !entityId || !value || !VALID_VALUES.has(value)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const db = getDb();
    const ipHash = hashIp(getIp(req));
    await db
      .insert(reactions)
      .values({ entityType, entityId, ipHash, value })
      .onConflictDoUpdate({
        target: [reactions.entityType, reactions.entityId, reactions.ipHash],
        set: { value, createdAt: new Date() },
      });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.warn("[reactions] failed", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");
  if (!entityType || !entityId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    const db = getDb();
    const rows = await db
      .select({
        value: reactions.value,
        n: sql<number>`count(*)::int`,
      })
      .from(reactions)
      .where(
        and(
          eq(reactions.entityType, entityType),
          eq(reactions.entityId, entityId),
        ),
      )
      .groupBy(reactions.value);
    const counts: Record<string, number> = { helpful: 0, not_helpful: 0 };
    for (const r of rows) counts[r.value] = r.n;
    return NextResponse.json(counts);
  } catch (e) {
    console.warn("[reactions:get] failed", e);
    return NextResponse.json(
      { helpful: 0, not_helpful: 0 },
      { status: 200 },
    );
  }
}
