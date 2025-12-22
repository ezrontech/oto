"use client";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Badge, Button, cn
} from "@oto/ui";
import {
    Mail, Calendar, MessageCircle, PenTool, LayoutTemplate,
    Phone, Zap, Activity, ExternalLink, Plus
} from "lucide-react";

export default function ToolsPage() {
    const tools = [
        { id: 1, name: "WhatsApp Business", description: "Unified chat & automated responses.", icon: MessageCircle, connected: true, tag: "Essential", type: "Integration" },
        { id: 2, name: "Gmail", description: "Email automation and triage.", icon: Mail, connected: true, tag: "Essential", type: "Integration" },
        { id: 3, name: "Oto Mail", description: "Native email marketing campaigns.", icon: Mail, connected: true, tag: "Marketing", type: "Native" },
        { id: 4, name: "Oto Bookings", description: "Appointment scheduling & calendar.", icon: Calendar, connected: true, tag: "Productivity", type: "Native" },
        { id: 5, name: "Instagram / FB", description: "Social media management.", icon: LayoutTemplate, connected: false, tag: "Marketing", type: "Integration" },
        { id: 6, name: "Canva", description: "Design asset generation.", icon: PenTool, connected: false, tag: "Design", type: "Integration" },
        { id: 7, name: "Twilio Voice", description: "Interactive Voice Response (IVR).", icon: Phone, connected: false, tag: "Voice", type: "Integration" },
    ];

    return (
        <div className="h-full overflow-hidden flex flex-col p-6 md:p-8 gap-8">
            <div className="flex-1 overflow-y-auto space-y-8 pr-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tools & Integrations</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Connect your business stack to extend agent capabilities.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl h-9 text-xs">
                            <Activity className="h-4 w-4 mr-2" />
                            System Health
                        </Button>
                        <Button className="rounded-xl h-9 text-xs">
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
                                    <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
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
                                            {tool.connected ? "Active" : "Link"}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex items-center justify-between pt-4 border-t border-border/10 mt-4">
                                            <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{tool.type}</span>
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-extrabold rounded-lg hover:bg-primary/5 hover:text-primary gap-1.5">
                                                Configure <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
