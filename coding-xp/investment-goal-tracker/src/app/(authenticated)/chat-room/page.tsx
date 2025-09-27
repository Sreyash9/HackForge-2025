
"use client";

import { useEffect, useState, useRef } from "react";
import { ref, onValue, push, set, serverTimestamp, query, limitToLast, orderByChild } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { MessageCircle, Send, Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { handleAiChatMessage } from "@/app/actions";

type Message = {
  id: string;
  uid: string;
  displayName: string;
  text: string;
  timestamp: number;
  isBot?: boolean;
};

export default function ChatRoomPage() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const messagesQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(50));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: Message[] = [];
      for (const key in data) {
        loadedMessages.push({ id: key, ...data[key] });
      }
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messagesRef = ref(db, "messages");
    const newMessageRef = push(messagesRef);

    const messagePayload = {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      text: newMessage,
      timestamp: serverTimestamp(),
    };

    await set(newMessageRef, messagePayload);

    if (newMessage.startsWith("@ai")) {
        handleAiChatMessage(newMessage, user.displayName || "Anonymous");
    }

    setNewMessage("");
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageCircle />
            Global Chat Room
        </CardTitle>
        <CardDescription>
            Chat with other investors in real-time. Mention @ai for financial questions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.uid === user?.uid ? "justify-end" : ""
                }`}
              >
                {msg.uid !== user?.uid && (
                    <Avatar className="w-8 h-8 border">
                        {msg.isBot ? <AvatarFallback><Bot/></AvatarFallback> : <AvatarFallback>{getInitials(msg.displayName)}</AvatarFallback>}
                    </Avatar>
                )}
                 <div className={`flex flex-col gap-1 ${msg.uid === user?.uid ? "items-end" : "items-start"}`}>
                    <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                        msg.uid === user?.uid
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : msg.isBot 
                        ? "bg-secondary rounded-bl-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                    >
                        <p className="text-sm whitespace-pre-line">{msg.text.replace(/^@ai\s*/, '')}</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                        <span>{msg.displayName}</span>
                        <span>{msg.timestamp ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true }) : ''}</span>
                    </div>
                </div>
                {msg.uid === user?.uid && (
                     <Avatar className="w-8 h-8 border">
                        <AvatarFallback>{getInitials(msg.displayName)}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message or ask @ai..."
            disabled={!user}
          />
          <Button type="submit" disabled={!newMessage.trim() || !user}>
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
