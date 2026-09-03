import "server-only";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";

/** Active locale for the current request, set by middleware. */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const v = h.get("x-risa-locale") ?? undefined;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

/** Path of the current request, including the locale prefix. */
export async function getPathname(): Promise<string> {
  return (await headers()).get("x-risa-pathname") ?? "/";
}

/** The same path under the other locale, for the TH/EN switch. */
export async function getAlternatePath(target: Locale): Promise<string> {
  const pathname = await getPathname();
  const rest = pathname.replace(/^\/(th|en)/, "");
  return `/${target}${rest}`;
}
