"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Avatar, AvatarFallback, cn } from "@oto/ui";
import { User, CheckCircle2, AlertCircle, Calendar, ArrowRight, ExternalLink, Mail, Phone, MapPin, Search, ListFilter } from "lucide-react";
import { motion } from "framer-motion";

interface RichToolOutputProps {
    toolName: string;
    output: any;
    className?: string;
}

export function RichToolOutput({ toolName, output, className }: RichToolOutputProps) {
    // Determine the type of output to render
    const isContact = toolName.toLowerCase().includes("contact") || toolName.toLowerCase().includes("user");
    const isInventory = toolName.toLowerCase().includes("inventory") || toolName.toLowerCase().includes("log");
    const isEscalation = toolName.toLowerCase().includes("escalation") || toolName.toLowerCase().includes("forward");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("w-full max-w-md my-2", className)}
        >
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/5">
                <CardHeader className="p-3 bg-muted/30 border-b border-border/20 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{toolName}</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] h-3.5 px-1 font-bold">SUCCESS</Badge>
                </CardHeader>
                <CardContent className="p-4">
                    {isContact && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-primary/20">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                        {output.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="text-sm font-bold">{output.name}</h4>
                                    <p className="text-[10px] text-muted-foreground">{output.title || "Found via Smart Discovery"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 font-bold">
                                    <Mail className="h-3 w-3" /> Email
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 font-bold">
                                    <Phone className="h-3 w-3" /> WhatsApp
                                </Button>
                            </div>
                        </div>
                    )}

                    {isInventory && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                <span>Item</span>
                                <span>Status</span>
                            </div>
                            <div className="space-y-1.5">
                                {(Array.isArray(output) ? output : [output]).slice(0, 3).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/10">
                                        <span className="text-xs font-medium">{item.name || item}</span>
                                        <Badge variant="secondary" className="text-[9px] h-4 px-1">{item.status || "Indexed"}</Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-bold text-primary">
                                View Full Inventory <ArrowRight size={10} className="ml-1" />
                            </Button>
                        </div>
                    )}

                    {!isContact && !isInventory && (
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Search className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-xs leading-relaxed text-foreground/80 italic font-medium">
                                "{typeof output === 'string' ? output : JSON.stringify(output)}"
                            </p>
                        </div>
                    )}

                    {isEscalation && (
                        <div className="mt-4 pt-4 border-t border-border/20 flex gap-2">
                            <Button size="sm" className="flex-1 h-8 text-[10px] font-bold gap-1.5">
                                <CheckCircle2 className="h-3 w-3" /> Approve
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] font-bold gap-1.5">
                                <AlertCircle className="h-3 w-3" /> Reject
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
