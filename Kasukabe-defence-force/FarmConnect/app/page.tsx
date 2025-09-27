import { Wheat } from "lucide-react"
import { Suspense } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import WeatherHome from "./weatherHome"
import { AuthButtons } from "@/components/i18n/AuthButtons"
import { HomeContent } from "@/components/i18n/HomeContent"

export default function HomePage() {
  // For now, keeping as server component and will add client wrapper
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/30">
      {/* Header */}
      <header className="safe-area-top p-4 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Wheat className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">FarmConnect</h1>
          </div>
          <div className="flex items-center gap-3 relative z-20">
            <LanguageSwitcher />
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="p-4 max-w-md mx-auto">
        <Suspense fallback={null}>
          <WeatherHome />
        </Suspense>
        <HomeContent />
      </main>
    </div>
  )
}
