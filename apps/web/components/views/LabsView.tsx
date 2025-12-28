"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, ScrollArea, cn } from "@oto/ui";
import { FlaskConical, Sparkles, Brain, Zap, Lock, Key, Calendar, FileText, CheckSquare, Target, BookOpen, Clock, Tag, FileInput, Users, UserSquare2, MessageSquare, Mail, Settings, Bot, Cpu, Share2, MessageCircle, Hammer, Puzzle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { useWindowManager } from "@/context/window-manager";
import { Plan } from "@/lib/plans";
import { useState } from "react";
import dynamic from 'next/dynamic';

const BillingView = dynamic(() => import('./BillingView'), { loading: () => null });

interface LabApp {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    requiredPlan: Plan;
    category: 'Essential' | 'Professional' | 'Advanced' | 'Custom';
    status?: string;
}

export default function LabsView() {
    const { user } = useAuth();
    const { openWindow } = useWindowManager();

    // Normalize plan name to handle legacy values
    const getPlanName = (plan: string | undefined | null): Plan => {
        if (!plan) return 'Community';
        const normalized = plan.toLowerCase();
        if (normalized.includes('creator')) return 'Creator';
        if (normalized.includes('campaign') || normalized.includes('agency')) return 'Campaign';
        if (normalized.includes('community') || normalized.includes('free')) return 'Community';
        return 'Community'; // Default fallback
    };

    const currentPlan = getPlanName(user?.plan);

    const labs: LabApp[] = [
        // Community Tiers
        { id: "cal", title: "Calendar", description: "Manage your schedule and events.", icon: <Calendar className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "notes", title: "Notes", description: "Simple notebook for your thoughts.", icon: <FileText className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "tasks", title: "Tasks", description: "To-do lists and task management.", icon: <CheckSquare className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "goals", title: "Goals", description: "Track your personal and work goals.", icon: <Target className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "journal", title: "Journal", description: "Daily reflections and logging.", icon: <BookOpen className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "bookings", title: "Bookings", description: "Appointments and schedule management.", icon: <Clock className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "offers", title: "Offers", description: "Products and client offers.", icon: <Tag className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "invoice", title: "Invoice", description: "Create and send professional invoices.", icon: <FileInput className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "crm", title: "CRM", description: "Advanced contact and lead management.", icon: <Users className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "agent-card", title: "Agent Card", description: "Your digital intelligence identity.", icon: <UserSquare2 className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "agent-chat", title: "Agent Chat", description: "Core web-based chat experience.", icon: <MessageSquare className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "articles", title: "Articles", description: "Knowledge base and mailing lists.", icon: <Mail className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "wa", title: "WhatsApp", description: "Core WhatsApp connectivity.", icon: <MessageCircle className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },
        { id: "email", title: "Email", description: "Standard email integration.", icon: <Mail className="h-5 w-5" />, requiredPlan: 'Community', category: 'Essential' },

        // Creator Tiers
        { id: "agents", title: "Agents", description: "Deploy specialized digital workers.", icon: <Bot className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },
        { id: "automations", title: "Automations", description: "Build complex automated workflows.", icon: <Cpu className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },
        { id: "content", title: "Content", description: "AI-assisted content creation.", icon: <Sparkles className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },
        { id: "campaigns", title: "Campaigns", description: "Manage marketing and outreach.", icon: <Target className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },
        { id: "integrations", title: "Integrations", description: "Canva, Twilio, and partner apps.", icon: <Puzzle className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },
        { id: "social", title: "Social Media", description: "Unified social management.", icon: <Share2 className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },
        { id: "convos", title: "Conversations", description: "Unified omnichannel inbox.", icon: <MessageSquare className="h-5 w-5" />, requiredPlan: 'Creator', category: 'Professional' },

        // Campaign Tiers
        { id: "custom-agents", title: "Custom Agents", description: "Fully bespoke agent logic.", icon: <Settings className="h-5 w-5" />, requiredPlan: 'Campaign', category: 'Advanced' },
        { id: "custom-tools", title: "Custom Tools", description: "In-house tools and calculators.", icon: <Hammer className="h-5 w-5" />, requiredPlan: 'Campaign', category: 'Advanced' },
        { id: "custom-api", title: "Custom APIs", description: "Connect any external service.", icon: <Key className="h-5 w-5" />, requiredPlan: 'Campaign', category: 'Custom' },
    ];

    const isLocked = (required: Plan) => {
        if (currentPlan === 'Campaign') return false;
        if (currentPlan === 'Creator') return required === 'Campaign';
        return required !== 'Community';
    };

    const renderLabCard = (lab: LabApp) => {
        const locked = isLocked(lab.requiredPlan);
        return (
            <motion.div
                key={lab.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={locked ? {} : { scale: 1.02 }}
                className="h-full"
            >
                <Card className={cn(
                    "h-full transition-all border-border/50 relative overflow-hidden group",
                    locked ? "bg-muted/5 opacity-80" : "bg-card/50 backdrop-blur-md hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-md"
                )}>
                    {locked && (
                        <div className="absolute top-3 right-3 z-10">
                            <Badge variant="outline" className="gap-1.5 py-0.5 px-2 bg-background/50 text-[10px] font-bold uppercase">
                                <Lock className="h-3 w-3" /> {lab.requiredPlan}
                            </Badge>
                        </div>
                    )}
                    <CardHeader className="pb-3">
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                            locked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        )}>
                            {lab.icon}
                        </div>
                        <CardTitle className="text-lg font-bold">{lab.title}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">{lab.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant={locked ? "ghost" : "outline"}
                            size="sm"
                            className="w-full text-xs font-semibold"
                            disabled={locked}
                        >
                            {locked ? `Requires ${lab.requiredPlan}` : 'Open App'}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <div className="h-full bg-background flex flex-col">
            <header className="p-8 border-b bg-background/60 backdrop-blur-xl sticky top-0 z-20 shrink-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Labs</h1>
                        <p className="text-muted-foreground mt-1">Experimental features, powerful integrations, and developer tools.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="px-4 py-1 gap-2 border-primary/20 text-primary font-bold">
                            <Sparkles className="h-4 w-4" /> {currentPlan} Plan
                        </Badge>
                        {currentPlan !== 'Campaign' && (
                            <Button size="sm" onClick={() => openWindow("billing", "Plans & Pricing", <BillingView />)}>
                                Upgrade
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1">
                <div className="max-w-7xl mx-auto p-8">
                    <Tabs defaultValue="all" className="space-y-8">
                        <TabsList className="bg-muted/50 p-1 border">
                            <TabsTrigger value="all">All Labs</TabsTrigger>
                            <TabsTrigger value="community">Community</TabsTrigger>
                            <TabsTrigger value="creator">Creator</TabsTrigger>
                            <TabsTrigger value="campaign">Campaign</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-12">
                            <section className="space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                                    <FlaskConical className="h-5 w-5 text-blue-500" /> Essential Labs
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {labs.filter(l => l.category === 'Essential').map(renderLabCard)}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                                    <Zap className="h-5 w-5 text-purple-500" /> Professional Labs
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {labs.filter(l => l.category === 'Professional').map(renderLabCard)}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                                    <Brain className="h-5 w-5 text-orange-500" /> Advanced Intelligence
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {labs.filter(l => l.category === 'Advanced' || l.category === 'Custom').map(renderLabCard)}
                                </div>
                            </section>
                        </TabsContent>

                        <TabsContent value="community">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {labs.filter(l => l.requiredPlan === 'Community').map(renderLabCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="creator">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {labs.filter(l => l.requiredPlan === 'Creator').map(renderLabCard)}
                            </div>
                        </TabsContent>

                        <TabsContent value="campaign">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {labs.filter(l => l.requiredPlan === 'Campaign').map(renderLabCard)}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    );
}
