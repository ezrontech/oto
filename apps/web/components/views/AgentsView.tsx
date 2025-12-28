"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator, Avatar, AvatarFallback } from "@oto/ui";
import { Bot, Plus, Activity, Zap, MessageSquare, Settings, BarChart3, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface Agent {
    id: string;
    name: string;
    role: string;
    description: string;
    avatar?: string;
    status: "active" | "idle" | "training";
    performance?: number;
    tasksCompleted?: number;
}

export default function AgentsView() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch agents from API
        const fetchAgents = async () => {
            try {
                const res = await fetch('/api/agents');
                if (res.ok) {
                    const data = await res.json();
                    setAgents(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch agents", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    // Mock data if empty
    const displayAgents = agents.length > 0 ? agents : [
        { id: "1", name: "Oto", role: "Primary Assistant", description: "Your main operating partner.", status: "active", performance: 98, tasksCompleted: 1240 },
        { id: "2", name: "DevBot", role: "Code Reviewer", description: "Analyzes pull requests and code quality.", status: "idle", performance: 92, tasksCompleted: 45 },
    ];

    return (
        <div className="h-full overflow-y-auto bg-background/50">
            <div className="max-w-6xl mx-auto p-8 space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <Bot className="h-8 w-8 text-primary" />
                            Agents Intelligence
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor, manage, and train your digital workforce.
                        </p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
                            <Bot className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{displayAgents.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +1 active this week
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                            <Activity className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,285</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                            <Zap className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">95%</div>
                            <p className="text-xs text-muted-foreground">
                                Based on user feedback
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Agents List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full"
                    >
                        <Card className="h-full border-dashed border-2 hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer group bg-muted/20">
                            <div className="h-14 w-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Deploy New Agent</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">Create a custom agent for specific tasks or workflows.</p>
                            <Button variant="outline">Create Agent</Button>
                        </Card>
                    </motion.div>

                    {/* Agent Cards */}
                    {displayAgents.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full flex flex-col hover:border-primary/30 transition-all">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold">
                                            {agent.avatar || <Bot className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{agent.name}</CardTitle>
                                            <CardDescription className="text-xs">{agent.role}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-[10px] uppercase">
                                        {agent.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {agent.description || "A specialized AI agent ready to help you with your tasks."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-muted/30 rounded-lg p-2">
                                        <div>
                                            <span className="text-muted-foreground block">Performance</span>
                                            <span className="font-medium flex items-center gap-1 text-green-600">
                                                <BarChart3 className="h-3 w-3" />
                                                {(agent.performance || 90) + "%"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Tasks</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <Check className="h-3 w-3" />
                                                {agent.tasksCompleted || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                                        <Button variant="default" size="sm" className="w-full gap-2">
                                            <MessageSquare className="h-3 w-3" /> Chat
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Settings className="h-3 w-3" /> Manage
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
