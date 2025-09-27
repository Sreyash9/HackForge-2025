"use client"

import { usePathname } from "next/navigation"
import { LanguageButtonDummy } from "@/components/language-button-dummy"

// Renders the non-functional language button on all pages
// except the Home page ("/") where the real toggle exists.
export function GlobalLanguageButton() {
  const pathname = usePathname()

  if (pathname === "/") {
    return null
  }

  return (
    <div className="fixed top-3 right-3 z-10 hidden md:block">
      <LanguageButtonDummy />
    </div>
  )
}
