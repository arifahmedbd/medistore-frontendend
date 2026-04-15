import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles } from "./constants/roles";
import { userService } from "./services/session.servicec";

const publicPaths = ["/", "/public", "/login"];
const privatePaths = ["/private"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data } = await userService.getSession();

  const isAuthenticated = !!data;
  const role = data?.data?.role;

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/seller/dashboard");

  if (!isAuthenticated && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && pathname === "/") {
    if (role === Roles.admin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === Roles.seller) {
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }
  }

  if (isAuthenticated) {
    if (role === Roles.admin && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (role === Roles.seller && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }
  }

  const isPrivatePath = privatePaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isPrivatePath) {
    const token =
      request.cookies.get("__Secure-session_token") ||
      request.cookies.get("session_token");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/",
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/seller-dashboard/:path*",
  ],
};
