"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Bot, TrendingUp, Cloud, Bug, Sprout } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/hooks/useTranslations"
import { RecordButton } from "@/components/RecordButton"

export default function AIAssistantPage() {
  const { t, lang } = useTranslations()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "",
      time: "Just now",
    },
  ])

  // Keep the first AI welcome message in sync with current language
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) return prev
      const updated = [...prev]
      if (updated[0].type === "ai") {
        updated[0] = { ...updated[0], content: t.aiWelcome }
      }
      return updated
    })
  }, [lang, t.aiWelcome])

  const quickActions = [
    { icon: Sprout, label: t.aiQuickCrop, query: "What crops should I plant this season?" },
    { icon: Bug, label: t.aiQuickPest, query: "How do I identify and treat common pests?" },
    { icon: Cloud, label: t.aiQuickWeather, query: "How will weather affect my crops this week?" },
    { icon: TrendingUp, label: t.aiQuickMarket, query: "What are the best crops to sell right now?" },
  ]

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      time: "Just now",
    }

    setMessages([...messages, userMessage])
    setMessage("")

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const aiResponseContent = data.text || "No response received"

      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponseContent,
        time: "Just now",
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error:", error)
      const errorResponse = {
        id: messages.length + 2,
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        time: "Just now",
      }
      setMessages((prev) => [...prev, errorResponse])
    }
  }

  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("crop") || lowerQuery.includes("plant")) {
      return "Based on your location and current season, I recommend planting tomatoes, potatoes, and onions. These crops have good market demand and are suitable for your soil conditions. Tomatoes can yield ₹25-30/kg, potatoes ₹18-22/kg, and onions ₹30-35/kg in current market conditions."
    }

    if (lowerQuery.includes("pest") || lowerQuery.includes("disease")) {
      return "Common pests this season include aphids and whiteflies. For organic control, use neem oil spray (10ml per liter of water) every 3-4 days. For severe infestations, consider using imidacloprid-based insecticides. Always spray during early morning or evening hours."
    }

    if (lowerQuery.includes("weather")) {
      return "This week's weather shows moderate temperatures with 20% rain chance. Good conditions for irrigation and pest monitoring. The upcoming rain on Wednesday will be beneficial for your crops, but ensure proper drainage to prevent waterlogging."
    }

    if (lowerQuery.includes("market") || lowerQuery.includes("price")) {
      return "Current market analysis shows tomatoes have the highest profit margin at ₹28/kg with increasing demand. Onion prices are also rising due to seasonal factors. I recommend harvesting tomatoes now and holding onions for another week for better prices."
    }

    return "I understand your question. Based on current agricultural data and your location, I recommend consulting with local agricultural experts for specific guidance. You can also check the weather and market sections of this app for real-time information."
  }

  const handleQuickAction = async (query: string) => {
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: query,
      time: "Just now",
    }

    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: query }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const aiResponseContent = data.text || "No response received"

      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponseContent,
        time: "Just now",
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error:", error)
      const errorResponse = {
        id: messages.length + 2,
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        time: "Just now",
      }
      setMessages((prev) => [...prev, errorResponse])
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary">
              <AvatarFallback>
                <Bot className="h-5 w-5 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">{t.aiAssistant}</h1>
              <p className="text-sm text-muted-foreground">{t.aiSubtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 flex-col gap-2 bg-transparent"
              onClick={() => handleQuickAction(action.query)}
            >
              <action.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-xs lg:max-w-md ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={msg.type === "ai" ? "bg-primary" : "bg-muted"}>
                  {msg.type === "ai" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-xs">You</span>
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="safe-area-bottom bg-card border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder={t.aiInputPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <RecordButton
            onTranscript={(text) => setMessage(text)}
            size="sm"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
