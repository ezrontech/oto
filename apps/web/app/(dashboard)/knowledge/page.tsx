"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Separator } from "@oto/ui";
import { UploadCloud, FileText, MoreVertical, CheckCircle, Clock } from "lucide-react";
import { MOCK_FILES } from "../../../data/mock";

export default function KnowledgePage() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
                    <p className="text-muted-foreground mt-1">Files utilized by your agent team.</p>
                </div>
                <Button>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
                </Button>
            </div>

            <Separator />

            <div className="space-y-4">
                {MOCK_FILES.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size} • PDF Document</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                                {file.status === "Indexed" ? (
                                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                ) : (
                                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                                )}
                                {file.status}
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="p-8 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <UploadCloud className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold">Drop files here</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        Upload PDF, DOCX, or TXT files to expand your agent's knowledge.
                    </p>
                </div>
            </div>
        </div>
    );
}
