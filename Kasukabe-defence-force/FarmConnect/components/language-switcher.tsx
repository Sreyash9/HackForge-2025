"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { getCurrentLanguage, setLanguage, type Language } from "@/lib/i18n"

// Simple, reliable toggle (EN <-> हिंदी) without dropdowns
export function LanguageSwitcher() {
  // Render 'en' on server/first paint to avoid hydration mismatches, then sync after mount
  const [currentLang, setCurrentLang] = useState<Language>('en')

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
  }, [])

  const toggleLang = useCallback(() => {
    const next = currentLang === "hi" ? "en" : "hi"
    setLanguage(next)
    setCurrentLang(next)
  }, [currentLang])

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={toggleLang}
      title={currentLang === "hi" ? "Switch to English" : "हिंदी पर स्विच करें"}
    >
      <Languages className="h-4 w-4" />
      <span suppressHydrationWarning>{currentLang === "hi" ? "हिंदी" : "EN"}</span>
    </Button>
  )
}
