"use client";

import { useState, useEffect, useRef } from "react";
import {
    Button, Input, Avatar, AvatarFallback,
    Card, CardContent, Badge, ScrollArea, cn
} from "@oto/ui";
import {
    Send, MessageSquare, Search, MoreHorizontal, Bot
} from "lucide-react";
import { motion } from "framer-motion";

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    toolOutput?: any;
}

interface Conversation {
    id: string;
    title: string;
    agentName: string;
    lastMessage: string;
    timestamp: Date;
    unread: number;
    status: 'active' | 'idle' | 'archived';
}

export default function ConversationsView() {
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConvId) {
            loadMessages(selectedConvId);
        }
    }, [selectedConvId]);

    const loadConversations = async () => {
        try {
            const res = await fetch("/api/conversations");
            if (res.ok) {
                const data = await res.json();
                // Map dates if necessary
                const parsedData = (data.data || []).map((c: any) => ({
                    ...c,
                    timestamp: new Date(c.timestamp)
                }));
                setConversations(parsedData);
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        }
    };

    const loadMessages = async (convId: string) => {
        try {
            const res = await fetch(`/api/conversations/${convId}/messages`);
            if (res.ok) {
                const data = await res.json();
                const parsedData = (data.data || []).map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(parsedData);
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedConvId) return;

        // Optimistic UI
        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        // In a real app, API call here
    };

    const selectedConv = conversations.find(c => c.id === selectedConvId);

    return (
        <div className="h-full flex flex-col md:flex-row bg-background">
            {/* Sidebar List */}
            <div className={cn(
                "w-full md:w-80 border-r flex flex-col bg-muted/10",
                selectedConvId ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Inbox</h2>
                        <Button size="sm" variant="outline" className="h-8">
                            <MessageSquare className="h-3.5 w-3.5 mr-2" />
                            New
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 bg-background"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <Card
                                    key={conv.id}
                                    className={cn(
                                        "cursor-pointer transition-colors hover:bg-muted/50 border-none shadow-none",
                                        selectedConvId === conv.id && "bg-muted"
                                    )}
                                    onClick={() => setSelectedConvId(conv.id)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                            {conv.agentName.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-sm truncate">{conv.title}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground ml-2">
                                                {conv.timestamp.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Detail Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-background",
                !selectedConvId ? "hidden md:flex" : "flex"
            )}>
                {selectedConv ? (
                    <>
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-8 w-8 -ml-2"
                                    onClick={() => setSelectedConvId(null)}
                                >
                                    <Search className="h-4 w-4 rotate-180" /> {/* Back Icon placeholder */}
                                </Button>
                                <Avatar>
                                    <AvatarFallback>
                                        {selectedConv.agentName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">{selectedConv.title}</h3>
                                    <span className="text-xs text-muted-foreground">{selectedConv.agentName}</span>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-3",
                                            message.sender === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {message.sender === 'agent' && (
                                            <Avatar className="h-8 w-8 mt-1">
                                                <AvatarFallback className="text-[10px]"><Bot className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl p-3 text-sm",
                                            message.sender === 'user'
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted rounded-tl-sm"
                                        )}>
                                            <p>{message.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t">
                            <div className="max-w-3xl mx-auto flex gap-2">
                                <Input
                                    placeholder="Reply..."
                                    className="flex-1"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <Button size="icon" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a conversation to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
