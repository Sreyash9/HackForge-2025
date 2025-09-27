"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wheat, Users, TrendingUp, Calculator } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

export function HomeContent() {
  const { t } = useTranslations()

  return (
    <>
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-balance mb-4">{t.tagline}</h2>
        <p className="text-muted-foreground text-balance mb-6">{t.description}</p>
        <Link href="/auth/signup">
          <Button size="lg" className="w-full max-w-xs">
            {t.getStarted}
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-sm">{t.marketPrices}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs">{t.featureMarketDesc}</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-sm">{t.findBuyers}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs">{t.featureBuyersDesc}</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-sm">{t.costCalculator}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs">{t.featureCalculatorDesc}</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <Wheat className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-sm">{t.aiAssistant}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs">{t.featureAIDesc}</CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
