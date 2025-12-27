"use client";

import { useState, useEffect } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Badge, Button, Separator, Input, ScrollArea, cn
} from "@oto/ui";
import {
    UploadCloud, FileText, MoreVertical, CheckCircle, Clock,
    Search, Filter, Globe, Database, ShieldCheck, Trash2, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeFile {
    id: string;
    name: string;
    type: string;
    size: number;
    status: 'processing' | 'indexed' | 'error';
    uploadedAt: Date;
    description?: string;
    tags?: string[];
}

export default function KnowledgePage() {
    const [files, setFiles] = useState<KnowledgeFile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const res = await fetch("/api/knowledge");
            if (res.ok) {
                const data = await res.json();
                setFiles(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load knowledge files:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileUpload = async (uploadedFiles: FileList) => {
        const formData = new FormData();
        Array.from(uploadedFiles).forEach(file => {
            formData.append('files', file);
        });

        try {
            const res = await fetch('/api/knowledge/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                loadFiles();
            }
        } catch (error) {
            console.error('Failed to upload files:', error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                        <p className="text-muted-foreground mt-1">Upload and manage your documents for AI-powered search.</p>
                    </div>
                    <Button>
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </div>

                {/* Upload Area */}
                <Card
                    className={cn(
                        "border-2 border-dashed transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    )}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files) {
                            handleFileUpload(e.dataTransfer.files);
                        }
                    }}
                >
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                        <p className="text-muted-foreground mb-4">
                            Drag and drop files here, or click to browse
                        </p>
                        <Button variant="outline">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Choose Files
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                            Supports PDF, DOC, DOCX, TXT, MD files up to 10MB
                        </p>
                    </CardContent>
                </Card>

                {/* Files List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Documents</h2>
                        <Badge variant="secondary">{filteredFiles.length} files</Badge>
                    </div>

                    {filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Database className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
                            <p className="text-muted-foreground mb-6">Upload your first documents to build your knowledge base</p>
                            <Button size="lg">
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Upload Documents
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredFiles.map((file) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{file.name}</h4>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span>{file.type}</span>
                                                            <span>•</span>
                                                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                            <span>•</span>
                                                            <span>{file.uploadedAt.toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={
                                                        file.status === 'indexed' ? 'default' :
                                                        file.status === 'processing' ? 'secondary' : 'destructive'
                                                    }>
                                                        {file.status === 'indexed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                        {file.status === 'processing' && <Clock className="h-3 w-3 mr-1" />}
                                                        {file.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {file.description && (
                                                <p className="text-sm text-muted-foreground mt-2">{file.description}</p>
                                            )}
                                            {file.tags && file.tags.length > 0 && (
                                                <div className="flex gap-1 mt-2">
                                                    {file.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
