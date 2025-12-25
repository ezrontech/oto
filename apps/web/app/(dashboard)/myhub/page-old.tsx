"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator } from "@oto/ui";
import { Users, TrendingUp, AlertCircle, CheckCircle2, Bot, ArrowRight, MessageSquare, Clock, LayoutDashboard, Sparkles, Layers, Zap, BookOpen, BarChart3, ChevronRight, Rocket, BarChart } from "lucide-react";
import { MOCK_CONTACTS, MOCK_AGENTS, MOCK_FEED, MOCK_PRODUCTIVITY, MOCK_NOTES } from "../../../data/mock";
import Link from "next/link";
import { InteractiveChart } from "@/components/InteractiveChart";
import { AnalyticsDrilldownSheet, type AnalyticsMetric } from "@/components/AnalyticsDrilldownSheet";
import { generateEfficiencyIndexSeries, generateWeeklyFloatSeries, generateWeeklyIntSeries, getAverage, getPeakDay } from "@/lib/analytics";

export default function MyHubPage() {
    const activeAgents = MOCK_AGENTS.filter(a => a.status === "active").length;

    const [selectedMetric, setSelectedMetric] = useState<AnalyticsMetric | null>(null);

    const metrics = useMemo(() => {
        const inquiriesSeries = generateWeeklyIntSeries(MOCK_PRODUCTIVITY.inquiriesResolved);
        const hoursSeries = generateWeeklyFloatSeries(MOCK_PRODUCTIVITY.hoursSaved, 1);
        const efficiencySeries = generateEfficiencyIndexSeries(MOCK_PRODUCTIVITY.efficiencyGain);
        const tasksSeries = generateWeeklyIntSeries(MOCK_PRODUCTIVITY.tasksAutomated, [0.1, 0.12, 0.14, 0.14, 0.16, 0.18, 0.16]);

        return {
            inquiriesSeries,
            hoursSeries,
            efficiencySeries,
            tasksSeries
        };
    }, []);

    return (
        <div className="h-full overflow-y-auto bg-background/50">
            <div className="max-w-7xl mx-auto p-8 space-y-10">

                {/* Header with AI Briefing */}
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Welcome back, Ezron
                        </h1>
                        <p className="text-muted-foreground text-lg">Your agency is scaling 24% faster this week with Oto.</p>
                    </div>

                    {/* TOP LEVEL AI BRIEFING PANEL */}
                    <Card className="flex-1 w-full lg:max-w-2xl bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 shadow-xl shadow-primary/5 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                    <Bot className="h-3.5 w-3.5 text-white" />
                                </div>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Daily Briefing from Oto</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base leading-relaxed text-foreground/90 italic">
                                "{MOCK_NOTES[0].content}"
                            </p>
                            <div className="flex gap-3 mt-4">
                                <Button size="sm" className="h-8 text-xs gap-1.5"><Rocket className="h-3.5 w-3.5" /> View Active Leads</Button>
                                <Button size="sm" variant="ghost" className="h-8 text-xs text-primary font-bold">Show Analysis</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card
                        className="bg-gradient-to-br from-background via-background to-background/50 border-border/50 shadow-xl cursor-pointer hover:border-primary/30"
                        onClick={() => setSelectedMetric({
                            id: "inquiries",
                            title: "Weekly Performance",
                            description: "Inquiries handled across channels over the last 7 days.",
                            color: "#6366f1",
                            series: metrics.inquiriesSeries,
                            totalLabel: "Total Inquiries",
                            totalValue: String(MOCK_PRODUCTIVITY.inquiriesResolved)
                        })}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <BarChart className="h-5 w-5 text-primary" />
                                    Weekly Performance
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">Live</Badge>
                            </div>
                            <CardDescription>
                                Real-time metrics and activity trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 mb-4">
                                <InteractiveChart 
                                    data={metrics.inquiriesSeries}
                                    variant="detailed"
                                    color="#6366f1"
                                    height="192px"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Peak Day</p>
                                    <p className="font-bold text-foreground">{getPeakDay(metrics.inquiriesSeries).date}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Avg. Daily</p>
                                    <p className="font-bold text-foreground">{Math.round(getAverage(metrics.inquiriesSeries))} interactions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-gradient-to-br from-background via-background to-background/50 border-border/50 shadow-xl cursor-pointer hover:border-emerald-500/30"
                        onClick={() => setSelectedMetric({
                            id: "hours_saved",
                            title: "Efficiency Trends",
                            description: "Hours saved through automations and agent workflows.",
                            color: "#10b981",
                            series: metrics.hoursSeries,
                            totalLabel: "Hours Saved",
                            totalValue: `${MOCK_PRODUCTIVITY.hoursSaved}h`
                        })}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Efficiency Trends
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">+24%</Badge>
                            </div>
                            <CardDescription>
                                Automation impact and time savings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 mb-4">
                                <InteractiveChart 
                                    data={metrics.hoursSeries}
                                    variant="detailed"
                                    color="#10b981"
                                    height="192px"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Hours Saved</p>
                                    <p className="font-bold text-green-500">{MOCK_PRODUCTIVITY.hoursSaved}h</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Cost Reduction</p>
                                    <p className="font-bold text-foreground">$1,240/mo</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats & Productivity (Educational) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                        className="border-l-4 border-l-green-500 shadow-sm cursor-pointer hover:border-emerald-500/30"
                        onClick={() => setSelectedMetric({
                            id: "hours_saved_stat",
                            title: "Hours Saved",
                            description: "Daily breakdown of hours saved via automation.",
                            color: "#10b981",
                            series: metrics.hoursSeries,
                            totalLabel: "Total Hours Saved",
                            totalValue: `${MOCK_PRODUCTIVITY.hoursSaved}h`
                        })}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hours Saved</CardTitle>
                            <Clock className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{MOCK_PRODUCTIVITY.hoursSaved}h</div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Equivalent to <span className="text-foreground font-bold">1.5 work days</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="border-l-4 border-l-blue-500 shadow-sm cursor-pointer hover:border-primary/30"
                        onClick={() => setSelectedMetric({
                            id: "inquiries_stat",
                            title: "Inquiries Handled",
                            description: "Daily inquiry volume over the last 7 days.",
                            color: "#3b82f6",
                            series: metrics.inquiriesSeries,
                            totalLabel: "Total Inquiries",
                            totalValue: String(MOCK_PRODUCTIVITY.inquiriesResolved)
                        })}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Inquiries Handled</CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{MOCK_PRODUCTIVITY.inquiriesResolved}</div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Across <span className="text-foreground font-bold">WhatsApp & Web</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="border-l-4 border-l-purple-500 shadow-sm cursor-pointer hover:border-purple-500/30"
                        onClick={() => setSelectedMetric({
                            id: "efficiency_gain",
                            title: "Efficiency Gain",
                            description: "Operational efficiency index based on automation impact.",
                            color: "#a855f7",
                            series: metrics.efficiencySeries,
                            totalLabel: "Efficiency Gain",
                            totalValue: `+${MOCK_PRODUCTIVITY.efficiencyGain}%`
                        })}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Efficiency Gain</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">+{MOCK_PRODUCTIVITY.efficiencyGain}%</div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Compared to <span className="text-foreground font-bold">Manual Handling</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="border-l-4 border-l-orange-500 shadow-sm bg-orange-50/10 cursor-pointer hover:border-orange-500/30"
                        onClick={() => setSelectedMetric({
                            id: "tasks_automated",
                            title: "Tasks Automated",
                            description: "Daily count of automated tasks completed by agents.",
                            color: "#f97316",
                            series: metrics.tasksSeries,
                            totalLabel: "Tasks Automated",
                            totalValue: String(MOCK_PRODUCTIVITY.tasksAutomated)
                        })}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Agency OS</CardTitle>
                            <Zap className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{activeAgents} Agents</div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Running <span className="text-foreground font-bold">24/7 automations</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Insights & Pro Tips (Educational) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* NOTES FROM OTO (Social/News/Tips) */}
                    <Card className="lg:col-span-1 bg-muted/20 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Notes from Oto
                            </CardTitle>
                            <CardDescription>Social insights & recommendations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {MOCK_NOTES.map(note => (
                                <div key={note.id} className="group cursor-pointer">
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{note.title}</h4>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {note.content}
                                    </p>
                                    <div className="mt-4 border-b border-border/50 group-last:hidden" />
                                </div>
                            ))}
                            <Button variant="outline" className="w-full text-xs font-bold">Manage Subscriptions</Button>
                        </CardContent>
                    </Card>

                    {/* RECENT ACTIVITY & UPDATES */}
                    <Card className="lg:col-span-2 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Agency Pulse</CardTitle>
                                <CardDescription>Latest updates from your internal and community hubs.</CardDescription>
                            </div>
                            <BarChart3 className="h-5 w-5 text-muted-foreground/50" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {MOCK_FEED?.map((post: any) => (
                                    <div key={post.id} className="flex gap-4 items-start pb-6 border-b border-border/50 last:border-0 last:pb-0 group">
                                        <div className={`h-10 w-10 rounded-xl ${post.user.avatar} flex items-center justify-center shrink-0 border border-border shadow-sm group-hover:scale-110 transition-transform`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold">{post.user.name}</p>
                                                    <Badge variant="secondary" className="text-[10px] h-4">Community</Badge>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{post.time} ago</span>
                                            </div>
                                            <p className="text-sm text-foreground/80 mt-1 max-w-xl">{post.content}</p>

                                            <div className="flex gap-4 mt-3 text-muted-foreground text-xs font-medium">
                                                <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors"><MessageSquare size={13} /> {post.comments} comments</span>
                                                <span className="flex items-center gap-1.5 hover:text-red-500 cursor-pointer transition-colors"><TrendingUp size={13} /> {post.likes} likes</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>

            <AnalyticsDrilldownSheet metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
        </div>
    );
}
