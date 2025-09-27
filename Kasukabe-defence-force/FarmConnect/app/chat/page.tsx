"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Star, Image as ImageIcon, Bot } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { useTranslations } from "@/hooks/useTranslations"
import { RecordButton } from "@/components/RecordButton"

export default function ChatPage() {
  const { t } = useTranslations()
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [liveMessages, setLiveMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)

  const chatList = [
    {
      id: 1,
      name: "Rajesh Kumar",
      type: "Buyer",
      lastMessage: "I can buy 100kg tomatoes at ₹27/kg",
      time: "2 min ago",
      unread: 2,
      online: true,
      rating: 4.5,
      avatar: "/diverse-farmers-harvest.png",
    },
    {
      id: 2,
      name: "Priya Sharma",
      type: "Buyer",
      lastMessage: "When can you deliver the potatoes?",
      time: "15 min ago",
      unread: 0,
      online: false,
      rating: 4.8,
      avatar: "/diverse-woman-portrait.png",
    },
    {
      id: 3,
      name: "Suresh Patel",
      type: "Farmer",
      lastMessage: "Let's pool our transport costs",
      time: "1 hour ago",
      unread: 1,
      online: true,
      rating: 4.2,
      avatar: "/man.jpg",
    },
    {
      id: 4,
      name: "Anita Singh",
      type: "Buyer",
      lastMessage: "Great quality onions! Will order again",
      time: "2 hours ago",
      unread: 0,
      online: false,
      rating: 4.9,
      avatar: "/confident-businesswoman.png",
    },
  ]

  const demoMessages = [
    {
      id: 1,
      sender: "Rajesh Kumar",
      message: "Hi! I'm interested in buying tomatoes. What's your current price?",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      message: "Hello! I have fresh tomatoes available at ₹28/kg. Quality is excellent.",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Rajesh Kumar",
      message: "Can you do ₹27/kg for 100kg? I can pick up today.",
      time: "10:35 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "Me",
      message: "That works for me. When can you come?",
      time: "10:36 AM",
      isMe: true,
    },
    {
      id: 5,
      sender: "Rajesh Kumar",
      message: "I can be there by 2 PM. Please share your location.",
      time: "10:38 AM",
      isMe: false,
    },
  ]

  const filteredChats = chatList.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    // Fetch current user
    supabase.auth.getUser().then((res) => setUserId(res.data.user?.id || null))
  }, [])

  // Load latest messages and subscribe (global demo room for hackathon)
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from("messages")
          .select("id, created_at, user_id, content")
          .order("created_at", { ascending: true })
          .limit(100)
        setLiveMessages(data || [])
      } catch (e) {
        // ignore, fallback to demo
      } finally {
        setLoading(false)
      }
    }
    load()

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setLiveMessages((prev) => [...prev, payload.new as any])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const messages = useMemo(() => {
    if (loading) return []
    if (liveMessages.length === 0) return demoMessages
    return liveMessages.map((m) => ({
      id: m.id,
      sender: m.user_id === userId ? "Me" : "User",
      message: m.content,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: m.user_id === userId,
    }))
  }, [liveMessages, userId, loading])

  const handleSendMessage = async () => {
    const text = message.trim()
    if (!text && !file) return
    setMessage("")
    try {
      let contentToSend = text
      if (file) {
        const path = `${userId || "anon"}/${Date.now()}-${file.name}`
        try {
          const up = await supabase.storage.from("chat-media").upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          })
          if (!up.error) {
            const { data: pub } = supabase.storage.from("chat-media").getPublicUrl(path)
            contentToSend = `${text ? text + " " : ""}${pub.publicUrl}`
          }
        } catch (e) {
          console.warn("Upload failed, sending text only")
        } finally {
          setFile(null)
        }
      }
      await supabase.from("messages").insert({ content: contentToSend })
    } catch (e) {
      // fallback to local display
      setLiveMessages((prev) => [
        ...prev,
        { id: Math.random(), created_at: new Date().toISOString(), user_id: userId, content: text },
      ])
    }
  }

  if (selectedChat) {
    const currentChat = chatList.find((chat) => chat.id === selectedChat)

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentChat?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentChat?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{currentChat?.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {currentChat?.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{currentChat?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="safe-area-bottom bg-card border-t border-border p-4">
          <div className="flex gap-2">
            <label className="inline-flex items-center justify-center w-10 h-10 rounded-md border cursor-pointer hover:bg-muted">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </label>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {file && (
            <div className="text-xs text-muted-foreground mt-2">Selected: {file.name}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{t.messagesTitle}</h1>
            <p className="text-sm text-muted-foreground">{t.messagesSubtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchConversationsPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <RecordButton
            onTranscript={(text) => setSearchQuery(text)}
            size="sm"
          />
        </div>
      </header>

      {/* Chat List */}
      <div className="p-4 space-y-3">
        {/* AI Assistant Card */}
        <Link href="/ai-assistant">
          <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 bg-primary">
                  <AvatarFallback>
                    <Bot className="h-6 w-6 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-primary">AI Assistant</h3>
                      <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/20">
                        Smart AI
                      </Badge>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{t.featureAIDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        {filteredChats.map((chat) => (
          <Card
            key={chat.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedChat(chat.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {chat.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                      {chat.unread > 0 && (
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{chat.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredChats.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{t.noConversations}</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSearchQuery("")}>
                {t.clearSearch}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
