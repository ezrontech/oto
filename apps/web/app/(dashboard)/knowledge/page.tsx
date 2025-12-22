"use client";

import { useState } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Badge, Button, Separator, Input, ScrollArea, cn
} from "@oto/ui";
import {
    UploadCloud, FileText, MoreVertical, CheckCircle, Clock,
    Search, Filter, Globe, Database, ShieldCheck, Trash2, ExternalLink
} from "lucide-react";
import { MOCK_FILES } from "../../../data/mock";
import { motion, AnimatePresence } from "framer-motion";

export default function KnowledgePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const filteredFiles = MOCK_FILES.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full overflow-hidden flex flex-col p-6 md:p-8 gap-8">
            <div className="max-w-6xl mx-auto w-full flex-1 overflow-y-auto pr-1 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Database className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Intelligence Asset Management</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                        <p className="text-muted-foreground mt-1 text-sm max-w-lg">
                            Centralized repository for your agent documentation. Agents use these files for context-aware responses and retrieval.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl h-10 px-4 text-xs font-bold border-border/60">
                            <Globe className="h-4 w-4 mr-2" /> Connect URL
                        </Button>
                        <Button className="rounded-xl h-10 px-6 text-xs font-bold shadow-lg shadow-primary/20">
                            <UploadCloud className="h-4 w-4 mr-2" /> Index New File
                        </Button>
                    </div>
                </div>

                {/* Stats & Search */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-muted/30 border-none">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Assets</span>
                            <span className="text-2xl font-black">{MOCK_FILES.length}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-none">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Tokens Indexed</span>
                            <span className="text-2xl font-black">1.2M</span>
                        </CardContent>
                    </Card>
                    <div className="md:col-span-2 relative flex items-center">
                        <Search className="absolute left-4 h-4 w-4 text-muted-foreground/40" />
                        <Input
                            placeholder="Search knowledge by filename, category or content..."
                            className="h-full pl-11 rounded-2xl bg-muted/20 border-border/40 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Drag & Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    className={cn(
                        "relative p-12 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 flex flex-col items-center justify-center text-center group",
                        isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    )}
                >
                    <div className={cn(
                        "h-16 w-16 rounded-3xl bg-muted flex items-center justify-center mb-6 transition-transform duration-500",
                        isDragging ? "scale-110 rotate-12" : "group-hover:scale-105"
                    )}>
                        <UploadCloud className={cn("h-8 w-8 transition-colors", isDragging ? "text-primary" : "text-muted-foreground/40")} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">Drop intelligence files here</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm font-medium">
                        Drag and drop PDF, DOCX, or JSON. Our engine will automatically parse and index them for your agents.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold px-3 py-1">Max 25MB per file</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold px-3 py-1">OCR Enabled</Badge>
                    </div>
                    {isDragging && (
                        <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] flex items-center justify-center">
                            <span className="text-xl font-black text-primary animate-bounce">RELEASE TO INDEX</span>
                        </div>
                    )}
                </div>

                {/* File List */}
                <div className="space-y-4 pb-20">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Indexed Knowledge Sources</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase">
                                <Filter className="h-3 w-3 mr-2" /> Filter
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <AnimatePresence mode="popLayout">
                            {filteredFiles.map((file, idx) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative flex items-center justify-between p-5 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border/50 group-hover:border-primary/20 transition-colors">
                                            <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-sm">{file.name}</p>
                                                <Badge variant="outline" className="text-[8px] h-4 px-1 opacity-60 uppercase font-black">{file.type}</Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-muted-foreground/60 font-medium">{file.size}</span>
                                                <span className="h-1 w-1 rounded-full bg-border" />
                                                <span className="text-[10px] text-muted-foreground/60 font-medium">Category: <span className="text-foreground/60 uppercase">{file.category}</span></span>
                                                <span className="h-1 w-1 rounded-full bg-border" />
                                                <span className="text-[10px] text-muted-foreground/60 font-medium">Indexed {file.lastIndexed}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase overflow-hidden",
                                            file.status === "Indexed" ? "bg-emerald-500/5 text-emerald-500 border border-emerald-500/10" : "bg-amber-500/5 text-amber-500 border border-amber-500/10"
                                        )}>
                                            {file.status === "Indexed" ? (
                                                <CheckCircle className="h-3.5 w-3.5" />
                                            ) : (
                                                <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            )}
                                            {file.status}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-muted-foreground/40">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
