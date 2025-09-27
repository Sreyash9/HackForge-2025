"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type TTSVoiceOption = {
  name: string
  lang: string
  voice: SpeechSynthesisVoice
}

export function useTTS() {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined
  const [voices, setVoices] = useState<TTSVoiceOption[]>([])
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load voices
  useEffect(() => {
    if (!synth) return

    const load = () => {
      const vs = synth.getVoices().map((v) => ({ name: v.name, lang: v.lang, voice: v }))
      setVoices(vs)
    }

    load()
    synth.onvoiceschanged = load

    return () => {
      if (synth) synth.onvoiceschanged = null
    }
  }, [synth])

  const getDefaultVoice = useMemo(() => {
    return (prefLang: string) => {
      // Prefer matching language (hi-IN/en-IN), then "hi"/"en", fallback first
      const matchExact = voices.find((v) => v.lang.toLowerCase() === prefLang.toLowerCase())
      if (matchExact) return matchExact.voice
      const matchPrefix = voices.find((v) => v.lang.toLowerCase().startsWith(prefLang.split("-")[0]))
      if (matchPrefix) return matchPrefix.voice
      return voices[0]?.voice
    }
  }, [voices])

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number; lang?: string; voiceName?: string }) => {
      if (!synth) return
      if (!text?.trim()) return

      // Cancel any ongoing speech
      synth.cancel()

      const utt = new SpeechSynthesisUtterance(text)
      utt.rate = opts?.rate ?? 1
      utt.pitch = opts?.pitch ?? 1
      const voice = opts?.voiceName
        ? voices.find((v) => v.name === opts.voiceName)?.voice
        : getDefaultVoice(opts?.lang ?? "hi-IN")
      if (voice) utt.voice = voice
      if (opts?.lang) utt.lang = opts.lang

      utt.onstart = () => {
        setSpeaking(true)
        setPaused(false)
      }
      utt.onpause = () => setPaused(true)
      utt.onresume = () => setPaused(false)
      utt.onend = () => {
        setSpeaking(false)
        setPaused(false)
        utteranceRef.current = null
      }
      utt.onerror = () => {
        setSpeaking(false)
        setPaused(false)
        utteranceRef.current = null
      }

      utteranceRef.current = utt
      synth.speak(utt)
    },
    [synth, voices, getDefaultVoice]
  )

  const pause = useCallback(() => {
    if (!synth) return
    if (synth.speaking && !synth.paused) synth.pause()
  }, [synth])

  const resume = useCallback(() => {
    if (!synth) return
    if (synth.paused) synth.resume()
  }, [synth])

  const stop = useCallback(() => {
    if (!synth) return
    synth.cancel()
  }, [synth])

  return { voices, speaking, paused, speak, pause, resume, stop }
}
