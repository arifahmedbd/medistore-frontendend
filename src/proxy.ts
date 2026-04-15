import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles } from "./constants/roles";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("__Secure-session_token") ||
    request.cookies.get("session_token");
  const isDashboardRoute =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/seller/dashboard") ||
    pathname.startsWith("/orders");

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let session = null;
  if (token) {
    try {
      const sessionRes = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: {
            cookie: `session_token=${token}`,
          },
        },
      );
      session = sessionRes.ok ? await sessionRes.json() : null;
    } catch {
      session = null;
    }
  }

  const role = session?.user?.role;

  if (session && pathname === "/") {
    if (role === Roles.admin)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === Roles.seller)
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }

  if (session && pathname.startsWith("/dashboard")) {
    if (role === Roles.admin)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === Roles.seller)
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    return NextResponse.redirect(new URL("/orders", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
