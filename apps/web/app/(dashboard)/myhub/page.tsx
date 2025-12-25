"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator } from "@oto/ui";
import { Users, TrendingUp, AlertCircle, CheckCircle2, Bot, ArrowRight, MessageSquare, Clock, LayoutDashboard, Sparkles, Layers, Zap, BookOpen, BarChart3, ChevronRight, Rocket, BarChart, Plus, Star, Target, Lightbulb, Heart, Globe, Calendar, Activity, Bell, Settings, X, Minimize2, Maximize2, Hash, Eye, MessageCircle, Share2 } from "lucide-react";
import { MOCK_CONTACTS, MOCK_AGENTS, MOCK_FEED, MOCK_PRODUCTIVITY, MOCK_NOTES, MOCK_SPACES, MOCK_CURRENT_USER, MOCK_AGENT_LOGS } from "../../../data/mock";
import Link from "next/link";
import { InteractiveChart } from "@/components/InteractiveChart";
import { AnalyticsDrilldownSheet, type AnalyticsMetric } from "@/components/AnalyticsDrilldownSheet";
import { generateEfficiencyIndexSeries, generateWeeklyFloatSeries, generateWeeklyIntSeries, getAverage, getPeakDay } from "@/lib/analytics";
import { motion } from "framer-motion";
import "../../../styles/newsletter-carousel.css";
import "../../../styles/scrollbar-hide.css";

