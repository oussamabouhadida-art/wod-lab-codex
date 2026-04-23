import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0];
  const second = parts[1];

  if (routing.locales.includes(locale as (typeof routing.locales)[number]) && second === "admin" && parts[2] !== "login") {
    const key = request.cookies.get("admin_key")?.value;
    if (key !== process.env.ADMIN_SECRET_KEY) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|fr|es)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
