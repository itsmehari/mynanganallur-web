/**
 * Shared validation + city lookup for /submit/* server actions.
 */
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db/client";
import { cities } from "@/db/schema";
import { SubmissionRejected } from "./anti-spam";

const CITY_SLUG = "nanganallur";

let cachedCityId: string | null = null;

export async function getCityId(): Promise<string> {
  if (cachedCityId) return cachedCityId;
  const db = getDb();
  const [row] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, CITY_SLUG))
    .limit(1);
  if (!row) {
    throw new Error("City 'nanganallur' is missing — run db:seed:live first.");
  }
  cachedCityId = row.id;
  return row.id;
}

export function readField(
  fd: FormData,
  name: string,
  opts: { required?: boolean; max?: number; pattern?: RegExp; label?: string } = {},
): string {
  const raw = fd.get(name);
  const v = typeof raw === "string" ? raw.trim() : "";
  if (opts.required && !v) {
    throw new SubmissionRejected(
      "validation",
      `${opts.label ?? name} is required.`,
    );
  }
  if (opts.max && v.length > opts.max) {
    throw new SubmissionRejected(
      "validation",
      `${opts.label ?? name} is too long (max ${opts.max}).`,
    );
  }
  if (opts.pattern && v && !opts.pattern.test(v)) {
    throw new SubmissionRejected(
      "validation",
      `${opts.label ?? name} is in an unexpected format.`,
    );
  }
  return v;
}

export function readOptionalInt(fd: FormData, name: string): number | null {
  const raw = fd.get(name);
  const v = typeof raw === "string" ? raw.trim() : "";
  if (!v) return null;
  const n = Number(v.replace(/[^0-9-]/g, ""));
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

export function readBool(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true" || v === "1";
}

export function isHoneypotTriggered(fd: FormData): boolean {
  const v = fd.get("company_url");
  return typeof v === "string" && v.trim().length > 0;
}

export async function getUserAgent(): Promise<string | null> {
  try {
    const h = await headers();
    return h.get("user-agent");
  } catch {
    return null;
  }
}
