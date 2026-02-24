import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

export const supportedLngs = ["en", "ar"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: [...supportedLngs],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export function setDocumentDirection(lng: string) {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
}

i18n.on("languageChanged", (lng) => {
  setDocumentDirection(lng);
});

// Set initial direction
if (typeof document !== "undefined") {
  setDocumentDirection(i18n.language || "en");
}

export default i18n;
