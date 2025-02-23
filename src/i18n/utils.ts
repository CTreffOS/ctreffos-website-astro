import { de, enUS } from "date-fns/locale"
import { ui, defaultLang } from "./ui"

export function getLangFromUrl(url: URL | string) {
  const pathname = url instanceof URL ? url.pathname : url
  const candidates = pathname.split("/").filter((a) => a.length === 2)

  if (candidates.includes("de")) {
    return "de"
  }

  if (candidates.includes("en")) {
    return "en"
  }

  return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}

export const getLocale = (locale: string) => {
  if (locale === "de") {
    return de
  } else {
    return enUS
  }
}
