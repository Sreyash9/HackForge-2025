"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { getCurrentLanguage, type Language } from "@/lib/i18n"

// Non-functional language button shown on non-home pages.
// Displays current language but does nothing on click.
export function LanguageButtonDummy() {
  const [label, setLabel] = useState<string>("EN")

  useEffect(() => {
    // Read current language to show an accurate label
    const lang: Language = getCurrentLanguage()
    setLabel(lang === "hi" ? "हिंदी" : "EN")
  }, [])

  return (
    <Button variant="ghost" size="sm" className="gap-2" disabled title="Language toggle available on Home">
      <Languages className="h-4 w-4" />
      {label}
    </Button>
  )
}
