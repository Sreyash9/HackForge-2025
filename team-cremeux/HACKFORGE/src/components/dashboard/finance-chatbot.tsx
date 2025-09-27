"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Bot, Loader2, Send, Sparkles, User as UserIcon } from "lucide-react"
import { getChatbotResponse } from "@/app/actions"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  message: z.string().min(1),
});

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

export function FinanceChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "system",
            content: "Hello! I'm your AI Finance Assistant. How can I help you with budgeting, taxes, or scam prevention today?",
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const userMessage: Message = { role: "user", content: values.message };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        form.reset();

        const response = await getChatbotResponse(values.message);
        
        if (response.success && response.data) {
            const assistantMessage: Message = { role: "assistant", content: response.data };
            setMessages(prev => [...prev, assistantMessage]);
        } else {
             const errorMessage: Message = { role: "system", content: response.error || "Something went wrong." };
            setMessages(prev => [...prev, errorMessage]);
        }
        setIsLoading(false);
    }
  
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
                <Bot className="h-8 w-8" />
                <span className="sr-only">Open AI Chat</span>
            </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> AI Finance Assistant</SheetTitle>
                <SheetDescription>
                    Your personal guide for financial questions.
                </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 pr-4 -mr-6">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-3", message.role === "user" && "justify-end")}>
                            {message.role !== "user" && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-xs rounded-lg p-3 text-sm",
                                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                                message.role === "system" && "w-full bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200"
                            )}>
                                {message.content}
                            </div>
                             {message.role === "user" && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><UserIcon className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs rounded-lg p-3 text-sm bg-muted flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin"/>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="py-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Ask about taxes..." {...field} disabled={isLoading} autoComplete="off" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </Form>
            </div>
        </SheetContent>
    </Sheet>
  )
}
