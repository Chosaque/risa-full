import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["th", "en"] as const;
const DEFAULT_LOCALE = "th";

/**
 * Sends bare paths (`/about`) to a locale-prefixed one (`/th/about`), and makes
 * the active locale available to any server component via a request header —
 * which is what lets <Editable> resolve TH/EN without prop-drilling.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matched = LOCALES.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (matched) {
    const headers = new Headers(request.headers);
    headers.set("x-risa-locale", matched);
    headers.set("x-risa-pathname", pathname);
    return NextResponse.next({ request: { headers } });
  }

  const cookieLocale = request.cookies.get("risa_locale")?.value;
  const locale = LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
    ? cookieLocale!
    : DEFAULT_LOCALE;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|admin|_next|uploads|.*\\..*).*)"],
};
