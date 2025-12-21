"use client";

import { useState, useRef, useEffect } from "react";
import {
    Button, Input, Avatar, AvatarFallback,
    Card, CardContent, Badge, Separator, ScrollArea,
    Tabs, TabsList, TabsTrigger, TabsContent
} from "@oto/ui";
import { Send, User, Bot, Paperclip, MoreHorizontal, Terminal, MessageSquare, Instagram, Facebook, Search, ChevronRight, Sparkles } from "lucide-react";
import { MOCK_CONVERSATIONS, MOCK_CURRENT_USER } from "../../../data/mock";
import { cn } from "@oto/ui";

export default function ChatPage() {
    const [selectedConvId, setSelectedConvId] = useState(MOCK_CONVERSATIONS[0].id);
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [activeConv]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            role: "owner",
            sender: MOCK_CURRENT_USER.agentNickname, // Use agent nickname
            content: inputValue,
            timestamp: "Now"
        };

        setConversations(prev => prev.map(conv =>
            conv.id === selectedConvId
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
        ));
        setInputValue("");

        // Agent Reply Simulation
        setTimeout(() => {
            const agentMsg = {
                id: Date.now() + 1,
                role: "agent",
                sender: "Oto Agent",
                content: "I've logged your response. Should I follow up if they don't reply by EOD?",
                timestamp: "Now"
            };
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConvId
                    ? { ...conv, messages: [...conv.messages, agentMsg] }
                    : conv
            ));
        }, 1200);
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "Instagram": return <Instagram className="h-4 w-4 text-pink-600" />;
            case "Facebook": return <Facebook className="h-4 w-4 text-blue-600" />;
            default: return <MessageSquare className="h-4 w-4 text-green-600" />;
        }
    };

    return (
        <div className="flex h-full w-full bg-background/50 overflow-hidden">

            {/* Sidebar: Conversation List */}
            <div className="w-80 border-r border-border/40 bg-background/80 backdrop-blur-sm flex flex-col">
                <div className="p-4 border-b border-border/40">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold tracking-tight">Messages</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
                    </div>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-8">
                            <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
                            <TabsTrigger value="social" className="text-[10px]">Social</TabsTrigger>
                            <TabsTrigger value="wa" className="text-[10px]">WA</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1">
                    <div className="divide-y divide-border/20">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConvId(conv.id)}
                                className={cn(
                                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors flex gap-3 items-start group",
                                    selectedConvId === conv.id && "bg-muted shadow-inner"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-border/50">
                                        <AvatarFallback className="text-xs bg-secondary">{conv.contact.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
                                        {getChannelIcon(conv.channel)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-sm font-bold text-foreground truncate">{conv.contact}</span>
                                        <span className="text-[10px] text-muted-foreground">{conv.messages[conv.messages.length - 1].timestamp}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate italic">
                                        {conv.messages[conv.messages.length - 1].content}
                                    </p>
                                </div>
                                <ChevronRight className={cn("h-4 w-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity", selectedConvId === conv.id && "opacity-100")} />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background/30 relative">

                {/* Header */}
                <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border/50">
                            <AvatarFallback>{activeConv.contact.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{activeConv.contact}</span>
                                <Badge variant="outline" className="text-[9px] h-4 py-0 flex items-center gap-1 border-primary/20 text-primary">
                                    {getChannelIcon(activeConv.channel)}
                                    {activeConv.channel}
                                </Badge>
                            </div>
                            <span className="text-[10px] text-green-500 font-medium">Oto Agent Monitoring Active</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                            <Bot className="h-3.5 w-3.5" /> Handover to Agent
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                    <div className="space-y-8 max-w-4xl mx-auto pb-6">
                        {activeConv.messages.map((msg, idx) => {
                            const isOwner = msg.role === "owner";
                            const isAgent = msg.role === "agent";
                            const isUser = msg.role === "user"; // The external contact

                            return (
                                <div key={msg.id} className={cn(
                                    "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                    (isOwner || isAgent) ? "flex-row-reverse" : "flex-row"
                                )}>
                                    <div className="w-8 h-8 flex-shrink-0">
                                        <Avatar className={cn("h-8 w-8 border", isOwner ? "border-primary/50" : isAgent ? "border-purple-500/50" : "border-border/50")}>
                                            <AvatarFallback className={cn(
                                                "text-[10px]",
                                                isOwner ? "bg-primary text-white" : isAgent ? "bg-purple-600 text-white" : "bg-secondary text-foreground"
                                            )}>
                                                {isOwner ? "EZ" : isAgent ? "OTO" : activeConv.contact.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className={cn("flex flex-col gap-1 max-w-[70%]", (isOwner || isAgent) && "items-end")}>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-bold text-foreground">
                                                {msg.sender}
                                            </span>
                                            {isOwner && <Badge className="bg-primary hover:bg-primary text-[8px] h-3.5 px-1 font-black">OWNER</Badge>}
                                            {isAgent && <Badge className="bg-purple-600 hover:bg-purple-600 text-[8px] h-3.5 px-1 font-black">AGENT</Badge>}
                                            <span className="text-[10px] text-muted-foreground/50 font-medium">{msg.timestamp}</span>
                                        </div>

                                        <div
                                            className={cn(
                                                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                isOwner ? "bg-primary text-white rounded-tr-none shadow-primary/10" :
                                                    isAgent ? "bg-purple-50 border border-purple-100 text-purple-900 rounded-tr-none" :
                                                        "bg-white border border-border/50 text-foreground rounded-tl-none shadow-black/5"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
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
                                placeholder={`Reply to ${activeConv.contact} as Owner...`}
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
                            <p className="text-[9px] text-primary flex items-center gap-1 cursor-pointer font-bold uppercase tracking-widest hover:underline"><Sparkles className="h-2 w-2" /> Optimize with AI</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
