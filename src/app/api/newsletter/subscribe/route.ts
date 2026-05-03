import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsletterSubscribers } from "@/db/schema";
import { getSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendDoubleOptInEmail(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "mynanganallur.in <hello@mynanganallur.in>";
  const link = `${getSiteUrl()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const subject = "Confirm your subscription · mynanganallur.in";
  const html = `<p>Hi! Please confirm your subscription to the mynanganallur.in weekly digest:</p>
  <p><a href="${link}">Confirm subscription →</a></p>
  <p style="color:#666;font-size:12px">If you didn't request this, ignore this email.</p>`;

  if (!apiKey) {
    console.info("[email:dev] confirm link:", link);
    return;
  }
  await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: email, subject, html }),
  });
}

export async function POST(req: Request): Promise<Response> {
  let email = "";
  let locality: string | null = null;
  let source: string | null = null;
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      const j = (await req.json()) as {
        email?: string;
        locality?: string;
        source?: string;
      };
      email = (j.email ?? "").trim().toLowerCase();
      locality = j.locality?.trim() || null;
      source = j.source?.trim() || null;
    } catch {
      /* ignore */
    }
  } else {
    const fd = await req.formData();
    email = String(fd.get("email") ?? "")
      .trim()
      .toLowerCase();
    locality = (fd.get("locality") as string | null)?.trim() || null;
    source = (fd.get("source") as string | null)?.trim() || null;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  try {
    const db = getDb();
    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing?.confirmedAt) {
      return NextResponse.json({ ok: true, alreadyConfirmed: true });
    }

    const token = randomBytes(24).toString("hex");
    if (existing) {
      await db
        .update(newsletterSubscribers)
        .set({ confirmToken: token, locality, source })
        .where(eq(newsletterSubscribers.id, existing.id));
    } else {
      await db.insert(newsletterSubscribers).values({
        email,
        locality,
        source,
        confirmToken: token,
      });
    }
    await sendDoubleOptInEmail(email, token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.warn("[newsletter] subscribe failed", e);
    return NextResponse.json(
      { error: "Could not subscribe. Try again later." },
      { status: 500 },
    );
  }
}
