"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number
    results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    readonly length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
  }

  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition
    new (): SpeechRecognition
  }
}

interface VoiceAssistantProps {
  onTranscript?: (text: string) => void
  onResponse?: (response: string) => void
}

export function VoiceAssistant({ onTranscript, onResponse }: VoiceAssistantProps) {
  const { t } = useTranslations()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    if (typeof window !== "undefined") {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis

      if (SpeechRecognitionConstructor && speechSynthesis) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognitionConstructor()
        synthRef.current = speechSynthesis

        // Configure speech recognition
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "hi-IN" // Default to Hindi, can be switched

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex
          const transcript = event.results[current][0].transcript
          setTranscript(transcript)
          onTranscript?.(transcript)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          if (transcript) {
            handleProcessTranscript(transcript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }
      }
    }
  }, [transcript, onTranscript])

  const handleProcessTranscript = async (text: string) => {
    setIsProcessing(true)

    try {
      // Here you would integrate with your AI service
      // For now, we'll simulate a response
      const mockResponse = await simulateAIResponse(text)
      setResponse(mockResponse)
      onResponse?.(mockResponse)

      // Speak the response
      if (synthRef.current) {
        speakText(mockResponse)
      }
    } catch (error) {
      console.error("Error processing transcript:", error)
      setResponse("Sorry, I encountered an error processing your request.")
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateAIResponse = async (question: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponseContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          aiResponseContent += chunk
        }
      }

      return aiResponseContent || "I can help you with farming advice. What would you like to know?"
    } catch (error) {
      console.error("Error getting AI response:", error)
      return "Sorry, I'm having trouble connecting right now. Please try again."
    }
  }

  const speakText = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "hi-IN" // Can be switched based on user preference
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      setResponse("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            {t.voiceAssistant}
          </CardTitle>
          <CardDescription>Voice assistant is not supported in your browser.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          {t.voiceAssistant}
        </CardTitle>
        <CardDescription>{t.speakYourQuestion}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "default"}
            className="flex-1"
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                {t.stopListening}
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                {t.startListening}
              </>
            )}
          </Button>

          {isSpeaking && (
            <Button onClick={stopSpeaking} variant="outline">
              <VolumeX className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isListening && <div className="text-center text-sm text-muted-foreground">{t.listening}</div>}

        {isProcessing && <div className="text-center text-sm text-muted-foreground">{t.processing}</div>}

        {transcript && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">You said:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">Assistant:</p>
            <p className="text-sm">{response}</p>
            {!isSpeaking && (
              <Button onClick={() => speakText(response)} variant="ghost" size="sm" className="mt-2">
                <Volume2 className="h-4 w-4 mr-2" />
                Speak
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