export default function MyHubPage() {
    const [selectedMetric, setSelectedMetric] = useState<AnalyticsMetric | null>(null);
    const [updatesExpanded, setUpdatesExpanded] = useState(true);
    const [trendingModalOpen, setTrendingModalOpen] = useState(false);

    const metrics = useMemo(() => {
        const inquiriesSeries = generateWeeklyIntSeries(MOCK_PRODUCTIVITY.inquiriesResolved);
        const hoursSeries = generateWeeklyFloatSeries(MOCK_PRODUCTIVITY.hoursSaved, 1);
        const efficiencySeries = generateEfficiencyIndexSeries(MOCK_PRODUCTIVITY.efficiencyGain);
        const tasksSeries = generateWeeklyIntSeries(MOCK_PRODUCTIVITY.tasksAutomated, [0.1, 0.12, 0.14, 0.14, 0.16, 0.18, 0.16]);

        return { inquiriesSeries, hoursSeries, efficiencySeries, tasksSeries };
    }, []);

    // Mock trending topics from communities
    const trendingTopics = [
        { id: 1, title: "AI Agents Revolution", community: "Tech Innovators", views: 12450, replies: 234, tags: ["ai", "automation"], trend: "up", author: "Sarah Chen", avatar: "SC", time: "2h ago" },
        { id: 2, title: "Building Scalable Newsletters", community: "Content Creators", views: 8932, replies: 156, tags: ["newsletter", "growth"], trend: "up", author: "Mike Johnson", avatar: "MJ", time: "4h ago" },
        { id: 3, title: "Best CRM Practices 2025", community: "Sales Pros", views: 6789, replies: 89, tags: ["crm", "sales"], trend: "stable", author: "Emily Davis", avatar: "ED", time: "6h ago" },
        { id: 4, title: "Productivity Hacks with AI", community: "Life Hackers", views: 15623, replies: 412, tags: ["productivity", "ai"], trend: "up", author: "Alex Rivera", avatar: "AR", time: "8h ago" },
        { id: 5, title: "E-commerce Automation Tips", community: "Store Owners", views: 5432, replies: 67, tags: ["ecommerce", "automation"], trend: "down", author: "Lisa Wang", avatar: "LW", time: "12h ago" },
        { id: 6, title: "Community Building Strategies", community: "Community Managers", views: 9876, replies: 198, tags: ["community", "engagement"], trend: "up", author: "Tom Wilson", avatar: "TW", time: "1d ago" },
        { id: 7, title: "Mobile App Development Trends", community: "Dev Circle", views: 11234, replies: 267, tags: ["mobile", "dev"], trend: "up", author: "Nina Patel", avatar: "NP", time: "1d ago" },
        { id: 8, title: "Data Privacy Best Practices", community: "Security Focus", views: 7654, replies: 143, tags: ["privacy", "security"], trend: "stable", author: "James Lee", avatar: "JL", time: "2d ago" },
    ];

    // Personalized data
    const mySpaces = MOCK_SPACES.filter(s => s.role === "Admin" || s.role === "Member");
    const myAgents = MOCK_AGENTS.filter(a => a.status === "active");
    const recentAgentLogs = MOCK_AGENT_LOGS.slice(0, 4);
    const highValueLeads = MOCK_CONTACTS.filter(c => c.sentiment === "High" && c.status === "Lead");
    const recentClientActivity = MOCK_CONTACTS.filter(c => c.status === "Client" && c.activity.length > 0).slice(0, 3);
    const otoNotesPersonalized = MOCK_NOTES.map(note => ({
        ...note,
        relevance: note.type === "social" ? 95 : note.type === "tip" ? 85 : 70
    })).sort((a, b) => b.relevance - a.relevance);

    // General updates for floating navbar
    const generalUpdates = [
        { id: 1, type: "message", title: "New WhatsApp from Alice Johnson", preview: "Interested in bulk order...", time: "2m ago", icon: MessageSquare, color: "text-blue-500" },
        { id: 2, type: "system", title: "Agent 'Customer Support' is thinking", preview: "Analyzing inquiry...", time: "5m ago", icon: Bot, color: "text-purple-500" },
        { id: 3, type: "notification", title: "New lead in CRM", preview: "Charlie Brown added as High Value...", time: "12m ago", icon: Heart, color: "text-red-500" },
        { id: 4, type: "system", title: "Shopify integration ready", preview: "Connect your store to automate...", time: "1h ago", icon: Zap, color: "text-yellow-500" },
    ];

    return (
        <div className="h-full overflow-y-auto bg-background/50">
            <div className="max-w-7xl mx-auto p-8 space-y-10">
                {/* Daily Updates */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Daily Updates</h3>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">{generalUpdates.length} new</Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setUpdatesExpanded(!updatesExpanded)}
                                >
                                    {updatesExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Settings className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Bell className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {updatesExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2"
                        >
                            {generalUpdates.map(update => (
                                <div key={update.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <update.icon className={`h-4 w-4 ${update.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate">{update.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{update.preview}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{update.time}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
                {/* Personal Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row gap-8 items-start justify-between"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-primary/80 to-foreground/60 bg-clip-text text-transparent">
                            Welcome back, {MOCK_CURRENT_USER.name.split(" ")[0]}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Your digital workforce is humming. You have {myAgents.length} agents active across {mySpaces.length} spaces today.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="text-center">
                            <CardContent className="pt-4 pb-2">
                                <div className="text-2xl font-black text-primary">{MOCK_PRODUCTIVITY.hoursSaved}h</div>
                                <p className="text-xs text-muted-foreground">Hours Saved</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="pt-4 pb-2">
                                <div className="text-2xl font-black text-green-500">{MOCK_PRODUCTIVITY.inquiriesResolved}</div>
                                <p className="text-xs text-muted-foreground">Interactions</p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Newsletter Carousel */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Your Newsletters
                            </CardTitle>
                            <CardDescription>Latest issues from newsletters you subscribe to</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-hidden">
                                <div className="flex gap-4 animate-scroll-left">
                                    {/* First set */}
                                    <div className="flex-none w-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-purple-200 rounded mb-2 flex items-center justify-center">
                                                <BookOpen className="h-12 w-12 text-purple-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">AI Weekly Digest</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Latest AI trends and tools you need to know</p>
                                            <p className="text-xs text-purple-600 font-semibold">Issue #142 • Dec 24</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    <div className="flex-none w-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-blue-200 rounded mb-2 flex items-center justify-center">
                                                <Globe className="h-12 w-12 text-blue-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Tech Briefing</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Your daily dose of tech news and insights</p>
                                            <p className="text-xs text-blue-600 font-semibold">Today • Dec 25</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    <div className="flex-none w-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-green-200 rounded mb-2 flex items-center justify-center">
                                                <TrendingUp className="h-12 w-12 text-green-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Startup Insights</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Growth strategies and founder stories</p>
                                            <p className="text-xs text-green-600 font-semibold">Weekly • Dec 23</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    <div className="flex-none w-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-orange-200 rounded mb-2 flex items-center justify-center">
                                                <Zap className="h-12 w-12 text-orange-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Product Hunt Daily</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Top launches and community picks</p>
                                            <p className="text-xs text-orange-600 font-semibold">Daily • Dec 25</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    {/* Duplicate set for infinite scroll */}
                                    <div className="flex-none w-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-purple-200 rounded mb-2 flex items-center justify-center">
                                                <BookOpen className="h-12 w-12 text-purple-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">AI Weekly Digest</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Latest AI trends and tools you need to know</p>
                                            <p className="text-xs text-purple-600 font-semibold">Issue #142 • Dec 24</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    <div className="flex-none w-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-blue-200 rounded mb-2 flex items-center justify-center">
                                                <Globe className="h-12 w-12 text-blue-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Tech Briefing</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Your daily dose of tech news and insights</p>
                                            <p className="text-xs text-blue-600 font-semibold">Today • Dec 25</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    <div className="flex-none w-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-green-200 rounded mb-2 flex items-center justify-center">
                                                <TrendingUp className="h-12 w-12 text-green-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Startup Insights</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Growth strategies and founder stories</p>
                                            <p className="text-xs text-green-600 font-semibold">Weekly • Dec 23</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                    
                                    <div className="flex-none w-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                                        <div className="mb-3">
                                            <div className="h-32 w-full bg-orange-200 rounded mb-2 flex items-center justify-center">
                                                <Zap className="h-12 w-12 text-orange-600" />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1">Product Hunt Daily</h3>
                                            <p className="text-xs text-muted-foreground mb-2">Top launches and community picks</p>
                                            <p className="text-xs text-orange-600 font-semibold">Daily • Dec 25</p>
                                        </div>
                                        <Button size="sm" className="w-full">Read Full Article</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Spaces & Agents Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Spaces You’re In */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card>
                            <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    Your Spaces
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2" /> Newsletter</Button>
                                    <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" /> Browse</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mySpaces.map(space => (
                                <div key={space.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div>
                                        <p className="font-bold text-sm">{space.name}</p>
                                        <p className="text-xs text-muted-foreground">{space.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">{space.members} members</p>
                                        <Badge variant={space.role === "Admin" ? "default" : "secondary"} className="text-[10px] h-4">{space.role}</Badge>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Newsletter & Mailing List Section */}
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        Newsletters & Mailing Lists
                                    </h4>
                                    <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" /> Create</Button>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-sm">Weekly Tech Digest</p>
                                                <p className="text-xs text-muted-foreground">245 subscribers</p>
                                            </div>
                                            <Badge variant="default" className="text-[10px] h-4">Active</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-6 text-xs">Manage</Button>
                                            <Button size="sm" variant="outline" className="h-6 text-xs">Share Link</Button>
                                            <Button size="sm" variant="outline" className="h-6 text-xs">Assign Agent</Button>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-sm">Product Updates</p>
                                                <p className="text-xs text-muted-foreground">89 subscribers</p>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] h-4">Draft</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-6 text-xs">Edit</Button>
                                            <Button size="sm" variant="outline" className="h-6 text-xs">Subscribers</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>

                    {/* Trending Topics */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Hash className="h-5 w-5 text-orange-500" />
                                        Trending Topics
                                    </CardTitle>
                                    <Button variant="outline" size="sm" onClick={() => setTrendingModalOpen(true)}>View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {trendingTopics.slice(0, 3).map(topic => (
                                    <div key={topic.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-sm">{topic.title}</h4>
                                                {topic.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                                                {topic.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                                                {topic.trend === "stable" && <div className="h-3 w-3 bg-gray-400 rounded-full" />}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    {topic.community}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {topic.views.toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="h-3 w-3" />
                                                    {topic.replies}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {topic.avatar}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Agent Pulse */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-amber-500" />
                                    Agent Pulse
                                </CardTitle>
                                <Link href="/agents"><Button variant="outline" size="sm">Manage</Button></Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {myAgents.map(agent => (
                                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold">
                                        {agent.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">{agent.name}</p>
                                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                                    </div>
                                    <Badge variant={agent.isThinking ? "default" : "secondary"} className="text-[10px] h-4">
                                        {agent.isThinking ? "Thinking" : "Idle"}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CRM Highlights & Agent Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* CRM Highlights */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-red-500" />
                                        CRM Highlights
                                    </CardTitle>
                                    <Link href="/contacts"><Button variant="outline" size="sm">View CRM</Button></Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold mb-2">High‑Value Leads</h4>
                                    <div className="space-y-2">
                                        {highValueLeads.map(contact => (
                                            <div key={contact.id} className="flex items-center justify-between text-xs p-2 rounded bg-red-50/30">
                                                <div>
                                                    <p className="font-bold">{contact.name}</p>
                                                    <p className="text-muted-foreground">{contact.email}</p>
                                                </div>
                                                <Badge className="bg-red-100 text-red-700">High</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold mb-2">Recent Client Activity</h4>
                                    <div className="space-y-2">
                                        {recentClientActivity.map(contact => (
                                            <div key={contact.id} className="text-xs p-2 rounded bg-green-50/30">
                                                <p className="font-bold">{contact.name}</p>
                                                <p className="text-muted-foreground">{contact.activity[0]?.summary}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Agent Activity Logs */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    Agent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 font-mono text-xs">
                                    {recentAgentLogs.map(log => (
                                        <div key={log.id} className="flex items-center gap-3 p-2 rounded bg-muted/30">
                                            <span className="text-muted-foreground">{log.timestamp}</span>
                                            <Badge variant={log.level === "THINK" ? "default" : log.level === "TOOL" ? "secondary" : "outline"} className="text-[9px] h-4">
                                                {log.level}
                                            </Badge>
                                            <span className="text-foreground/80">{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Oto Notes & Labs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Oto Notes */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                                    Oto Notes for You
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {otoNotesPersonalized.map(note => (
                                    <div key={note.id} className="group hover:border-primary/30 transition-colors cursor-pointer p-3 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2 mb-1">
                                            {note.type === "social" && <Star className="h-4 w-4 text-yellow-500" />}
                                            {note.type === "tip" && <Lightbulb className="h-4 w-4 text-blue-500" />}
                                            {note.type === "news" && <Globe className="h-4 w-4 text-green-500" />}
                                            <h4 className="text-sm font-bold">{note.title}</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{note.content}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Labs: New Tools */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Rocket className="h-5 w-5 text-purple-500" />
                                        New in Labs
                                    </CardTitle>
                                    <Link href="/labs"><Button variant="outline" size="sm">Explore</Button></Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50/30 border border-purple-500/20">
                                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-purple-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">Shopify Integration</h3>
                                            <p className="text-sm text-muted-foreground">Connect your store to automate inventory and order updates.</p>
                                        </div>
                                        <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Connect</Button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50/30 border border-blue-500/20">
                                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <MessageSquare className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">WhatsApp Enhancements</h3>
                                            <p className="text-sm text-muted-foreground">New message templates and auto‑reply flows.</p>
                                        </div>
                                        <Button size="sm" variant="outline">Learn More</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Trending Topics Modal */}
            {trendingModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setTrendingModalOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Hash className="h-5 w-5 text-orange-500" />
                                    Trending Topics from Your Communities
                                </h2>
                                <Button variant="ghost" size="icon" onClick={() => setTrendingModalOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-hide">
                            <div className="space-y-4">
                                {trendingTopics.map(topic => (
                                    <div key={topic.id} className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                {topic.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-sm">{topic.title}</h3>
                                                    {topic.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                                                    {topic.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                                                    {topic.trend === "stable" && <div className="h-3 w-3 bg-gray-400 rounded-full" />}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        {topic.community}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {topic.views.toLocaleString()} views
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="h-3 w-3" />
                                                        {topic.replies} replies
                                                    </span>
                                                    <span>{topic.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">by {topic.author}</span>
                                                    <div className="flex gap-1">
                                                        {topic.tags.map(tag => (
                                                            <Badge key={tag} variant="secondary" className="text-[10px] h-4">
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                                        <MessageCircle className="h-3 w-3 mr-1" />
                                                        Reply
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                                        <Share2 className="h-3 w-3 mr-1" />
                                                        Share
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <AnalyticsDrilldownSheet metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
        </div>
    );
}
