"use client";

import { useState, useRef, useEffect } from "react";
import {
    Button, Input, Avatar, AvatarFallback,
    ScrollArea, Separator
} from "@oto/ui";
import { Send, Bot, Paperclip, Terminal, Sparkles, MoreHorizontal } from "lucide-react";
import { cn } from "@oto/ui";
import { MOCK_MESSAGES } from "../../../data/mock";

interface Message {
    id: number;
    role: string;
    content?: string;
    timestamp: string;
    isTool?: boolean;
    toolName?: string;
    toolOutput?: string;
}

export default function OtoPage() {
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        // Mock Response
        setTimeout(() => {
            const responseMsg: Message = {
                id: messages.length + 2,
                role: "assistant",
                content: "I've received your request. I'm checking the latest data on that for you.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, responseMsg]);
        }, 1000);
    };

    return (
        <div className="flex h-full w-full bg-background overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-background relative">

                {/* Header */}
                <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                            <Bot className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">Oto AI</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500 font-medium">Online & Ready</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                    <div className="space-y-8 max-w-4xl mx-auto pb-6">
                        {messages.map((msg) => {
                            const isUser = msg.role === "user";
                            const isAssistant = msg.role === "assistant";

                            return (
                                <div key={msg.id} className={cn(
                                    "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                    isUser ? "flex-row-reverse" : "flex-row"
                                )}>
                                    <div className="w-8 h-8 flex-shrink-0">
                                        <Avatar className={cn("h-8 w-8 border", isUser ? "border-primary/50" : "border-border/50")}>
                                            <AvatarFallback className={cn(
                                                "text-[10px]",
                                                isUser ? "bg-primary text-white" : "bg-purple-600 text-white"
                                            )}>
                                                {isUser ? "YOU" : <Bot className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className={cn("flex flex-col gap-1 max-w-[70%]", isUser && "items-end")}>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-bold text-foreground">
                                                {isUser ? "You" : "Oto AI"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground/50 font-medium">{msg.timestamp}</span>
                                        </div>

                                        {/* Tool Execution Card */}
                                        {msg.isTool && (
                                            <div className="mb-2 w-full max-w-[280px] border-primary/20 bg-primary/5 p-3 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2 text-primary text-xs font-semibold uppercase tracking-wider">
                                                    <Terminal className="h-3 w-3" />
                                                    {msg.toolName}
                                                </div>
                                                <p className="text-sm font-mono text-muted-foreground bg-background/50 p-2 rounded border border-border/50">
                                                    {msg.toolOutput}
                                                </p>
                                            </div>
                                        )}

                                        {/* Text Content */}
                                        {msg.content && (
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                isUser
                                                    ? "bg-primary text-white rounded-tr-none shadow-primary/10"
                                                    : "bg-card border border-border/50 text-foreground rounded-tl-none shadow-black/5"
                                            )}>
                                                {msg.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/40">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="relative flex items-end gap-2 p-2 rounded-2xl border border-input bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground shrink-0 mb-0.5 hover:bg-muted rounded-xl">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Input
                                placeholder="Message Oto AI..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 min-h-[48px] py-4 text-sm bg-transparent"
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                className="h-10 w-10 shrink-0 mb-0.5 rounded-xl shadow-lg transition-all active:scale-90"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Press Enter to send</p>
                            <Separator orientation="vertical" className="h-2" />
                            <p className="text-[9px] text-primary flex items-center gap-1 cursor-pointer font-bold uppercase tracking-widest hover:underline"><Sparkles className="h-2 w-2" /> AI Powered</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
