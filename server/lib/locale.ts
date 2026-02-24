/**
 * Server-side locale support.
 * Uses Accept-Language header and returns messages in the requested language.
 */

import en from "../locales/en.json";
import ar from "../locales/ar.json";

export type SupportedLocale = "en" | "ar";

const supportedLocales: SupportedLocale[] = ["en", "ar"];

const messages: Record<SupportedLocale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  ar: ar as Record<string, unknown>,
};

/**
 * Get preferred locale from Accept-Language header.
 * Example: "ar,en-US;q=0.9,en;q=0.8" -> "ar"
 */
export function getLocaleFromHeader(acceptLanguage: string | undefined): SupportedLocale {
  if (!acceptLanguage) return "en";
  const parts = acceptLanguage.split(",").map((p) => p.trim().split(";")[0]);
  for (const part of parts) {
    const lang = part.split("-")[0].toLowerCase();
    if (supportedLocales.includes(lang as SupportedLocale)) {
      return lang as SupportedLocale;
    }
  }
  return "en";
}

function getNested(obj: Record<string, unknown>, keyPath: string): string | undefined {
  const keys = keyPath.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Get a translated message for the given locale.
 */
export function t(locale: SupportedLocale, key: string): string {
  const value = getNested(messages[locale], key);
  if (value) return value;
  if (locale !== "en") {
    const enValue = getNested(messages.en, key);
    return enValue || key;
  }
  return key;
}
