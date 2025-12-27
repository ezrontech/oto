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
import { RichToolOutput } from "@/components/RichToolOutput";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ChatPage() {
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
                setConversations(data.data || []);
                if (data.data && data.data.length > 0) {
                    setSelectedConvId(data.data[0].id);
                }
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
                setMessages(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedConvId) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`/api/conversations/${selectedConvId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: input })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.data]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedConv = conversations.find(c => c.id === selectedConvId);

    return (
        <div className="h-full flex bg-background">
            {/* Sidebar */}
            <div className="w-80 border-r flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Conversations</h2>
                        <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            New Chat
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            className="pl-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
                                <h3 className="font-semibold text-sm mb-1">No conversations yet</h3>
                                <p className="text-xs text-muted-foreground">Start chatting with your AI agents</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <Card
                                    key={conv.id}
                                    className={cn(
                                        "cursor-pointer transition-colors hover:bg-muted/50",
                                        selectedConvId === conv.id && "bg-muted border-primary"
                                    )}
                                    onClick={() => setSelectedConvId(conv.id)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs">
                                                            {conv.agentName.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-sm truncate">{conv.title}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {conv.timestamp.toLocaleTimeString()}
                                                </span>
                                                {conv.unread > 0 && (
                                                    <Badge variant="default" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                                                        {conv.unread}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConv ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>
                                        {selectedConv.agentName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedConv.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={selectedConv.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                            {selectedConv.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{selectedConv.agentName}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Bot className="h-12 w-12 text-muted-foreground mb-3" />
                                        <h3 className="font-semibold text-sm mb-1">Start the conversation</h3>
                                        <p className="text-xs text-muted-foreground">Send a message to begin chatting</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
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
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">
                                                        {selectedConv.agentName.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "max-w-[70%] rounded-lg p-3",
                                                message.sender === 'user' 
                                                    ? "bg-primary text-primary-foreground" 
                                                    : "bg-muted"
                                            )}>
                                                <p className="text-sm">{message.content}</p>
                                                {message.toolOutput && (
                                                    <RichToolOutput toolName="response" output={message.toolOutput} />
                                                )}
                                            </div>
                                            {message.sender === 'user' && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">YO</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    disabled={isLoading}
                                />
                                <Button size="icon" onClick={sendMessage} disabled={isLoading}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                            <p className="text-muted-foreground">Choose a conversation from the sidebar to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
