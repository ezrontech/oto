"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Separator, Input, Textarea } from "@oto/ui";
import { Plus, Search, Filter, Edit, Trash2, Share2, Users, Eye, MessageCircle, Calendar, TrendingUp, Send, FileText, Layout, Bold, Italic, List, Link, Image, Code, Quote, X, Globe } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const mockArticles = [
    {
        id: 1,
        title: "Getting Started with AI Agents",
        content: "A comprehensive guide to building and deploying AI agents...",
        excerpt: "Learn how to create powerful AI agents that can transform your workflow...",
        status: "published",
        views: 12450,
        shares: 234,
        comments: 89,
        publishedAt: "2024-12-20",
        newsletter: "AI Weekly Digest",
        newsletterId: 1,
        tags: ["ai", "automation", "tutorial"],
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
    },
    {
        id: 2,
        title: "Building Scalable Newsletters",
        content: "Best practices for creating and managing newsletters...",
        excerpt: "Discover the strategies top creators use to grow their newsletter...",
        status: "draft",
        views: 0,
        shares: 0,
        comments: 0,
        publishedAt: null,
        newsletter: "Content Creators Hub",
        newsletterId: 2,
        tags: ["newsletter", "growth", "strategy"],
        coverImage: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=400&fit=crop"
    },
    {
        id: 3,
        title: "Community Building Strategies",
        content: "How to build and maintain engaged communities...",
        excerpt: "Essential tips for fostering meaningful connections...",
        status: "published",
        views: 6789,
        shares: 156,
        comments: 67,
        publishedAt: "2024-12-18",
        newsletter: "Community Builders",
        newsletterId: 3,
        tags: ["community", "engagement", "growth"],
        coverImage: "https://images.unsplash.com/photo-1521737604892-d14cc237f11d?w=800&h=400&fit=crop"
    }
];

const mockNewsletters = [
    {
        id: 1,
        name: "AI Weekly Digest",
        description: "Latest AI trends and tools you need to know",
        subscribers: 2450,
        status: "active",
        frequency: "weekly",
        nextSend: "2024-12-27",
        segments: 3,
        automations: 2
    },
    {
        id: 2,
        name: "Content Creators Hub",
        description: "Tips and tricks for content creators",
        subscribers: 892,
        status: "active",
        frequency: "bi-weekly",
        nextSend: "2024-12-28",
        segments: 2,
        automations: 1
    },
    {
        id: 3,
        name: "Community Builders",
        description: "Strategies for building engaged communities",
        subscribers: 1234,
        status: "draft",
        frequency: "monthly",
        nextSend: null,
        segments: 1,
        automations: 0
    }
];

const mockSegments = [
    {
        id: 1,
        name: "Power Users",
        description: "Most engaged subscribers",
        newsletterId: 1,
        subscriberCount: 456,
        criteria: { engagement: ">80%", subscribed: ">30 days" }
    },
    {
        id: 2,
        name: "New Subscribers",
        description: "Joined in the last 7 days",
        newsletterId: 1,
        subscriberCount: 89,
        criteria: { subscribed: "<7 days" }
    },
    {
        id: 3,
        name: "Tech Enthusiasts",
        description: "Interested in AI and tech topics",
        newsletterId: 1,
        subscriberCount: 234,
        criteria: { interests: ["ai", "tech"], engagement: ">60%" }
    },
    {
        id: 4,
        name: "Creators",
        description: "Content creators and writers",
        newsletterId: 2,
        subscriberCount: 167,
        criteria: { profession: "creator", activity: ">5 articles/month" }
    }
];

const mockAutomations = [
    {
        id: 1,
        name: "Welcome Series",
        description: "Send welcome emails to new subscribers",
        newsletterId: 1,
        trigger: "new_subscriber",
        status: "active",
        lastRun: "2024-12-24",
        nextRun: "2024-12-25"
    },
    {
        id: 2,
        name: "Re-engagement Campaign",
        description: "Re-engage inactive subscribers",
        newsletterId: 1,
        trigger: "30_days_inactive",
        status: "active",
        lastRun: "2024-12-20",
        nextRun: "2024-12-27"
    },
    {
        id: 3,
        name: "Content Promotion",
        description: "Promote latest articles to engaged readers",
        newsletterId: 2,
        trigger: "new_article",
        status: "draft",
        lastRun: null,
        nextRun: null
    }
];

