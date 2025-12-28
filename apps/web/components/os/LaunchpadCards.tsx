"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Tabs, TabsList, TabsTrigger, Separator } from "@oto/ui";
import {
    Briefcase, Globe, Home, Plus, MessageSquare, Users, User, Shield,
    FlaskConical, Sparkles, Settings, Bot, ArrowUpRight, Zap, Brain, MessageCircle
} from "lucide-react";
import { useState } from "react";

// Helper for consistency
function WidgetHeader({ title, icon: Icon, onOpen, actionLabel = "Open View" }: any) {
    return (
        <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">{title}</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={onOpen}>
                {actionLabel} <ArrowUpRight className="h-3 w-3" />
            </Button>
        </div>
    );
}

// --- CARD 1: SPACES ---
export function SpacesWidget({ onOpen }: { onOpen: () => void }) {
    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors overflow-hidden">
            <CardContent className="p-5 flex flex-col h-full overflow-hidden">
                <WidgetHeader title="Spaces" icon={Briefcase} onOpen={onOpen} />

                <div className="flex-1 space-y-3 overflow-hidden">
                    <p className="text-sm text-muted-foreground mb-4 truncate">Collaborate with your team and AI agents.</p>

                    <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" className="justify-start gap-3 h-10 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                            <Briefcase className="h-4 w-4 text-blue-500" />
                            <span className="flex-1 text-left truncate">New Team Space</span>
                            <Plus className="h-3 w-3 opacity-50 shrink-0" />
                        </Button>
                        <Button variant="outline" className="justify-start gap-3 h-10 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                            <Globe className="h-4 w-4 text-green-500" />
                            <span className="flex-1 text-left truncate">New Community</span>
                            <Plus className="h-3 w-3 opacity-50 shrink-0" />
                        </Button>
                        <Button variant="outline" className="justify-start gap-3 h-10 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                            <MessageCircle className="h-4 w-4 text-purple-500" />
                            <span className="flex-1 text-left truncate">New Room</span>
                            <Plus className="h-3 w-3 opacity-50 shrink-0" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- CARD 2: CONVERSATIONS ---
export function ConversationsWidget({ onOpen }: { onOpen: () => void }) {
    // Mock recent threads
    const recents = [
        { id: 1, title: "Marketing Plan Q3", time: "2m ago", agent: "Oto" },
        { id: 2, title: "Code Review: Auth", time: "1h ago", agent: "DevBot" },
    ];

    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors overflow-hidden">
            <CardContent className="p-5 flex flex-col h-full overflow-hidden">
                <WidgetHeader title="Conversations" icon={MessageSquare} onOpen={onOpen} />

                <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                    <Button className="w-full gap-2 shadow-sm shrink-0" onClick={onOpen}>
                        <Plus className="h-4 w-4" /> Start New Chat
                    </Button>

                    <div className="space-y-2 mt-2 overflow-y-auto px-1 -mx-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</p>
                        {recents.map(r => (
                            <div key={r.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                        {r.agent[0]}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-medium truncate w-full">{r.title}</span>
                                        <span className="text-xs text-muted-foreground truncate w-full">with {r.agent}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{r.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- CARD 3: CONTACTS ---
export function ContactsWidget({ onOpen }: { onOpen: () => void }) {
    const [mode, setMode] = useState<"crm" | "personal">("crm");

    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors overflow-hidden">
            <CardContent className="p-5 flex flex-col h-full">
                <WidgetHeader title="Contacts" icon={Users} onOpen={onOpen} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-muted/50 p-1 rounded-lg flex mb-4 shrink-0">
                        <button
                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${mode === 'crm' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setMode('crm')}
                        >
                            Business CRM
                        </button>
                        <button
                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${mode === 'personal' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setMode('personal')}
                        >
                            Personal
                        </button>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                        {mode === 'crm' ? (
                            <>
                                <div className="p-3 border border-dashed rounded-lg bg-orange-500/5 border-orange-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="h-3 w-3 text-orange-500" />
                                        <span className="text-xs font-bold text-orange-600">AI Insight</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">3 Leads require follow-up today based on recent activity.</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 p-2 bg-muted/30 rounded text-center">
                                        <div className="text-lg font-bold">12</div>
                                        <div className="text-[10px] text-muted-foreground">Active Deals</div>
                                    </div>
                                    <div className="flex-1 p-2 bg-muted/30 rounded text-center">
                                        <div className="text-lg font-bold">48</div>
                                        <div className="text-[10px] text-muted-foreground">Contacts</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-center py-4 text-muted-foreground">
                                <User className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-xs">Manage personal connections and friends.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- CARD 4: LABS -> TOOLS & INTEGRATIONS ---
export function LabsWidget({ onOpen }: { onOpen: () => void }) {
    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors overflow-hidden">
            <CardContent className="p-5 flex flex-col h-full overflow-hidden">
                <WidgetHeader title="Labs" icon={Zap} onOpen={onOpen} />

                <div className="space-y-3 flex-1 overflow-y-auto">
                    <p className="text-xs text-muted-foreground mb-2">Connected Apps & Tools</p>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                            <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mb-1">
                                <span className="text-[10px] font-bold">WA</span>
                            </div>
                            <span className="text-[10px] font-medium">WhatsApp</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                            <div className="h-6 w-6 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center mb-1">
                                <span className="text-[10px] font-bold">GM</span>
                            </div>
                            <span className="text-[10px] font-medium">Gmail</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                            <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center mb-1">
                                <span className="text-[10px] font-bold">Ca</span>
                            </div>
                            <span className="text-[10px] font-medium">Canva</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-dashed border-muted-foreground/30 hover:bg-muted/30 transition-colors cursor-pointer" onClick={onOpen}>
                            <Plus className="h-4 w-4 text-muted-foreground mb-1" />
                            <span className="text-[10px] font-medium text-muted-foreground">Add Custom</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- CARD 5: SETTINGS ---
export function SettingsWidget({ onOpen }: { onOpen: () => void }) {
    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-5 flex flex-col h-full">
                <WidgetHeader title="Settings" icon={Settings} onOpen={onOpen} actionLabel="Manage" />

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onOpen}>
                        <User className="h-3 w-3 mr-2 text-muted-foreground" /> Profile
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 text-xs justify-start" onClick={onOpen}>
                        <Shield className="h-3 w-3 mr-2 text-muted-foreground" /> Security
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- CARD 6: AGENTS ---
export function AgentsWidget({ onOpen, onCreate }: { onOpen: () => void, onCreate: (mode: 'chat' | 'builder') => void }) {
    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-5 flex flex-col h-full">
                <WidgetHeader title="Agents" icon={Bot} onOpen={onOpen} />

                <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                        {/* Mock Active Agents */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="font-medium">2 Agents Active</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <Button className="w-full h-9 text-xs" onClick={() => onCreate('chat')}>
                            <Sparkles className="h-3 w-3 mr-2" />
                            Create with Oto
                        </Button>
                        <Button variant="outline" className="w-full h-9 text-xs" onClick={() => onCreate('builder')}>
                            Build Manually
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
