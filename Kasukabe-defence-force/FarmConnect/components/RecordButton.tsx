"use client"

import { useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { useSTT } from "@/hooks/useSTT"
import { getCurrentLanguage } from "@/lib/i18n"

interface RecordButtonProps {
  onTranscript: (text: string) => void
  className?: string
  size?: "sm" | "default" | "lg"
}

export function RecordButton({ onTranscript, className, size = "default" }: RecordButtonProps) {
  const currentLang = getCurrentLanguage()
  const lang = currentLang === "hi" ? "hi-IN" : "en-US"
  
  const { status, transcript, start, stop, reset, supported } = useSTT({
    lang,
    interimResults: true
  })

  const handleToggle = useCallback(() => {
    if (status === "listening") {
      stop()
    } else if (status === "idle" || status === "error") {
      reset()
      start()
    }
  }, [status, start, stop, reset])

  // When we get a final transcript, pass it to parent
  useEffect(() => {
    if (status === "processing" && transcript) {
      onTranscript(transcript)
      // Auto-reset after a short delay
      setTimeout(() => {
        reset()
      }, 1000)
    }
  }, [status, transcript, onTranscript, reset])

  if (!supported) {
    return null // Hide button if speech recognition not supported
  }

  const getIcon = () => {
    switch (status) {
      case "listening":
        return <Mic className="h-4 w-4 text-red-500 animate-pulse" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "error":
        return <MicOff className="h-4 w-4 text-muted-foreground" />
      default:
        return <Mic className="h-4 w-4" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case "listening":
        return "Stop recording"
      case "processing":
        return "Processing speech..."
      case "error":
        return "Speech recognition error - click to retry"
      default:
        return `Record voice input (${currentLang === "hi" ? "Hindi" : "English"})`
    }
  }

  return (
    <Button
      variant={status === "listening" ? "default" : "ghost"}
      size={size}
      onClick={handleToggle}
      className={className}
      title={getTitle()}
      disabled={status === "processing"}
    >
      {getIcon()}
    </Button>
  )
}
