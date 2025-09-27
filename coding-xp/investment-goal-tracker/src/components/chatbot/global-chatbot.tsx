
"use client";

import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, onValue, push, set, serverTimestamp, query, limitToLast } from "firebase/database";
import { Bot, Send, X, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth, db } from "@/lib/firebase";
import { handleGlobalChatMessage } from "@/app/actions";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
};

export function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setMessages([]);
        setIsOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      const conversationRef = ref(db, `chatbot_conversations/${user.uid}`);
      const messagesQuery = query(conversationRef, limitToLast(50));

      const unsubscribe = onValue(messagesQuery, (snapshot) => {
        const data = snapshot.val();
        const loadedMessages: ChatMessage[] = [];
        for (const key in data) {
          loadedMessages.push({ id: key, ...data[key] });
        }
        setMessages(loadedMessages);
      });

      return () => unsubscribe();
    }
  }, [user, isOpen]);

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
    
    setIsLoadingResponse(true);
    const userMessage = newMessage;
    setNewMessage("");

    const conversationRef = ref(db, `chatbot_conversations/${user.uid}`);
    const newMessageRef = push(conversationRef);
    
    await set(newMessageRef, {
      sender: 'user',
      text: userMessage,
      timestamp: serverTimestamp(),
    });

    await handleGlobalChatMessage(userMessage, user.displayName || "Anonymous", user.uid);
    setIsLoadingResponse(false);
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (!user) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Ask FinAdvisor</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-1/3 md:w-1/4 flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
                <Bot /> FinAdvisor
            </SheetTitle>
            <SheetDescription>Your personal AI financial assistant.</SheetDescription>
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3"
            >
                <X className="h-5 w-5" />
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4 pt-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex items-end gap-3", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                    {msg.sender === 'ai' && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><Bot/></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn(
                        "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl",
                        msg.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    )}>
                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                     {msg.sender === 'user' && user && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback>{getInitials(user.displayName || 'U')}</AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))}
                 {isLoadingResponse && (
                    <div className="flex items-end gap-3 justify-start">
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><Bot/></AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl bg-muted rounded-bl-none">
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t bg-background">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a financial question..."
            />
            <Button type="submit" disabled={!newMessage.trim() || isLoadingResponse}>
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
