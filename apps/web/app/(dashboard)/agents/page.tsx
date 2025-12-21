"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input, Separator, Avatar, AvatarFallback } from "@oto/ui";
import { Plus, Search, MoreHorizontal, Bot, Sparkles, MessageSquare, Wrench } from "lucide-react";
import { MOCK_AGENTS } from "../../../data/mock";

export default function AgentsPage() {
    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header with Builder Call-to-Action */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">AI Workforce</h1>
                        <p className="text-muted-foreground mt-1">Manage your specialized agents or build new ones with Oto.</p>
                    </div>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:from-indigo-600 hover:to-purple-700 shadow-md">
                        <Sparkles className="mr-2 h-4 w-4" /> Build New Agent
                    </Button>
                </div>

                {/* Builder Preview / "Magic Input" */}
                <Card className="bg-muted/30 border-dashed border-2 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot className="h-5 w-5 text-primary" />
                            Draft an Agent
                        </CardTitle>
                        <CardDescription>Tell Oto what you need, and it will configure the role, tools, and knowledge for you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Input placeholder="e.g., 'I need an agent to handle product returns and update inventory via Shopify...'" className="h-12 text-base" />
                            <Button size="lg" variant="secondary" className="px-8">Start</Button>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Active Agents List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Active Agents</h2>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search agents..." className="pl-8 h-9" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_AGENTS.map((agent) => (
                            <Card key={agent.id} className="group hover:border-primary/50 transition-all duration-200">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="h-12 w-12 border border-border">
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">{agent.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{agent.name}</CardTitle>
                                        <Badge variant="outline" className="mt-1 font-normal text-[10px]">{agent.role}</Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="group-hover:text-primary">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">{agent.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="flex gap-2">
                                            {/* Mock Tools Icons */}
                                            <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center" title="Tools">
                                                <Wrench className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center" title="Chat">
                                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <div className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
