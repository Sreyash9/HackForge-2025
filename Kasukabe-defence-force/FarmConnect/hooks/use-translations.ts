"use client"

import { useState, useEffect } from "react"
import { getCurrentLanguage, getTranslations, type Language, type Translations } from "@/lib/i18n"

export function useTranslations() {
  const [language, setLanguageState] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(getTranslations("en"))

  useEffect(() => {
    const currentLang = getCurrentLanguage()
    setLanguageState(currentLang)
    setTranslations(getTranslations(currentLang))
  }, [])

  return {
    language,
    translations,
    t: translations, // Shorthand
  }
}
