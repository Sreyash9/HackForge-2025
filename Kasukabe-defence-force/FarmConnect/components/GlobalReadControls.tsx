"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, Volume2 } from "lucide-react"
import { useTTS } from "@/hooks/useTTS"
import { getCurrentLanguage } from "@/lib/i18n"

export function GlobalReadControls() {
  const { speak, stop, speaking, paused, pause, resume } = useTTS()
  const [reading, setReading] = useState(false)

  const readPageContent = useCallback(() => {
    if (reading) {
      stop()
      setReading(false)
      return
    }

    // Extract all visible text from the page
    const textElements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, div, button, a, label, input[type="text"], input[type="search"], textarea, [role="button"]'
    )
    
    const texts: string[] = []
    textElements.forEach((el) => {
      const text = el.textContent?.trim()
      if (text && text.length > 0) {
        // Skip very short texts like single letters or numbers
        if (text.length > 1) {
          texts.push(text)
        }
      }
    })

    if (texts.length === 0) {
      speak("No readable content found on this page", { lang: "en-US" })
      return
    }

    // Join all text with pauses
    const fullText = texts.join(". ")
    const currentLang = getCurrentLanguage()
    const lang = currentLang === "hi" ? "hi-IN" : "en-US"
    
    setReading(true)
    speak(fullText, { lang, rate: 0.9 })
  }, [speak, stop, reading])

  const handlePauseResume = useCallback(() => {
    if (paused) {
      resume()
    } else {
      pause()
    }
  }, [paused, pause, resume])

  const handleStop = useCallback(() => {
    stop()
    setReading(false)
  }, [stop])

  // Reset reading state when speech ends
  useEffect(() => {
    if (!speaking && reading) {
      setReading(false)
    }
  }, [speaking, reading])

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
      <Button
        size="sm"
        variant={reading ? "default" : "outline"}
        onClick={readPageContent}
        className="gap-2 text-xs"
        title={reading ? "Stop reading" : "Read page aloud"}
      >
        {reading ? <Square className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        {reading ? "Stop" : "Read"}
      </Button>
      
      {reading && (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePauseResume}
            className="px-2"
            title={paused ? "Resume" : "Pause"}
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStop}
            className="px-2"
            title="Stop"
          >
            <Square className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
