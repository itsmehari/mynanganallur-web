import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.redirect(new URL("/newsletter?error=missing", req.url));
  }
  try {
    const db = getDb();
    await db
      .update(newsletterSubscribers)
      .set({ unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribers.email, email));
  } catch (e) {
    console.warn("[newsletter] unsubscribe failed", e);
  }
  return NextResponse.redirect(new URL("/newsletter?unsubscribed=1", req.url));
}
