"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator } from "@oto/ui";
import { Bot, Plus, Globe, Activity } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function MyHubPage() {
    const { user } = useAuth();
    const [myAgents, setMyAgents] = useState<any[]>([]);
    const [mySpaces, setMySpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            // Fetch agents
            const agentsResponse = await fetch('/api/agents');
            if (agentsResponse.ok) {
                const agentsData = await agentsResponse.json();
                setMyAgents(agentsData.data || []);
            }

            // For now, keep mock spaces until we create spaces API
            setMySpaces([]);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="h-full overflow-y-auto bg-background/50">
            <div className="max-w-7xl mx-auto p-8 space-y-10">
                {/* Welcome Section */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome back, {user?.name?.split(" ")[0] || "User"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your digital workforce is ready. You have {myAgents.length} agents active across {mySpaces.length} spaces.
                    </p>
                </div>

                {/* Spaces & Agents Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Spaces */}
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Your Spaces
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-1">
                            {mySpaces.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Globe className="h-12 w-12 text-muted-foreground mb-3" />
                                    <h3 className="font-semibold text-sm mb-1">No spaces yet</h3>
                                    <p className="text-xs text-muted-foreground mb-4">Create your first space to collaborate with AI agents</p>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Space
                                    </Button>
                                </div>
                            ) : (
                                mySpaces.map(space => (
                                    <div key={space.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <div>
                                            <p className="font-bold text-sm">{space.name}</p>
                                            <p className="text-xs text-muted-foreground">{space.description}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Agents */}
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-amber-500" />
                                Agent Pulse
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-1">
                            {myAgents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bot className="h-12 w-12 text-muted-foreground mb-3" />
                                    <h3 className="font-semibold text-sm mb-1">No agents yet</h3>
                                    <p className="text-xs text-muted-foreground mb-4">Create your first AI agent to automate tasks</p>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Agent
                                    </Button>
                                </div>
                            ) : (
                                myAgents.map(agent => (
                                    <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold">
                                            {agent.avatar || "AI"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{agent.name}</p>
                                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                                        </div>
                                        <Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-[10px] h-4">
                                            {agent.status}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
