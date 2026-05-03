import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/newsletter?error=missing", req.url));
  }
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.confirmToken, token))
      .limit(1);
    if (!row) {
      return NextResponse.redirect(new URL("/newsletter?error=invalid", req.url));
    }
    await db
      .update(newsletterSubscribers)
      .set({ confirmedAt: new Date(), confirmToken: null })
      .where(eq(newsletterSubscribers.id, row.id));
    return NextResponse.redirect(
      new URL("/newsletter?confirmed=1", req.url),
    );
  } catch (e) {
    console.warn("[newsletter] confirm failed", e);
    return NextResponse.redirect(new URL("/newsletter?error=server", req.url));
  }
}
