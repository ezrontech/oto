"use client";

import { useState, useRef, useEffect } from "react";
import {
    Button, Input, Avatar, AvatarFallback,
    Card, CardContent, Badge, Separator, ScrollArea,
    Tabs, TabsList, TabsTrigger, TabsContent, cn
} from "@oto/ui";
import {
    Send, User, Bot, Paperclip, MoreHorizontal, Terminal,
    MessageSquare, Instagram, Facebook, Search, ChevronRight,
    Sparkles, Eye, Smartphone, Globe, X, Check, FileText, Database
} from "lucide-react";
import { MOCK_CONVERSATIONS, MOCK_CURRENT_USER, type Conversation, type Message } from "@/data/mock";
import { RichToolOutput } from "@/components/RichToolOutput";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
    const [selectedConvId, setSelectedConvId] = useState(MOCK_CONVERSATIONS[0].id);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [inputValue, setInputValue] = useState("");
    const [previewMessage, setPreviewMessage] = useState<Message | null>(null);
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

        const newMessage: Message = {
            id: Date.now(),
            role: "owner",
            sender: MOCK_CURRENT_USER.agentNickname,
            content: inputValue,
            timestamp: "Now"
        };

        setConversations((prev: Conversation[]) => prev.map(conv =>
            conv.id === selectedConvId
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
        ));
        setInputValue("");

        // Agent Reply Simulation
        setTimeout(() => {
            const agentMsg: Message = {
                id: Date.now() + 1,
                role: "agent",
                sender: "Oto Agent",
                content: "I've logged your response. Should I follow up if they don't reply by EOD?",
                timestamp: "Now"
            };
            setConversations((prev: Conversation[]) => prev.map(conv =>
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
        <div className="flex h-full w-full bg-background overflow-hidden relative">

            {/* Sidebar: Conversation List */}
            <div className="w-80 border-r border-border/40 bg-card/10 backdrop-blur-md flex flex-col z-10">
                <div className="p-4 border-b border-border/40">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xl font-bold tracking-tight">Messages</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 rounded-full"><Search className="h-4 w-4" /></Button>
                    </div>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-9 bg-muted/40 p-1 rounded-full">
                            <TabsTrigger value="all" className="text-[10px] font-bold rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">All</TabsTrigger>
                            <TabsTrigger value="social" className="text-[10px] font-bold rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Social</TabsTrigger>
                            <TabsTrigger value="wa" className="text-[10px] font-bold rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">WA</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1">
                    <div className="space-y-0.5 p-2">
                        {conversations.map((conv) => (
                            <motion.div
                                key={conv.id}
                                onClick={() => setSelectedConvId(conv.id)}
                                className={cn(
                                    "p-3 cursor-pointer rounded-2xl transition-all flex gap-3 items-center group",
                                    selectedConvId === conv.id ? "bg-primary/5 border border-primary/10 shadow-sm" : "hover:bg-muted/30 border border-transparent"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-border/50 ring-offset-background group-hover:ring-2 ring-primary/20 transition-all">
                                        <AvatarFallback className="text-xs font-bold bg-muted">{conv.contact.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border shadow-sm">
                                        {getChannelIcon(conv.channel)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-sm font-bold text-foreground truncate">{conv.contact}</span>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{conv.messages[conv.messages.length - 1].timestamp}</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium truncate opacity-70">
                                        {conv.messages[conv.messages.length - 1].content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-card/5 relative">

                {/* Header */}
                <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10 w-full shadow-sm">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarFallback className="font-bold text-xs">{activeConv.contact.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm tracking-tight">{activeConv.contact}</span>
                                <Badge variant="outline" className="text-[9px] h-4 py-0 flex items-center gap-1.5 border-primary/20 bg-primary/5 text-primary font-bold uppercase tracking-wider">
                                    {getChannelIcon(activeConv.channel)}
                                    {activeConv.channel}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Oto Monitoring Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg border-border/60 hover:bg-muted">
                            <Smartphone className="h-3.5 w-3.5 mr-2" /> Handover
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                    <div className="space-y-10 max-w-4xl mx-auto pb-10">
                        {activeConv.messages.map((msg, idx) => {
                            const isOwner = msg.role === "owner";
                            const isAgent = msg.role === "agent";
                            const isAssistant = msg.role === "assistant"; // System/Tool messages
                            const isUser = msg.role === "user";

                            if (msg.isTool) {
                                return (
                                    <div key={msg.id} className="flex justify-center flex-col items-center">
                                        <RichToolOutput toolName={msg.toolName || "AI Tool"} output={msg.toolOutput || {}} />
                                    </div>
                                );
                            }

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-4 group",
                                        (isOwner || isAgent) ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className="w-8 h-8 flex-shrink-0 mt-1">
                                        <Avatar className={cn("h-8 w-8 border-2", isOwner ? "border-primary/20 ring-2 ring-primary/5" : isAgent ? "border-purple-500/20 ring-2 ring-purple-500/5" : "border-border/50")}>
                                            <AvatarFallback className={cn(
                                                "text-[9px] font-bold",
                                                isOwner ? "bg-primary text-white" : isAgent ? "bg-purple-600 text-white" : "bg-muted text-foreground"
                                            )}>
                                                {isOwner ? "EZ" : isAgent ? "OTO" : (activeConv.contact?.charAt(0) || "?")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className={cn("flex flex-col gap-1.5 max-w-[70%]", (isOwner || isAgent) && "items-end")}>
                                        <div className="flex items-center gap-2 mb-0.5 px-1">
                                            {(isOwner || isAgent) ? (
                                                <>
                                                    <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tighter">{msg.timestamp || "now"}</span>
                                                    <span className="text-[11px] font-bold text-foreground/80">{msg.sender || "AI"}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[11px] font-bold text-foreground/80">{msg.sender || "User"}</span>
                                                    <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tighter">{msg.timestamp || "now"}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="relative group/bubble">
                                            <div
                                                className={cn(
                                                    "p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm font-medium",
                                                    isOwner ? "bg-primary text-white rounded-tr-none shadow-primary/10" :
                                                        isAgent ? "bg-purple-500 text-white rounded-tr-none shadow-purple-500/10" :
                                                            "bg-card border border-border/40 text-foreground rounded-tl-none"
                                                )}
                                            >
                                                {msg.content}

                                                {/* Citations / Sources */}
                                                {Array.isArray(msg.citations) && msg.citations.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                                                        {msg.citations.map((cite, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-help group/cite relative"
                                                            >
                                                                <FileText size={10} className="text-white/80" />
                                                                <span className="text-[9px] font-bold uppercase tracking-tight text-white/90">{cite.name}</span>

                                                                {/* Citation Hover Card */}
                                                                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border hidden group-hover/cite:block z-50 animate-in fade-in slide-in-from-bottom-1">
                                                                    <p className="text-[10px] font-black uppercase text-primary mb-1.5 tracking-widest">Knowledge Context</p>
                                                                    <p className="text-xs leading-relaxed italic opacity-80">"{cite.snippet}"</p>
                                                                    <div className="mt-2 text-[8px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                                                                        <Database size={8} /> Internal Asset ID: {cite.id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Preview Trigger */}
                                            {(isOwner || isAgent) && (
                                                <button
                                                    onClick={() => setPreviewMessage(msg)}
                                                    className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background border border-border shadow-sm opacity-0 group-hover/bubble:opacity-100 transition-all hover:text-primary active:scale-90"
                                                    title="Preview omni-channel"
                                                >
                                                    <Eye size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40">
                    <div className="max-w-4xl mx-auto relative">
                        <div className="relative flex items-end gap-2 p-2.5 rounded-3xl border border-border/60 bg-card shadow-lg shadow-black/5 transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground shrink-0 rounded-2xl hover:bg-muted transition-colors">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Input
                                placeholder={`Message ${activeConv.contact}...`}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 min-h-[48px] py-4 text-sm font-medium bg-transparent"
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                className="h-10 w-10 shrink-0 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-90"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-3 px-4">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Press Enter to send</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider hover:bg-transparent hover:underline">
                                <Sparkles className="h-3 w-3" /> Optimize Response
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* OMNI-CHANNEL PREVIEW DRAWER */}
            <AnimatePresence>
                {previewMessage && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewMessage(null)}
                            className="absolute inset-0 bg-background/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 h-full w-96 bg-card border-l border-border/40 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-6 border-b border-border/20 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Message Preview</h3>
                                    <p className="text-[10px] text-muted-foreground font-medium">Viewing as received on {activeConv.channel}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setPreviewMessage(null)} className="h-8 w-8 rounded-full">
                                    <X size={16} />
                                </Button>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-10">
                                    {/* Mock Phone Container for specific platform */}
                                    <div className="relative mx-auto w-full max-w-[280px]">
                                        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-2xl opacity-20" />
                                        <div className="relative aspect-[9/18.5] bg-[#0b141a] rounded-[2.5rem] border-8 border-[#1f2c33] shadow-2xl overflow-hidden flex flex-col">
                                            {/* Status Bar */}
                                            <div className="h-10 bg-[#1f2c33] flex items-center justify-between px-6 pt-2">
                                                <div className="text-[10px] font-bold text-white/90">9:41</div>
                                                <div className="flex gap-1">
                                                    <div className="h-2 w-2 rounded-full border border-white/50" />
                                                    <div className="h-2 w-3 rounded-sm border border-white/50" />
                                                </div>
                                            </div>

                                            {/* Channel Content */}
                                            <div className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                                                <div className="mt-8">
                                                    <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none text-[13px] shadow-sm max-w-[85%] border-l-4 border-primary">
                                                        <div className="flex items-center gap-1.5 mb-1 opacity-50">
                                                            <Check size={10} className="text-sky-400" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">{activeConv.contact}</span>
                                                        </div>
                                                        {previewMessage.content}
                                                        <div className="text-[9px] text-white/40 text-right mt-1 font-bold">10:42 PM</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Input bar mockup */}
                                            <div className="h-14 bg-[#1f2c33] border-t border-white/5 p-2 flex items-center gap-2">
                                                <div className="flex-1 h-8 bg-[#2a3942] rounded-full" />
                                                <div className="h-8 w-8 bg-primary rounded-full" />
                                            </div>
                                        </div>
                                        <p className="text-center mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WhatsApp Representation</p>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Compliance Check</h4>
                                        <div className="space-y-2">
                                            {[
                                                { label: "Optimal Length", status: "Pass" },
                                                { label: "Channel Guidelines", status: "Pass" },
                                                { label: "Anti-Spam Filter", status: "Pass" }
                                            ].map((check, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/10">
                                                    <span className="text-[11px] font-medium">{check.label}</span>
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] h-4 font-bold">OK</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            <div className="p-6 border-t border-border/20">
                                <Button className="w-full font-bold uppercase tracking-widest text-[11px] rounded-xl h-11" onClick={() => setPreviewMessage(null)}>
                                    Return to Workspace
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
