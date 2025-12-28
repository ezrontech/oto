import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Badge } from "@oto/ui";
import { Plus, Search, Filter, Calendar, TrendingUp, ChevronRight, FileText, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ArticlesView() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/articles", {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setArticles(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load articles:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-8 bg-background">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
                        <p className="text-muted-foreground mt-1">Knowledge base and updates.</p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Article
                    </Button>
                </div>

                {/* Search */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search articles..." className="pl-9" />
                    </div>
                    <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                </div>

                {/* Featured / List */}
                <div className="grid gap-4">
                    {articles.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl border-dashed">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold">No articles found</h3>
                            <p className="text-sm text-muted-foreground mb-6">Create your first article to share knowledge.</p>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                New Article
                            </Button>
                        </div>
                    ) : (
                        articles.map((article) => (
                            <Card key={article.id} className="group hover:border-primary/50 transition-colors cursor-pointer">
                                <CardContent className="p-6 flex items-start gap-6">
                                    <div className="h-24 w-40 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {article.status === 'published' ? (
                                                <Badge variant="secondary" className="text-xs font-normal">Published</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs font-normal capitalize">{article.status}</Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                                                <Calendar className="h-3 w-3" /> {new Date(article.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                                        <p className="text-muted-foreground line-clamp-2">{article.content?.substring(0, 150)}...</p>
                                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4" /> {article.views || 0} views
                                            </div>
                                            <div className="flex items-center gap-1 text-primary font-medium ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                Read Article <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
