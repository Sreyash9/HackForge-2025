"use client"

import { useEffect, useState } from "react"
import { getCurrentLanguage, getTranslations, type Translations, type Language } from "@/lib/i18n"

export function useTranslations() {
  const [lang, setLang] = useState<Language>(getCurrentLanguage())
  const [t, setT] = useState<Translations>(getTranslations(lang))

  useEffect(() => {
    const apply = (next: Language) => {
      setLang(next)
      setT(getTranslations(next))
    }

    // Storage handler (cross-tab updates)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "farmconnect-language") {
        const newLang = (e.newValue === "hi" ? "hi" : "en") as Language
        apply(newLang)
      }
    }

    // In-tab custom event for immediate updates
    const onCustom = () => {
      const current = getCurrentLanguage()
      apply(current)
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener("fc-language-change", onCustom as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("fc-language-change", onCustom as EventListener)
    }
  }, [])

  return { t, lang }
}
