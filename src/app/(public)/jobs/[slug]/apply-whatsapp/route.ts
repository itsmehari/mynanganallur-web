import { NextResponse } from "next/server";
import { getOpenJobBySlug } from "@/domains/jobs";
import { getSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Server redirect so the job page HTML does not expose wa.me or phone digits in href. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const row = await getOpenJobBySlug(slug);
  if (!row?.job.contactPhone?.trim()) {
    return NextResponse.redirect(new URL("/jobs", getSiteUrl()), 302);
  }
  const digits = row.job.contactPhone.replace(/\D/g, "");
  if (!digits) {
    return NextResponse.redirect(new URL("/jobs", getSiteUrl()), 302);
  }
  const target = `https://wa.me/91${digits}`;
  return NextResponse.redirect(target, {
    status: 302,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
