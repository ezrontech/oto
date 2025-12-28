"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator, Input, Textarea } from "@oto/ui";
import { Plus, Search, Filter, Edit, Trash2, Share2, Users, Eye, MessageCircle, Calendar, TrendingUp, Send, FileText, Layout, Bold, Italic, List, Link, Image, Code, Quote, X, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ArticlesPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [mailingLists, setMailingLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"articles" | "mailingLists" | "subscribers" | "analytics">("articles");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = {
                "Authorization": `Bearer ${session?.access_token}`
            };

            // Load articles
            const articlesRes = await fetch("/api/articles", { headers });
            if (articlesRes.ok) {
                const articlesData = await articlesRes.json();
                setArticles(articlesData.data || []);
            }

            // Load mailing lists
            const mailingListsRes = await fetch("/api/mailing-lists", { headers });
            if (mailingListsRes.ok) {
                const mailingListsData = await mailingListsRes.json();
                setMailingLists(mailingListsData.data || []);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
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
                        <h1 className="text-3xl font-bold tracking-tight">Content Hub</h1>
                        <p className="text-muted-foreground mt-1">Manage your articles, mailing lists, and content distribution.</p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Content
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
                    <Button
                        variant={activeTab === "articles" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("articles")}
                    >
                        <FileText className="mr-2 h-4 w-4" /> Articles
                    </Button>
                    <Button
                        variant={activeTab === "mailingLists" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("mailingLists")}
                    >
                        <List className="mr-2 h-4 w-4" /> Mailing Lists
                    </Button>
                    <Button
                        variant={activeTab === "subscribers" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("subscribers")}
                    >
                        <Users className="mr-2 h-4 w-4" /> Subscribers
                    </Button>
                    <Button
                        variant={activeTab === "analytics" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("analytics")}
                    >
                        <TrendingUp className="mr-2 h-4 w-4" /> Analytics
                    </Button>
                </div>

                {/* Content based on active tab */}
                {activeTab === "articles" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </div>

                        {articles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                                <p className="text-muted-foreground mb-6">Start creating content to engage your audience</p>
                                <Button size="lg">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Article
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {articles.map((article: any) => (
                                    <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <Badge variant={article.status === "published" ? "default" : "secondary"}>
                                                    {article.status}
                                                </Badge>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardTitle className="mt-2">{article.title}</CardTitle>
                                            <CardDescription>{article.excerpt}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{article.views || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span>{article.comments || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Share2 className="h-4 w-4" />
                                                    <span>{article.shares || 0}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "mailingLists" && (
                    <div className="space-y-6">
                        {mailingLists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <List className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No mailing lists yet</h3>
                                <p className="text-muted-foreground mb-6">Create lists to organize your audience</p>
                                <Button size="lg">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Mailing List
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mailingLists.map((list: any) => (
                                    <Card key={list.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary">Active</Badge>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <CardTitle>{list.name}</CardTitle>
                                            <CardDescription>{list.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Subscribers:</span>
                                                    <span>{list.subscribers?.[0]?.count || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Created:</span>
                                                    <span>{new Date(list.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "subscribers" && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Users className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Subscriber Management</h3>
                            <p className="text-muted-foreground mb-6">Manage your mailing list subscribers</p>
                            <Button size="lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Import Subscribers
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Content Analytics</h3>
                            <p className="text-muted-foreground mb-6">Track your content performance</p>
                            <Button size="lg">
                                <Plus className="mr-2 h-4 w-4" />
                                View Analytics
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
