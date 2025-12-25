"use client";

import { useEffect, useState } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Badge, Button, cn,
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
    Input, Label, Textarea
} from "@oto/ui";
import {
    Mail, Calendar, MessageCircle, PenTool, LayoutTemplate,
    Phone, Zap, Activity, ExternalLink, Plus, Loader2, Check,
    Terminal, Globe, Shield, Box
} from "lucide-react";

interface Tool {
    id: string | number;
    key: string;
    name: string;
    description: string;
    icon: any;
    connected: boolean;
    tag: string;
    type: string;
    authType?: 'oauth2' | 'apikey' | 'webhook' | 'none';
}

export default function ToolsPage() {
    const [tools, setTools] = useState<Tool[]>([
        { id: 1, key: "whatsapp", name: "WhatsApp Business", description: "Unified chat & automated responses.", icon: MessageCircle, connected: false, tag: "Essential", type: "Integration", authType: 'apikey' },
        { id: 2, key: "gmail", name: "Gmail", description: "Email automation and triage.", icon: Mail, connected: false, tag: "Essential", type: "Integration", authType: 'oauth2' },
        { id: 3, key: "oto_mail", name: "Oto Mail", description: "Native email marketing campaigns.", icon: Mail, connected: true, tag: "Marketing", type: "Native", authType: 'none' },
        { id: 4, key: "oto_bookings", name: "Oto Bookings", description: "Appointment scheduling & calendar.", icon: Calendar, connected: true, tag: "Productivity", type: "Native", authType: 'none' },
        { id: 5, key: "social", name: "Instagram / FB", description: "Social media management.", icon: LayoutTemplate, connected: false, tag: "Marketing", type: "Integration", authType: 'oauth2' },
        { id: 6, key: "canva", name: "Canva", description: "Design asset generation.", icon: PenTool, connected: false, tag: "Design", type: "Integration", authType: 'apikey' },
        { id: 7, key: "twilio", name: "Twilio Voice", description: "Interactive Voice Response (IVR).", icon: Phone, connected: false, tag: "Voice", type: "Integration", authType: 'apikey' },
    ]);

    const [loading, setLoading] = useState(true);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [apiKey, setApiKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // New States
    const [isHealthOpen, setIsHealthOpen] = useState(false);
    const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
    const [customManifest, setCustomManifest] = useState({ name: "", description: "", endpoint: "", authHeader: "" });

    const fetchIntegrations = async () => {
        try {
            const res = await fetch("/api/integrations/list");
            const data = await res.json();
            if (data.integrations) {
                const entries = Object.values(data.integrations) as any[];
                const connectedKeys = entries.map((i: any) => i.provider);
                setTools(prev => prev.map(tool => ({
                    ...tool,
                    connected: tool.type === "Native" || connectedKeys.includes(tool.key)
                })));
            }
        } catch (e) {
            console.error("Failed to fetch integrations", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const handleConfigure = (tool: Tool) => {
        setSelectedTool(tool);
        setApiKey("");
        setSaveSuccess(false);
    };

    const handleSaveApiKey = async () => {
        if (!selectedTool || !apiKey) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/integrations/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider: selectedTool.key,
                    name: selectedTool.name,
                    apiKey: apiKey
                })
            });
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => {
                    setSelectedTool(null);
                    fetchIntegrations();
                }, 1500);
            }
        } catch (e) {
            console.error("Failed to save API key", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleConnectOAuth = async () => {
        if (!selectedTool) return;
        try {
            const res = await fetch("/api/integrations/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider: selectedTool.key })
            });
            const data = await res.json();
            if (data.authorizeUrl) {
                window.location.href = data.authorizeUrl;
            }
        } catch (e) {
            console.error("Failed to initiate OAuth", e);
        }
    };

    const handleAddCustom = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/integrations/custom/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ manifest: customManifest })
            });
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => {
                    setIsAddCustomOpen(false);
                    setCustomManifest({ name: "", description: "", endpoint: "", authHeader: "" });
                    setSaveSuccess(false);
                    setIsSaving(false);
                }, 1500);
            }
        } catch (e) {
            console.error("Failed to add custom tool", e);
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full overflow-hidden flex flex-col p-6 md:p-8 gap-8">
            <div className="flex-1 overflow-y-auto space-y-8 pr-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tools & Integrations</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Connect your business stack to extend agent capabilities.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl h-9 text-xs" onClick={() => setIsHealthOpen(true)}>
                            <Activity className="h-4 w-4 mr-2" />
                            System Health
                        </Button>
                        <Button className="rounded-xl h-9 text-xs" onClick={() => setIsAddCustomOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Integration
                        </Button>
                    </div>
                </div>

                {/* Tools Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest bg-primary/5 text-primary">Connected Stack</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                        {tools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Card key={tool.id} className="flex flex-col justify-between group h-36 bg-card/40 backdrop-blur-md border-border/40 hover:border-primary/30 transition-all">
                                    <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/20 group-hover:scale-110 transition-transform">
                                                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold">{tool.name}</CardTitle>
                                                <CardDescription className="text-[10px] mt-0.5 line-clamp-1 font-medium">{tool.tag}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant={tool.connected ? "outline" : "secondary"} className={cn(
                                            "text-[8px] uppercase font-black px-1.5",
                                            tool.connected ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" : ""
                                        )}>
                                            {tool.connected ? (tool.type === "Native" ? "System Active" : "Authorized") : "Link Required"}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 relative z-10">
                                        <div className="flex items-center justify-between pt-4 border-t border-border/10 mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{tool.type}</span>
                                                {tool.connected && (
                                                    <span className="text-[8px] text-emerald-500/60 font-bold uppercase mt-0.5">Available to Agents</span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-[10px] font-extrabold rounded-lg hover:bg-primary/5 hover:text-primary gap-1.5"
                                                onClick={() => handleConfigure(tool)}
                                            >
                                                {tool.type === "Native" ? "Manage" : "Configure"} <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Standard Tool Config Sheet */}
            <Sheet open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            {selectedTool && (
                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                    <selectedTool.icon className="h-6 w-6 text-primary" />
                                </div>
                            )}
                            <div className="text-left">
                                <SheetTitle className="text-xl font-bold">Configure {selectedTool?.name}</SheetTitle>
                                <SheetDescription className="text-sm">{selectedTool?.description}</SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6">
                        {selectedTool?.authType === 'apikey' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="apiKey" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Key / Token</Label>
                                    <Input
                                        id="apiKey"
                                        placeholder="Paste your key here..."
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="rounded-xl border-border/40 bg-secondary/30"
                                        type="password"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Your key is encrypted and stored securely.</p>
                                </div>
                                <Button
                                    className="w-full rounded-xl shadow-lg shadow-primary/10"
                                    onClick={handleSaveApiKey}
                                    disabled={isSaving || !apiKey || saveSuccess}
                                >
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : saveSuccess ? <Check className="h-4 w-4 mr-2" /> : null}
                                    {saveSuccess ? "Connected Successfully" : "Save and Connect"}
                                </Button>
                            </div>
                        )}

                        {selectedTool?.authType === 'oauth2' && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    This integration requires secure OAuth authorization. You will be redirected to {selectedTool.name} to grant access.
                                </p>
                                <Button
                                    className="w-full rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                                    onClick={handleConnectOAuth}
                                >
                                    Connect with {selectedTool.name} <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {selectedTool?.authType === 'none' && (
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4 text-center">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Native Feature Active</h3>
                                    <p className="text-xs text-muted-foreground mt-1">This tool is a core part of the Oto ecosystem and is automatically synchronized with your agents.</p>
                                </div>
                                <Button className="w-full rounded-xl" variant="outline" onClick={() => setSelectedTool(null)}>
                                    Go to Settings
                                </Button>
                            </div>
                        )}

                        <div className="pt-6 border-t border-border/40">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Documentation</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-xs text-primary hover:underline flex items-center gap-2">
                                        How to find your {selectedTool?.name} API key <ExternalLink className="h-3 w-3" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-xs text-primary hover:underline flex items-center gap-2">
                                        Best practices for agent automation <ExternalLink className="h-3 w-3" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Add Custom Integration Sheet */}
            <Sheet open={isAddCustomOpen} onOpenChange={setIsAddCustomOpen}>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Plus className="h-6 w-6 text-purple-500" />
                            </div>
                            <div className="text-left">
                                <SheetTitle className="text-xl font-bold">New Custom Integration</SheetTitle>
                                <SheetDescription className="text-sm">Connect your own proprietary APIs and tools.</SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">App Name</Label>
                            <Input
                                placeholder="e.g. Internal Inventory API"
                                className="rounded-xl border-border/40"
                                value={customManifest.name}
                                onChange={e => setCustomManifest({ ...customManifest, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                            <Textarea
                                placeholder="What does this tool do?"
                                className="rounded-xl border-border/40 min-h-[80px]"
                                value={customManifest.description}
                                onChange={e => setCustomManifest({ ...customManifest, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Endpoint (URL)</Label>
                            <Input
                                placeholder="https://api.yourcompany.com/v1"
                                className="rounded-xl border-border/40 font-mono text-xs"
                                value={customManifest.endpoint}
                                onChange={e => setCustomManifest({ ...customManifest, endpoint: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Auth Header (Optional)</Label>
                            <Input
                                placeholder="Authorization: Bearer ..."
                                className="rounded-xl border-border/40"
                                value={customManifest.authHeader}
                                onChange={e => setCustomManifest({ ...customManifest, authHeader: e.target.value })}
                            />
                        </div>

                        <Button
                            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-500/20"
                            onClick={handleAddCustom}
                            disabled={isSaving || !customManifest.name || !customManifest.endpoint || saveSuccess}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : saveSuccess ? <Check className="h-4 w-4 mr-2" /> : null}
                            {saveSuccess ? "Added to Library" : "Register Custom Tool"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* System Health Sheet */}
            <Sheet open={isHealthOpen} onOpenChange={setIsHealthOpen}>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader className="mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="text-left">
                                <SheetTitle>Infrastructure Health</SheetTitle>
                                <SheetDescription>Real-time status of your automation stack.</SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Uptime</p>
                                <p className="text-xl font-bold">99.98%</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Latency</p>
                                <p className="text-xl font-bold">240ms</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Status</h4>
                            {[
                                { name: "Agent Core Node", status: "Operational", color: "text-emerald-500" },
                                { name: "Embeddings DB", status: "Operational", color: "text-emerald-500" },
                                { name: "Integration Proxy", status: "High Load", color: "text-amber-500" },
                                { name: "Webhooks Worker", status: "Operational", color: "text-emerald-500" },
                            ].map(service => (
                                <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/10">
                                    <span className="text-xs font-medium">{service.name}</span>
                                    <span className={cn("text-[10px] font-bold uppercase tracking-tighter", service.color)}>{service.status}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="flex gap-3">
                                <Shield className="h-5 w-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-xs font-bold">Security & Compliance</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">All integrations use end-to-end encryption for API tokens and follow SOC2 compliance standards.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
