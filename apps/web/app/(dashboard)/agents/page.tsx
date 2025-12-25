"use client";

import { useEffect, useState } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Badge, Button, Input, Separator,
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
    Label, Textarea
} from "@oto/ui";
import {
    Plus, Search, Bot, Sparkles,
    Settings2, Activity, Zap
} from "lucide-react";
import { MOCK_AGENTS } from "../../../data/mock";
import { PersonaEditor } from "@/components/PersonaEditor";
import { motion } from "framer-motion";

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>(() => []);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [createSaving, setCreateSaving] = useState(false);
    const [createForm, setCreateForm] = useState({ name: "", role: "", description: "" });


    const loadAgents = async () => {
        try {
            const res = await fetch("/api/agents/list");
            const data = await res.json();
            if (Array.isArray(data?.agents)) {
                setAgents(data.agents);
                return;
            }
        } catch {
            // ignore
        }
        setAgents(MOCK_AGENTS.map(a => ({ ...a })));
    };

    const saveAgent = async (agent: any) => {
        const res = await fetch("/api/agents/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agent })
        });
        if (!res.ok) return agent;
        const data = await res.json();
        return data?.agent || agent;
    };

    useEffect(() => {
        loadAgents();
    }, []);

    const makeAvatar = (name: string) => {
        return name
            .split(/\s+/)
            .filter(Boolean)
            .map(w => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const createId = () => {
        const anyCrypto: any = (globalThis as any).crypto;
        if (anyCrypto?.randomUUID) return anyCrypto.randomUUID();
        return String(Date.now());
    };

    const filteredAgents = agents.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedAgent = selectedAgentId ? agents.find(a => a.id === selectedAgentId) : null;

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10 bg-background/50">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Activity className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Workforce Orchestration</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Agent Intelligence</h1>
                        <p className="text-muted-foreground mt-1 text-sm max-w-lg">
                            Configure advanced personas, system prompts, and tool permissions for your digital workforce.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/40" />
                            <Input
                                placeholder="Search workforce..."
                                className="pl-9 h-10 rounded-xl bg-muted/20 border-border/40"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            className="rounded-xl h-10 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/20"
                            onClick={() => setCreateOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create Agent
                        </Button>
                    </div>
                </div>

                {/* Active Agents List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Operational Workforce</h2>
                        </div>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase font-black px-2">{filteredAgents.length} Indexed Agents</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredAgents.map((agent) => (
                            <Card key={agent.id} className="bg-card/40 backdrop-blur-md border-border/40 hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold">
                                            {agent.avatar}
                                        </div>
                                        <div className="flex gap-1">
                                            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-[9px] uppercase tracking-tighter h-4 px-1">
                                                {agent.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <CardTitle className="text-sm font-bold">{agent.name}</CardTitle>
                                        <CardDescription className="text-[10px] mt-0.5 line-clamp-1 font-medium italic">"{agent.tone}"</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 flex-1 flex flex-col">
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-4 flex-1">{agent.description}</p>

                                    <div className="mt-auto space-y-3">
                                        {agent.isThinking ? (
                                            <div className="flex items-center gap-2 px-2 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                                                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                                                <span className="text-[9px] font-bold text-primary animate-pulse tracking-wide">PROCESSING...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/30 rounded-lg border border-border/20">
                                                <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full" />
                                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">System Ready</span>
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-[10px] h-8 rounded-lg bg-background/50 hover:bg-primary/10 hover:text-primary transition-colors border border-border/40"
                                            onClick={() => setSelectedAgentId(agent.id)}
                                        >
                                            <Settings2 className="h-3 w-3 mr-2" />
                                            Configure Intelligence
                                        </Button>
                                    </div>
                                </CardContent>
                                {agent.isThinking && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/40"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <PersonaEditor
                agent={selectedAgent}
                isOpen={!!selectedAgent}
                onClose={() => setSelectedAgentId(null)}
                onSave={async (updatedAgent: any) => {
                    const saved = await saveAgent(updatedAgent);
                    setAgents(prev => prev.map(a => a.id === saved.id ? saved : a));
                    setSelectedAgentId(null);
                }}
            />

            <Sheet open={createOpen} onOpenChange={setCreateOpen}>
                <SheetContent side="right" className="sm:max-w-[520px] overflow-y-auto">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="text-xl font-bold">Create Agent</SheetTitle>
                        <SheetDescription>Define a new digital persona and configure it after creation.</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                            <Input
                                value={createForm.name}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Returns Specialist"
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</Label>
                            <Input
                                value={createForm.role}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="e.g. Support & Ops"
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                            <Textarea
                                value={createForm.description}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="What should this agent do?"
                                className="min-h-[140px] rounded-xl"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                className="flex-1 rounded-xl"
                                disabled={createSaving || !createForm.name.trim()}
                                onClick={async () => {
                                    if (!createForm.name.trim()) return;
                                    setCreateSaving(true);
                                    try {
                                        const agent = {
                                            id: createId(),
                                            name: createForm.name.trim(),
                                            role: (createForm.role || "Custom").trim(),
                                            description: (createForm.description || "").trim(),
                                            status: "idle",
                                            isThinking: false,
                                            avatar: makeAvatar(createForm.name.trim()),
                                            tone: "Helpful & Professional",
                                            systemPrompt: `You are ${createForm.name.trim()}. Be concise, professional, and execute tasks reliably.`,
                                            allowedTools: ["search", "knowledge"],
                                        };

                                        const saved = await saveAgent(agent);
                                        setAgents(prev => [saved, ...prev]);
                                        setCreateForm({ name: "", role: "", description: "" });
                                        setCreateOpen(false);
                                        setSelectedAgentId(saved.id);
                                    } finally {
                                        setCreateSaving(false);
                                    }
                                }}
                            >
                                {createSaving ? "Creating..." : "Create & Configure"}
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setCreateOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
