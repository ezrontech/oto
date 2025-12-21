"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Separator, Avatar, AvatarFallback, AvatarImage } from "@oto/ui";
import { Plus, Calendar as CalendarIcon, FileText, CheckSquare, Users, Sparkles, Briefcase, Clock, ChevronRight } from "lucide-react";
import { MOCK_CLIENTS, MOCK_TASKS, MOCK_EVENTS, MOCK_TEAM } from "../../../data/mock";

export default function WorkspacePage() {
    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Team Space</h1>
                        <p className="text-muted-foreground mt-1">Collaboration hub for clients, team, and projects.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Users className="mr-2 h-4 w-4" /> Invite Member
                        </Button>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="tasks" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="tasks" className="gap-2"><CheckSquare className="h-4 w-4" /> Tasks</TabsTrigger>
                        <TabsTrigger value="calendar" className="gap-2"><CalendarIcon className="h-4 w-4" /> Calendar</TabsTrigger>
                        <TabsTrigger value="people" className="gap-2"><Users className="h-4 w-4" /> People</TabsTrigger>
                        <TabsTrigger value="docs" className="gap-2"><FileText className="h-4 w-4" /> Documents</TabsTrigger>
                    </TabsList>

                    {/* TASKS TAB */}
                    <TabsContent value="tasks" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="col-span-2">
                                <CardHeader>
                                    <CardTitle>Active Tasks</CardTitle>
                                    <CardDescription>Requests from clients and internal projects.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {MOCK_TASKS.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/20 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <CheckSquare className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{task.title}</div>
                                                        <div className="text-xs text-muted-foreground">{task.client} • Due {task.due}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-xs text-muted-foreground">
                                                        Assigned to <span className="font-medium text-foreground">{task.assignee}</span>
                                                    </div>
                                                    <Badge variant={task.status === "Completed" ? "secondary" : "default"}>
                                                        {task.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Request Automation</CardTitle>
                                    <CardDescription>Let Oto handle routine requests.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <h4 className="font-medium text-sm mb-1">Incoming Client Request</h4>
                                        <p className="text-xs text-muted-foreground mb-3">"Can we get a summary of last week's ads performance?"</p>
                                        <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0">
                                            <Sparkles className="h-3 w-3" /> Auto-Generate Report
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* CALENDAR TAB */}
                    <TabsContent value="calendar" className="space-y-6">
                        <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold">December 2025</h2>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <Button variant="secondary" className="gap-2">
                                <Sparkles className="h-3 w-3" /> Generate Content Strategy
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {MOCK_EVENTS.map((event) => (
                                <Card key={event.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{event.type}</div>
                                        <div className="font-medium text-sm mb-2">{event.title}</div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" /> {event.date}
                                            <Clock className="h-3 w-3" /> {event.time}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Empty Slot Placeholder */}
                            <Card className="border border-dashed border-border/60 bg-transparent flex flex-col items-center justify-center p-6 text-muted-foreground hover:bg-muted/20 cursor-pointer h-[120px]">
                                <Plus className="h-5 w-5 mb-1 opacity-50" />
                                <span className="text-xs font-medium">Add Event</span>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* PEOPLE TAB */}
                    <TabsContent value="people" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Clients</CardTitle>
                                    <CardDescription>External partners and clients.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {MOCK_CLIENTS.map((client) => (
                                        <div key={client.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                                                    {client.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{client.name}</div>
                                                    <div className="text-xs text-muted-foreground">{client.industry}</div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{client.status}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Team Members</CardTitle>
                                    <CardDescription>Internal team and agents.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {MOCK_TEAM.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                                                    {member.name.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{member.name}</div>
                                                    <div className="text-xs text-muted-foreground">{member.role}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* DOCS TAB */}
                    <TabsContent value="docs">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shared Documents</CardTitle>
                                <CardDescription>Contract, briefs, and strategy docs.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No documents shared yet.</p>
                                    <Button variant="link" className="mt-2 text-primary">Upload Document</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
