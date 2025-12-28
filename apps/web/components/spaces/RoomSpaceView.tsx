"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, ScrollArea, Avatar, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent } from "@oto/ui";
import { Send, Smile, Paperclip, Pin, CheckSquare, Calendar as CalendarIcon, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

interface RoomSpaceViewProps {
    spaceId: string;
    spaceName: string;
}

export default function RoomSpaceView({ spaceId, spaceName }: RoomSpaceViewProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
        subscribeToMessages();
    }, [spaceId]);

    const loadMessages = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/messages`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((data.data || []).reverse());
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = () => {
        const subscription = supabase
            .channel(`room:${spaceId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `space_id=eq.${spaceId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/messages`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    content: newMessage,
                    mentions: newMessage.includes('@Oto') ? [{ type: 'oto' }] : []
                })
            });

            if (res.ok) {
                setNewMessage("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="h-full flex bg-background">
            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-14 border-b flex items-center justify-between px-4">
                    <div>
                        <h2 className="font-semibold">{spaceName}</h2>
                        <p className="text-xs text-muted-foreground">Room Space</p>
                    </div>
                    <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4" />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                        {message.users?.name?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-semibold text-sm">{message.users?.name || 'User'}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(message.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder="Message the room..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button variant="ghost" size="sm">
                            <Smile className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tools Sidebar */}
            <div className="w-80 border-l bg-muted/30">
                <Tabs defaultValue="notes" className="h-full flex flex-col">
                    <div className="p-4 border-b">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="notes">
                                <Pin className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="tasks">
                                <CheckSquare className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="events">
                                <CalendarIcon className="h-4 w-4" />
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="notes" className="flex-1 p-4">
                        <div className="text-center py-8 text-muted-foreground">
                            <Pin className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No pinned notes yet</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="tasks" className="flex-1 p-4">
                        <div className="text-center py-8 text-muted-foreground">
                            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No shared tasks yet</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="events" className="flex-1 p-4">
                        <div className="text-center py-8 text-muted-foreground">
                            <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No upcoming events</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