const mockSubscribers = [
    {
        id: 1,
        email: "sarah@example.com",
        name: "Sarah Johnson",
        status: "active",
        subscribedAt: "2024-11-15",
        engagement: 85,
        newsletters: [1, 2],
        segments: [1, 3],
        location: "New York, USA",
        interests: ["ai", "automation", "productivity"]
    },
    {
        id: 2,
        email: "mike@example.com",
        name: "Mike Chen",
        status: "active",
        subscribedAt: "2024-12-01",
        engagement: 92,
        newsletters: [1],
        segments: [1, 2],
        location: "San Francisco, USA",
        interests: ["tech", "startups"]
    },
    {
        id: 3,
        email: "emma@example.com",
        name: "Emma Wilson",
        status: "inactive",
        subscribedAt: "2024-10-20",
        engagement: 23,
        newsletters: [2],
        segments: [4],
        location: "London, UK",
        interests: ["content", "writing", "creativity"]
    },
    {
        id: 4,
        email: "alex@example.com",
        name: "Alex Rivera",
        status: "active",
        subscribedAt: "2024-12-20",
        engagement: 78,
        newsletters: [1, 2, 3],
        segments: [2],
        location: "Toronto, Canada",
        interests: ["community", "engagement", "growth"]
    },
    {
        id: 5,
        email: "lisa@example.com",
        name: "Lisa Wang",
        status: "active",
        subscribedAt: "2024-11-28",
        engagement: 88,
        newsletters: [1, 3],
        segments: [1, 3],
        location: "Singapore",
        interests: ["ai", "ml", "data"]
    }
];

const mockAnalytics = {
    overview: {
        totalSubscribers: 4576,
        totalNewsletters: 3,
        totalArticles: 12,
        avgOpenRate: 68.5,
        avgClickRate: 12.3,
        totalRevenue: 12450
    },
    growth: [
        { date: "2024-11-01", subscribers: 4100 },
        { date: "2024-11-08", subscribers: 4200 },
        { date: "2024-11-15", subscribers: 4350 },
        { date: "2024-11-22", subscribers: 4400 },
        { date: "2024-11-29", subscribers: 4500 },
        { date: "2024-12-06", subscribers: 4520 },
        { date: "2024-12-13", subscribers: 4550 },
        { date: "2024-12-20", subscribers: 4576 }
    ],
    engagement: [
        { date: "2024-12-01", opens: 2847, clicks: 421 },
        { date: "2024-12-08", opens: 2989, clicks: 456 },
        { date: "2024-12-15", opens: 3124, clicks: 489 },
        { date: "2024-12-22", opens: 3234, clicks: 512 }
    ],
    topContent: [
        { title: "Getting Started with AI Agents", views: 12450, shares: 234, comments: 89 },
        { title: "Building Scalable Newsletters", views: 8932, shares: 156, comments: 67 },
        { title: "Community Building Strategies", views: 6789, shares: 89, comments: 45 }
    ],
    demographics: {
        locations: [
            { country: "United States", percentage: 45 },
            { country: "United Kingdom", percentage: 15 },
            { country: "Canada", percentage: 12 },
            { country: "Singapore", percentage: 8 },
            { country: "Other", percentage: 20 }
        ],
        interests: [
            { interest: "AI", percentage: 68 },
            { interest: "Tech", percentage: 54 },
            { interest: "Content Creation", percentage: 42 },
            { interest: "Community", percentage: 38 },
            { interest: "Automation", percentage: 35 }
        ]
    }
};

