"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
    Button, Input, Textarea, Label, Badge, Switch, ScrollArea, cn
} from "@oto/ui";
import { Sparkles, Terminal, Shield, Zap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONNECTORS } from "@/lib/integrations";

interface PersonaEditorProps {
    agent: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedAgent: any) => void;
}

type AvailableTool = {
    key: string;
    name: string;
    type: string;
    connected: boolean;
};

export function PersonaEditor({ agent, isOpen, onClose, onSave }: PersonaEditorProps) {
    const [tone, setTone] = useState("");
    const [prompt, setPrompt] = useState("");
    const [allowedTools, setAllowedTools] = useState<string[]>([]);
    const [availableTools, setAvailableTools] = useState<AvailableTool[]>([]);
    const [toolsLoading, setToolsLoading] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewMsg, setPreviewMsg] = useState<string | null>(null);

    const toolKeyIndex = useMemo(() => {
        const map: Record<string, string> = {};
        for (const c of Object.values(CONNECTORS)) {
            map[c.name.toLowerCase()] = c.key;
        }
        map["search"] = "search";
        map["internal knowledge"] = "knowledge";
        return map;
    }, []);

    const normalizeToolKeys = (input: any): string[] => {
        const raw = Array.isArray(input) ? input : [];
        const out = new Set<string>();
        for (const t of raw) {
            const s = String(t);
            const lower = s.toLowerCase();
            const mapped = toolKeyIndex[lower];
            out.add(mapped || s);
        }
        return Array.from(out);
    };

    useEffect(() => {
        if (!agent) return;
        setTone(agent?.tone || "");
        setPrompt(agent?.systemPrompt || "");
        setAllowedTools(normalizeToolKeys(agent?.allowedTools));
        setPreviewMsg(null);
    }, [agent]);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;
        const load = async () => {
            setToolsLoading(true);
            try {
                const res = await fetch("/api/integrations/list");
                const data = await res.json();
                const integrations = data?.integrations || {};
                const connectedProviders = new Set(
                    Object.values(integrations).map((e: any) => String(e?.provider || "")).filter(Boolean)
                );

                const systemTools: AvailableTool[] = [
                    { key: "search", name: "Search", type: "System", connected: true },
                    { key: "knowledge", name: "Internal Knowledge", type: "System", connected: true },
                ];

                const connectorTools: AvailableTool[] = Object.values(CONNECTORS).map(c => ({
                    key: c.key,
                    name: c.name,
                    type: c.authType,
                    connected: connectedProviders.has(c.key)
                }));

                if (!cancelled) {
                    setAvailableTools([...systemTools, ...connectorTools]);
                }
            } catch {
                if (!cancelled) {
                    const systemTools: AvailableTool[] = [
                        { key: "search", name: "Search", type: "System", connected: true },
                        { key: "knowledge", name: "Internal Knowledge", type: "System", connected: true },
                    ];
                    const connectorTools: AvailableTool[] = Object.values(CONNECTORS).map(c => ({
                        key: c.key,
                        name: c.name,
                        type: c.authType,
                        connected: false
                    }));
                    setAvailableTools([...systemTools, ...connectorTools]);
                }
            } finally {
                if (!cancelled) setToolsLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [isOpen]);

    const isToolAllowed = (tool: AvailableTool) => {
        if (allowedTools.includes(tool.key)) return true;
        if (allowedTools.includes(tool.name)) return true;
        const normalized = allowedTools.map(t => String(t).toLowerCase());
        if (normalized.includes(tool.name.toLowerCase())) return true;
        return false;
    };

    const toggleTool = (tool: AvailableTool, enabled: boolean) => {
        const key = tool.key;
        setAllowedTools(prev => {
            const set = new Set(prev.map(String));
            if (enabled) set.add(key);
            else set.delete(key);
            return Array.from(set);
        });
    };

    const handleGeneratePreview = () => {
        setPreviewLoading(true);
        // Simulation
        setTimeout(() => {
            setPreviewMsg(`[Oto AI Preview - Tone: ${tone}]\n"Hello! I've analyzed your request. I can certainly help you with that bulk order inquiry. Should I escalate this to the team?"`);
            setPreviewLoading(false);
        }, 1500);
    };

    if (!agent) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[500px] border-l border-border/40 bg-card/50 backdrop-blur-xl p-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b border-border/20">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Text className="text-primary font-bold">{agent.avatar}</Text>
                            </div>
                            <div>
                                <SheetTitle className="text-xl">{agent.name}</SheetTitle>
                                <SheetDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
                                    Persona & Intelligence Configuration
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-8 pb-12">
                            {/* Tone Configuration */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    <Label className="text-[10px] font-bold uppercase tracking-widest">Agent Tone & Personality</Label>
                                </div>
                                <Input
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    placeholder="e.g. Helpful, Persistent, Professional"
                                    className="bg-background/50"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {["Professional", "Urgent", "Friendly", "Direct"].map(t => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-primary/20"
                                            onClick={() => setTone(t)}
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* System Prompt */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-blue-500" />
                                    <Label className="text-[10px] font-bold uppercase tracking-widest">Core Instructions (System Prompt)</Label>
                                </div>
                                <Textarea
                                    className="min-h-[150px] bg-background/50 font-mono text-xs leading-relaxed"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Define how this agent should behave..."
                                />
                            </div>

                            {/* Tool Governance */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    <Label className="text-[10px] font-bold uppercase tracking-widest">Tool Permissions & Governance</Label>
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-4 space-y-4 border border-border/20">
                                    {!toolsLoading && availableTools.length > 0 ? (
                                        availableTools.map(tool => (
                                            <div key={tool.key} className="flex items-center justify-between gap-3">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{tool.name}</span>
                                                        <Badge
                                                            variant="secondary"
                                                            className={cn(
                                                                "text-[9px] h-4 px-1.5 uppercase font-black tracking-widest",
                                                                tool.connected ? "bg-emerald-500/10 text-emerald-500" : "bg-muted/50 text-muted-foreground/60"
                                                            )}
                                                        >
                                                            {tool.connected ? "Connected" : "Not Connected"}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{tool.type}</span>
                                                </div>
                                                <Switch checked={isToolAllowed(tool)} onCheckedChange={(v) => toggleTool(tool, !!v)} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-xs text-muted-foreground">{toolsLoading ? "Loading tools..." : "No active tools found. Connect tools in the dashboard to enable them for agents."}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Test & Preview */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-500" />
                                        <Label className="text-[10px] font-bold uppercase tracking-widest">Intelligence Preview</Label>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={handleGeneratePreview}>
                                        RUN TEST
                                    </Button>
                                </div>

                                <div className="bg-black/40 rounded-2xl p-4 min-h-[100px] flex items-center justify-center relative overflow-hidden border border-border/20">
                                    <AnimatePresence mode="wait">
                                        {previewLoading ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                <span className="text-[10px] text-muted-foreground animate-pulse">Agent is thinking...</span>
                                            </motion.div>
                                        ) : previewMsg ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="w-full text-xs italic text-muted-foreground leading-relaxed font-medium"
                                            >
                                                {previewMsg}
                                            </motion.div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground/40 italic">No recent test run.</span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t border-border/20 bg-background/50">
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 rounded-xl"
                                onClick={() => {
                                    onSave({
                                        ...agent,
                                        tone,
                                        systemPrompt: prompt,
                                        allowedTools: normalizeToolKeys(allowedTools)
                                    });
                                }}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Save Configuration
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Internal text helper since we can't use React Native Text in Web
function Text({ children, className }: any) {
    return <span className={className}>{children}</span>;
}
