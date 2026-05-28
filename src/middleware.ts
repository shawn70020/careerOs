import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createIntlMiddleware(routing);

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

export default async function middleware(req: NextRequest) {
  const intlResponse = handleI18nRouting(req);

  if (intlResponse.headers.has("location")) {
    return intlResponse;
  }

  const pathname = stripLocale(req.nextUrl.pathname);
  const locale = getLocaleFromPath(req.nextUrl.pathname);
  const isProduction = process.env.NODE_ENV === "production";
  const sessionCookie = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  const token = await getToken({
    req,
    secret: authConfig.secret,
    secureCookie: isProduction,
    cookieName: sessionCookie,
    salt: sessionCookie,
  });
  const isLoggedIn = !!token;
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

  return intlResponse;
}

export const config = {
  matcher: ["/", "/(en|zh-TW)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
