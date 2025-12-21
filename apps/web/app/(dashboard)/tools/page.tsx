"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@oto/ui";
import { Mail, Calendar, MessageCircle, PenTool, LayoutTemplate, Phone } from "lucide-react";

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
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tools & Integrations</h1>
                    <p className="text-muted-foreground mt-1">Native tools and external connections for your agents.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Card key={tool.id} className="flex flex-col justify-between group hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                {tool.name}
                                            </CardTitle>
                                            <CardDescription className="mt-1">{tool.description}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant={tool.type === "Native" ? "default" : "outline"} className="text-[10px]">
                                            {tool.type === "Native" ? "Built-in" : "Integration"}
                                        </Badge>
                                        <Badge variant="secondary" className="text-[10px] font-normal">{tool.tag}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground">
                                            {tool.type === "Native" ? "Open Tool" : "Configure"}
                                        </Button>
                                        <Button variant={tool.connected ? "outline" : "default"} size="sm" disabled={tool.type === "Native"}>
                                            {tool.type === "Native" ? "Installed" : (tool.connected ? "Disconnect" : "Connect")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
