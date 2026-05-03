import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Image upload endpoint for /admin/* and /submit/*.
 *
 * Uses Vercel Blob if `BLOB_READ_WRITE_TOKEN` is configured. Falls back to a
 * helpful error otherwise so it's obvious in dev when the integration isn't
 * set up yet.
 *
 * Returns `{ url }` on success.
 */
export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  const role = session?.user?.role;
  // For now, only staff can upload — submission flow uses moderator-added images post-approval.
  if (role !== "admin" && role !== "editor") {
    return NextResponse.json(
      { error: "Sign in as editor or admin to upload." },
      { status: 401 },
    );
  }

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported type." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 4MB)." }, { status: 413 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN not configured. See .env.example for setup.",
      },
      { status: 503 },
    );
  }

  // Lazy-load the SDK so the route bundle doesn't pay the cost when not used.
  type BlobModule = {
    put: (
      pathname: string,
      body: Blob | File,
      options: { access: "public"; token: string },
    ) => Promise<{ url: string }>;
  };
  let putFn: BlobModule["put"] | null = null;
  try {
    const mod = (await import("@vercel/blob")) as unknown as BlobModule;
    putFn = mod.put;
  } catch {
    return NextResponse.json(
      { error: "Install @vercel/blob to enable uploads." },
      { status: 503 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safe = `uploads/${crypto.randomUUID()}.${ext}`;
  const result = await putFn(safe, file, { access: "public", token });
  return NextResponse.json({ url: result.url });
}
