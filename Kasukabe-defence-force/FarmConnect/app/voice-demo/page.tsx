"use client"

import { VoiceAssistant } from "@/components/voice-assistant"
import { useTranslations } from "@/hooks/use-translations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VoiceDemoPage() {
  const { t } = useTranslations()

  const handleTranscript = (text: string) => {
    console.log("[v0] Voice transcript received:", text)
  }

  const handleResponse = (response: string) => {
    console.log("[v0] AI response generated:", response)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.voiceAssistant}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Voice Assistant Demo</CardTitle>
            <CardDescription>
              Try asking questions about farming, weather, or market prices in Hindi or English.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Sample questions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>What's the weather like today?</li>
                  <li>आज मौसम कैसा है?</li>
                  <li>What are wheat prices?</li>
                  <li>गेहूं की कीमत क्या है?</li>
                  <li>What crops should I plant?</li>
                  <li>मुझे कौन सी फसल लगानी चाहिए?</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <VoiceAssistant onTranscript={handleTranscript} onResponse={handleResponse} />
      </div>
    </div>
  )
}
