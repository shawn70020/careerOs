import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createIntlMiddleware(routing);

function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (routing.locales.includes(first as (typeof routing.locales)[number])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

function getLocaleFromPath(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0];
  if (routing.locales.includes(first as (typeof routing.locales)[number])) {
    return first;
  }
  return routing.defaultLocale;
}

export default auth((req) => {
  const intlResponse = intlMiddleware(req);
  if (intlResponse?.status && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const pathname = stripLocale(req.nextUrl.pathname);
  const locale = getLocaleFromPath(req.nextUrl.pathname);
  const isLoggedIn = !!req.auth;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/api/demo") ||
    pathname.startsWith("/api/auth");

  if (!isLoggedIn && !isAuthPage && !isPublic) {
    const protectedPrefixes = [
      "/dashboard",
      "/career-profile",
      "/resume",
      "/jobs",
      "/learning",
      "/interview",
      "/knowledge-base",
      "/settings",
      "/onboarding",
    ];
    if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.nextUrl));
    }
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.nextUrl));
  }

  return intlResponse ?? NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
