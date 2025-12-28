"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@oto/ui";
import { Users, Settings, MessageSquare, CheckSquare, Target, Calendar, ArrowLeft, Globe, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SpaceDetailPageProps {
    spaceId: string;
}

export default function SpaceDetailPage({ spaceId }: SpaceDetailPageProps) {
    const [space, setSpace] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSpace();
    }, [spaceId]);

    const loadSpace = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}`, {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setSpace(data.data);
            }
        } catch (error) {
            console.error("Failed to load space:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-muted-foreground">Loading space...</div>
            </div>
        );
    }

    if (!space) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-muted-foreground">Space not found</div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-background">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b bg-background/60 backdrop-blur-xl">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">{space.name}</h1>
                                <Badge variant={space.type === "Community" ? "secondary" : "outline"}>
                                    {space.type}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    {space.visibility === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                    {space.visibility === "public" ? "Public" : "Private"}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{space.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="p-6">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Members
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{space.member_count || 0}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <CheckSquare className="h-4 w-4" />
                                        Tasks
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Target className="h-4 w-4" />
                                        Goals
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest updates in this space</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    No activity yet
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="members">
                        <Card>
                            <CardHeader>
                                <CardTitle>Space Members</CardTitle>
                                <CardDescription>People who have access to this space</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Member list coming soon
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tasks">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tasks</CardTitle>
                                <CardDescription>Manage tasks for this space</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    No tasks yet
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="chat">
                        <Card>
                            <CardHeader>
                                <CardTitle>Space Chat</CardTitle>
                                <CardDescription>Communicate with space members</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Chat coming soon
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
