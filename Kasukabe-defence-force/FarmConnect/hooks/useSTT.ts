"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type STTStatus = "idle" | "listening" | "processing" | "unsupported" | "error"

export function useSTT(opts?: { lang?: string; interimResults?: boolean }) {
  const Recognition = useMemo(() => {
    if (typeof window === "undefined") return undefined as any
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  }, [])

  const [status, setStatus] = useState<STTStatus>(Recognition ? "idle" : "unsupported")
  const [transcript, setTranscript] = useState("")
  const recRef = useRef<any>(null)

  useEffect(() => {
    if (!Recognition) return
    const rec = new Recognition()
    rec.lang = opts?.lang ?? "hi-IN"
    rec.interimResults = opts?.interimResults ?? true
    rec.continuous = false

    rec.onstart = () => setStatus("listening")
    rec.onend = () => setStatus((s) => (s === "listening" ? "idle" : s))
    rec.onerror = () => setStatus("error")
    rec.onresult = (e: any) => {
      let finalText = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) {
          finalText += res[0].transcript
        }
      }
      if (finalText) {
        setTranscript(finalText)
        setStatus("processing")
      }
    }

    recRef.current = rec
    return () => {
      try {
        rec.stop()
      } catch {}
      recRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Recognition])

  const start = useCallback(() => {
    if (!recRef.current) return
    setTranscript("")
    try {
      recRef.current.start()
    } catch {
      // calling start while active can throw; ignore
    }
  }, [])

  const stop = useCallback(() => {
    try {
      recRef.current?.stop()
    } catch {}
  }, [])

  const reset = useCallback(() => {
    setTranscript("")
    setStatus("idle")
  }, [])

  return { status, transcript, start, stop, reset, supported: !!Recognition }
}
