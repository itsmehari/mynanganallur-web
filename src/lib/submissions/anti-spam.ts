/**
 * Anti-spam helpers for /submit/* server actions.
 *
 * - hashIp: SHA-256 of the client IP + AUTH_SECRET. We never store raw IPs.
 * - verifyHCaptcha: server-side check of the captcha token. Pass-through when
 *   keys are not configured (dev / preview), so local development isn't blocked.
 * - assertSubmissionAllowed: throws if more than N submissions/hour from an IP.
 */
import { createHash } from "node:crypto";
import { and, count, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db/client";
import { submissionLog } from "@/db/schema";

const RATE_LIMIT_PER_HOUR = 5;

export class SubmissionRejected extends Error {
  readonly code: "rate_limit" | "captcha" | "honeypot" | "validation";
  constructor(code: SubmissionRejected["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "SubmissionRejected";
  }
}

export async function getClientIp(): Promise<string | null> {
  try {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0]?.trim() ?? null;
    const real = h.get("x-real-ip");
    if (real) return real.trim();
    return null;
  } catch {
    return null;
  }
}

export function hashIp(ip: string | null): string {
  const salt = process.env.AUTH_SECRET ?? "mynanganallur";
  return createHash("sha256")
    .update(`${salt}:${ip ?? "anon"}`)
    .digest("hex")
    .slice(0, 32);
}

export async function verifyHCaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[hcaptcha] HCAPTCHA_SECRET not set — allowing submission");
    }
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data?.success);
  } catch (e) {
    console.warn("[hcaptcha] verify failed", e);
    return false;
  }
}

export async function assertSubmissionAllowed(
  route: string,
  ipHash: string,
): Promise<void> {
  const db = getDb();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [row] = await db
    .select({ n: count() })
    .from(submissionLog)
    .where(
      and(
        eq(submissionLog.ipHash, ipHash),
        gte(submissionLog.createdAt, since),
      ),
    );
  if (Number(row?.n ?? 0) >= RATE_LIMIT_PER_HOUR) {
    throw new SubmissionRejected(
      "rate_limit",
      `Too many submissions in the last hour. Please try again later.`,
    );
  }
  void route; // route currently informational; could be used for per-route limits
}

export async function logSubmission({
  route,
  entityType,
  entityId,
  ipHash,
  userAgent,
  status,
}: {
  route: string;
  entityType: string;
  entityId?: string | null;
  ipHash: string;
  userAgent?: string | null;
  status?: "ok" | "rejected";
}) {
  const db = getDb();
  await db.insert(submissionLog).values({
    route,
    entityType,
    entityId: entityId ?? null,
    ipHash,
    userAgent: userAgent ?? null,
    status: status ?? "ok",
  });
}
