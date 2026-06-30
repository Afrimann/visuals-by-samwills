import { NextRequest, NextResponse } from "next/server";

const SITE_LIVE = process.env.SITE_LIVE === "true";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except the sign-in page
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/sign-in")) {
    const session = request.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/sign-in", request.url));
    }
  }

  // Block public routes until the site is live
  // Always allow robots.txt and sitemap.xml so search engines can find them
  const isSeoRoute = pathname === "/robots.txt" || pathname === "/sitemap.xml";
  if (!SITE_LIVE && !isSeoRoute && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/admin/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