export default function ArticlesPage() {
    const [activeTab, setActiveTab] = useState<"articles" | "newsletters" | "subscribers" | "analytics">("articles");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreatingNewsletter, setIsCreatingNewsletter] = useState(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState<typeof mockNewsletters[0] | null>(null);
    const [createFlowStep, setCreateFlowStep] = useState<"newsletter" | "article">("newsletter");
    const [articleCoverImage, setArticleCoverImage] = useState<string | null>(null);
    const [articleTitle, setArticleTitle] = useState("");
    const [articleExcerpt, setArticleExcerpt] = useState("");
    const [articleContent, setArticleContent] = useState("");

    return (
        <div className="h-full overflow-y-auto bg-background/50">
            <div className="max-w-7xl mx-auto p-8 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row gap-6 items-start justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Articles</h1>
                        <p className="text-muted-foreground text-lg mt-2">Create, manage, and share your content as newsletters</p>
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Article
                    </Button>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex gap-1 p-1 bg-muted/30 rounded-lg w-fit">
                        {[
                            { id: "articles", label: "Articles", icon: FileText },
                            { id: "newsletters", label: "Newsletters", icon: Send },
                            { id: "subscribers", label: "Subscribers", icon: Users },
                            { id: "analytics", label: "Analytics", icon: TrendingUp }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "bg-background shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </motion.div>

                {/* Articles Tab */}
                {activeTab === "articles" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4">
                            {mockArticles.map(article => (
                                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Cover Image */}
                                        <div className="lg:w-64 h-48 lg:h-auto relative overflow-hidden">
                                            <img 
                                                src={article.coverImage} 
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Badge variant={article.status === "published" ? "default" : "secondary"}>
                                                    {article.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                                    <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <Send className="h-3 w-3" />
                                                            {article.newsletter}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {article.views.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="h-3 w-3" />
                                                        {article.comments}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Share2 className="h-3 w-3" />
                                                        {article.shares}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {article.tags.map(tag => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Newsletters Tab */}
                {activeTab === "newsletters" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Newsletters</h2>
                            <Button onClick={() => setIsCreatingNewsletter(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Newsletter
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {mockNewsletters.map(newsletter => (
                                <Card key={newsletter.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{newsletter.name}</CardTitle>
                                                <CardDescription>{newsletter.description}</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">Edit</Button>
                                                <Button variant="outline" size="sm">Share Link</Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                                            <div>
                                                <p className="text-muted-foreground">Subscribers</p>
                                                <p className="font-bold text-lg">{newsletter.subscribers.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Status</p>
                                                <Badge variant={newsletter.status === "active" ? "default" : "secondary"}>
                                                    {newsletter.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Frequency</p>
                                                <p className="font-bold">{newsletter.frequency}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Segments</p>
                                                <p className="font-bold">{newsletter.segments}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Automations</p>
                                                <p className="font-bold">{newsletter.automations}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">View Segments</Button>
                                            <Button variant="outline" size="sm">Manage Automations</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Segments Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4">Subscriber Segments</h3>
                            <div className="grid gap-3">
                                {mockSegments.map(segment => (
                                    <Card key={segment.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold">{segment.name}</h4>
                                                <p className="text-sm text-muted-foreground">{segment.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span>{segment.subscriberCount} subscribers</span>
                                                    <span>Newsletter: {mockNewsletters.find(n => n.id === segment.newsletterId)?.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">Edit</Button>
                                                <Button variant="outline" size="sm">View Subscribers</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Automations Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4">Newsletter Automations</h3>
                            <div className="grid gap-3">
                                {mockAutomations.map(automation => (
                                    <Card key={automation.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold">{automation.name}</h4>
                                                <p className="text-sm text-muted-foreground">{automation.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span>Trigger: {automation.trigger}</span>
                                                    <span>Status: {automation.status}</span>
                                                    {automation.lastRun && <span>Last run: {automation.lastRun}</span>}
                                                    {automation.nextRun && <span>Next run: {automation.nextRun}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant={automation.status === "active" ? "default" : "secondary"}>
                                                    {automation.status}
                                                </Badge>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Subscribers Tab */}
                {activeTab === "subscribers" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Subscribers</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Import Subscribers</Button>
                                <Button variant="outline" size="sm">Export</Button>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {mockSubscribers.map(subscriber => (
                                <Card key={subscriber.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {subscriber.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">{subscriber.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        {subscriber.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Joined {subscriber.subscribedAt}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="h-3 w-3" />
                                                        {subscriber.engagement}% engagement
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>
                                                        {subscriber.status}
                                                    </Badge>
                                                    <div className="flex gap-1">
                                                        {subscriber.interests.slice(0, 3).map(interest => (
                                                            <Badge key={interest} variant="outline" className="text-xs">
                                                                {interest}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">Newsletters:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {subscriber.newsletters.map(newsletterId => {
                                                            const newsletter = mockNewsletters.find(n => n.id === newsletterId);
                                                            return newsletter ? (
                                                                <Badge key={newsletterId} variant="secondary" className="text-xs">
                                                                    <Send className="h-2 w-2 mr-1" />
                                                                    {newsletter.name}
                                                                </Badge>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">Edit</Button>
                                                <Button variant="outline" size="sm">View Activity</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold">Analytics</h2>
                        
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <Card>
                                <CardContent className="pt-4 pb-2 text-center">
                                    <div className="text-2xl font-bold text-primary">{mockAnalytics.overview.totalSubscribers.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">Total Subscribers</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4 pb-2 text-center">
                                    <div className="text-2xl font-bold text-green-500">{mockAnalytics.overview.totalNewsletters}</div>
                                    <p className="text-xs text-muted-foreground">Newsletters</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4 pb-2 text-center">
                                    <div className="text-2xl font-bold text-blue-500">{mockAnalytics.overview.totalArticles}</div>
                                    <p className="text-xs text-muted-foreground">Articles</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4 pb-2 text-center">
                                    <div className="text-2xl font-bold text-orange-500">{mockAnalytics.overview.avgOpenRate}%</div>
                                    <p className="text-xs text-muted-foreground">Avg Open Rate</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4 pb-2 text-center">
                                    <div className="text-2xl font-bold text-purple-500">{mockAnalytics.overview.avgClickRate}%</div>
                                    <p className="text-xs text-muted-foreground">Avg Click Rate</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4 pb-2 text-center">
                                    <div className="text-2xl font-bold text-red-500">${mockAnalytics.overview.totalRevenue.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Growth Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscriber Growth</CardTitle>
                                <CardDescription>Your subscriber growth over the last 8 weeks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                                    <p className="text-muted-foreground">Chart visualization would go here</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engagement & Demographics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Engagement Trends</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockAnalytics.engagement.map((data, index) => (
                                            <div key={data.date} className="flex items-center justify-between">
                                                <span className="text-sm">{data.date}</span>
                                                <div className="flex gap-4 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {data.opens} opens
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="h-3 w-3" />
                                                        {data.clicks} clicks
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Content</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockAnalytics.topContent.map((content, index) => (
                                            <div key={content.title} className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{content.title}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            {content.views.toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Share2 className="h-3 w-3" />
                                                            {content.shares}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="h-3 w-3" />
                                                            {content.comments}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Demographics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscriber Demographics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-3">Top Locations</h4>
                                        <div className="space-y-2">
                                            {mockAnalytics.demographics.locations.map(location => (
                                                <div key={location.country} className="flex items-center justify-between">
                                                    <span className="text-sm">{location.country}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-muted rounded-full h-2">
                                                            <div 
                                                                className="bg-primary h-2 rounded-full" 
                                                                style={{ width: `${location.percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">{location.percentage}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-3">Top Interests</h4>
                                        <div className="space-y-2">
                                            {mockAnalytics.demographics.interests.map(interest => (
                                                <div key={interest.interest} className="flex items-center justify-between">
                                                    <span className="text-sm">{interest.interest}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-muted rounded-full h-2">
                                                            <div 
                                                                className="bg-green-500 h-2 rounded-full" 
                                                                style={{ width: `${interest.percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">{interest.percentage}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsCreating(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Create Article</h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
                                <div className="space-y-6">
                                    {/* Newsletter Selection */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Choose Newsletter or Create New</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {mockNewsletters.map(newsletter => (
                                                <button
                                                    key={newsletter.id}
                                                    onClick={() => setSelectedNewsletter(newsletter)}
                                                    className={`p-3 rounded-lg border text-left transition-colors ${
                                                        selectedNewsletter?.id === newsletter.id
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                    }`}
                                                >
                                                    <div className="font-bold">{newsletter.name}</div>
                                                    <div className="text-xs text-muted-foreground">{newsletter.subscribers} subscribers</div>
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setIsCreatingNewsletter(true)}
                                                className="p-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                                            >
                                                <div className="font-bold text-primary">+ Create New Newsletter</div>
                                                <div className="text-xs text-muted-foreground">Set up a new newsletter</div>
                                            </button>
                                        </div>
                                    </div>

                                    {selectedNewsletter && (
                                        <>
                                            {/* Cover Image Upload */}
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Cover Image</label>
                                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                                    {articleCoverImage ? (
                                                        <div className="space-y-4">
                                                            <img 
                                                                src={articleCoverImage} 
                                                                alt="Cover preview" 
                                                                className="w-full h-48 object-cover rounded-lg"
                                                            />
                                                            <Button 
                                                                variant="outline" 
                                                                onClick={() => setArticleCoverImage(null)}
                                                                className="text-sm"
                                                            >
                                                                Remove Cover
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <Image className="h-12 w-12 text-muted-foreground mx-auto" />
                                                            <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                                                            <p className="text-xs text-muted-foreground">Recommended: 800x400px</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Article Title</label>
                                                <Input 
                                                    placeholder="Enter article title" 
                                                    value={articleTitle}
                                                    onChange={(e) => setArticleTitle(e.target.value)}
                                                    className="text-lg font-bold" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Short Description</label>
                                                <Input 
                                                    placeholder="Brief description for newsletter preview" 
                                                    value={articleExcerpt}
                                                    onChange={(e) => setArticleExcerpt(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Content</label>
                                                <Textarea 
                                                    placeholder="Write your article content..." 
                                                    value={articleContent}
                                                    onChange={(e) => setArticleContent(e.target.value)}
                                                    className="min-h-[400px]" 
                                                />
                                            </div>
                                            {/* Notion-like toolbar */}
                                            <div className="flex items-center gap-2 p-2 border rounded-lg">
                                                <Button variant="ghost" size="sm"><Bold className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm"><Italic className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm"><List className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm"><Link className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm"><Image className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm"><Code className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm"><Quote className="h-4 w-4" /></Button>
                                                <Separator orientation="vertical" className="h-6" />
                                                <Button variant="ghost" size="sm"><Layout className="h-4 w-4" /></Button>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-muted-foreground">
                                                    Publishing to: <span className="font-bold">{selectedNewsletter.name}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline">Save Draft</Button>
                                                    <Button>Publish</Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Create Newsletter Modal */}
                {isCreatingNewsletter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsCreatingNewsletter(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-background rounded-xl shadow-2xl max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Create Newsletter</h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsCreatingNewsletter(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Newsletter Name</label>
                                    <Input placeholder="Enter newsletter name" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Description</label>
                                    <Textarea placeholder="Describe your newsletter" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Frequency</label>
                                    <select className="w-full px-3 py-2 border rounded-md">
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="bi-weekly">Bi-weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsCreatingNewsletter(false)}>Cancel</Button>
                                    <Button onClick={() => {
                                        // Create newsletter logic here
                                        setIsCreatingNewsletter(false);
                                        setSelectedNewsletter({
                                            id: 4,
                                            name: "New Newsletter",
                                            description: "",
                                            subscribers: 0,
                                            status: "draft",
                                            frequency: "weekly",
                                            nextSend: null,
                                            segments: 0,
                                            automations: 0
                                        });
                                    }}>Create Newsletter</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
