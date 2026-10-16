import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { listingPageViews } from "@/db/schema/tables";
import { hashIp } from "@/lib/submissions";

export const dynamic = "force-dynamic";

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

export async function POST(req: Request): Promise<Response> {
  let body: { entityType?: string; entityId?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* ignore */
  }

  const entityType = body.entityType?.trim();
  const entityId = body.entityId?.trim();
  if (!entityType || !entityId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const db = getDb();
    const visitorHash = hashIp(getIp(req));
    await db
      .insert(listingPageViews)
      .values({ entityType, entityId, visitorHash })
      .onConflictDoNothing({
        target: [
          listingPageViews.entityType,
          listingPageViews.entityId,
          listingPageViews.visitorHash,
        ],
      });

    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(listingPageViews)
      .where(
        and(
          eq(listingPageViews.entityType, entityType),
          eq(listingPageViews.entityId, entityId),
        ),
      );

    return NextResponse.json({ uniqueViews: row?.n ?? 0 });
  } catch (e) {
    console.warn("[page-views] failed", e);
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
    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(listingPageViews)
      .where(
        and(
          eq(listingPageViews.entityType, entityType),
          eq(listingPageViews.entityId, entityId),
        ),
      );
    return NextResponse.json({ uniqueViews: row?.n ?? 0 });
  } catch (e) {
    console.warn("[page-views:get] failed", e);
    return NextResponse.json({ uniqueViews: 0 }, { status: 200 });
  }
}
