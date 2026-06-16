import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LISTING_OWNER_COOKIE } from "@/lib/listing-owner/constants";

/**
 * Session cookies for Auth.js v5 (names vary by dev/prod/https).
 * Full session validation happens in Server Components / Route Handlers via `auth()`.
 */
function hasAuthSessionCookie(request: NextRequest): boolean {
  const names = request.cookies.getAll().map((c) => c.name);
  return names.some(
    (n) =>
      n === "authjs.session-token" ||
      n.startsWith("__Secure-authjs") ||
      n.startsWith("__Host-authjs"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/my/listings") && !request.cookies.get(LISTING_OWNER_COOKIE)?.value) {
    const login = new URL("/my/login", request.nextUrl.origin);
    login.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(login);
  }

  if (
    pathname.startsWith("/admin") &&
    !hasAuthSessionCookie(request)
  ) {
    const signIn = new URL("/api/auth/signin", request.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/my/listings/:path*"],
};
