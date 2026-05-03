import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { searchAlerts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  let body: {
    email?: string;
    query?: string;
    locality?: string;
    entityType?: string;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* allow form-encoded fallback */
    const fd = await req.formData().catch(() => null);
    if (fd) {
      body = {
        email: String(fd.get("email") ?? ""),
        query: String(fd.get("query") ?? ""),
        locality: String(fd.get("locality") ?? ""),
        entityType: String(fd.get("entityType") ?? ""),
      };
    }
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  const entityType = (body.entityType || "jobs").trim();

  try {
    const db = getDb();
    await db.insert(searchAlerts).values({
      email,
      query: body.query?.trim() || null,
      locality: body.locality?.trim() || null,
      entityType,
    });
  } catch (e) {
    console.warn("[search-alerts] insert failed", e);
    return NextResponse.json({ error: "Could not save alert." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
