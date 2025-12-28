"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent, ScrollArea } from "@oto/ui";
import { Hash, Plus, Send, Smile, Paperclip, Users, Settings as SettingsIcon, MoreVertical, Calendar, CheckSquare, Target, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { hasPermission, SpaceRole } from "@/lib/permissions";

interface TeamSpaceViewProps {
    spaceId: string;
    spaceName: string;
}

export default function TeamSpaceView({ spaceId, spaceName }: TeamSpaceViewProps) {
    const { user } = useAuth();
    const [channels, setChannels] = useState<any[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [userRole, setUserRole] = useState<SpaceRole>('member');
    const [enabledTools, setEnabledTools] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSpaceData();
        loadChannels();
    }, [spaceId]);

    useEffect(() => {
        if (selectedChannel) {
            loadMessages(selectedChannel.id);
            subscribeToMessages(selectedChannel.id);
        }
    }, [selectedChannel]);

    const loadSpaceData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // Get user role
            const roleRes = await fetch(`/api/spaces/${spaceId}/roles`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });
            if (roleRes.ok) {
                const roleData = await roleRes.json();
                const myRole = roleData.data?.find((r: any) => r.user_id === user?.id);
                if (myRole) setUserRole(myRole.role);
            }

            // Get enabled tools
            const toolsRes = await fetch(`/api/spaces/${spaceId}/tools`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });
            if (toolsRes.ok) {
                const toolsData = await toolsRes.json();
                setEnabledTools(toolsData.data || []);
            }
        } catch (error) {
            console.error("Failed to load space data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadChannels = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/channels`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setChannels(data.data || []);
                if (data.data?.length > 0 && !selectedChannel) {
                    setSelectedChannel(data.data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to load channels:", error);
        }
    };

    const loadMessages = async (channelId: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/messages?channel_id=${channelId}`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((data.data || []).reverse());
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const subscribeToMessages = (channelId: string) => {
        const subscription = supabase
            .channel(`messages:${channelId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `channel_id=eq.${channelId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChannel) return;

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
                    channel_id: selectedChannel.id,
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

    const handleCreateChannel = async () => {
        const name = prompt("Channel name:");
        if (!name) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/channels`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ name, description: "" })
            });

            if (res.ok) {
                loadChannels();
            }
        } catch (error) {
            console.error("Failed to create channel:", error);
        }
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="h-full flex bg-background">
            {/* Channels Sidebar */}
            <div className="w-64 border-r flex flex-col bg-muted/30">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg">{spaceName}</h2>
                    <p className="text-xs text-muted-foreground">Team Space</p>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2">
                        <div className="flex items-center justify-between px-2 py-1 mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Channels</span>
                            {hasPermission(userRole, 'create_channels', 'Team') && (
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={handleCreateChannel}>
                                    <Plus className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        {channels.map(channel => (
                            <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel)}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors ${selectedChannel?.id === channel.id ? 'bg-muted font-medium' : ''
                                    }`}
                            >
                                <Hash className="h-4 w-4" />
                                {channel.name}
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                {/* Tools Section */}
                <div className="p-2 border-t">
                    <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-2">Tools</p>
                    <div className="space-y-1">
                        {enabledTools.includes('calendar') && (
                            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted">
                                <Calendar className="h-4 w-4" />
                                Calendar
                            </button>
                        )}
                        {enabledTools.includes('tasks') && (
                            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted">
                                <CheckSquare className="h-4 w-4" />
                                Tasks
                            </button>
                        )}
                        {enabledTools.includes('goals') && (
                            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted">
                                <Target className="h-4 w-4" />
                                Goals
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Channel Header */}
                {selectedChannel && (
                    <div className="h-14 border-b flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            <span className="font-semibold">{selectedChannel.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <SettingsIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className="flex gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                    {message.users?.name?.[0] || 'U'}
                                </div>
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

                {/* Message Input */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder={`Message #${selectedChannel?.name || 'channel'}`}
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
                    <p className="text-xs text-muted-foreground mt-2">
                        Tip: Type <code className="px-1 py-0.5 bg-muted rounded text-xs">@Oto</code> to get AI assistance
                    </p>
                </div>
            </div>
        </div>
    );
}
