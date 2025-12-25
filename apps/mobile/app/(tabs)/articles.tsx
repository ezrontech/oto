import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { FileText, Plus, Search, Filter, Edit, Trash2, Share2, Users, Eye, MessageCircle, Send, TrendingUp, Calendar, Globe, X } from "lucide-react-native";
import { Badge } from "@/components/Badge";

// Mock data
const mockArticles = [
    {
        id: 1,
        title: "Getting Started with AI Agents",
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
    }
];

export default function ArticlesPage() {
    const [activeTab, setActiveTab] = useState<"articles" | "newsletters" | "subscribers" | "analytics">("articles");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState(null);

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="p-4 border-b border-border">
                <Text className="text-3xl font-bold">Articles</Text>
                <Text className="text-muted-foreground mt-1">Create, manage, and share your content</Text>
                <TouchableOpacity 
                    onPress={() => setIsCreating(true)}
                    className="mt-4 bg-primary rounded-lg p-3 flex-row items-center justify-center"
                >
                    <Plus size={20} color="white" />
                    <Text className="text-primary-foreground ml-2 font-medium">Create Article</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="flex-row p-1 bg-muted/30 mx-4 mt-4 rounded-lg">
                {[
                    { id: "articles", label: "Articles", icon: FileText },
                    { id: "newsletters", label: "Newsletters", icon: Send },
                    { id: "subscribers", label: "Subscribers", icon: Users },
                    { id: "analytics", label: "Analytics", icon: TrendingUp }
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex-row items-center justify-center py-2 rounded-md ${
                            activeTab === tab.id ? "bg-background shadow-sm" : ""
                        }`}
                    >
                        <tab.icon size={16} color={activeTab === tab.id ? "#000" : "#666"} />
                        <Text className={`ml-2 text-sm font-medium ${
                            activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
                        }`}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Search */}
            <View className="px-4 mt-4">
                <View className="flex-row items-center bg-muted/30 rounded-lg px-3 py-2">
                    <Search size={20} color="#666" />
                    <Text className="ml-2 text-muted-foreground">Search articles...</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-4 mt-4">
                {activeTab === "articles" && (
                    <View className="space-y-4">
                        {mockArticles.map(article => (
                            <View key={article.id} className="bg-card rounded-lg overflow-hidden border border-border">
                                {/* Cover Image */}
                                <View className="h-48 relative">
                                    <Image 
                                        source={{ uri: article.coverImage }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    <View className="absolute top-2 right-2">
                                        <Badge variant={article.status === "published" ? "default" : "secondary"}>
                                            {article.status}
                                        </Badge>
                                    </View>
                                </View>
                                
                                {/* Content */}
                                <View className="p-4">
                                    <Text className="text-lg font-bold mb-2">{article.title}</Text>
                                    <Text className="text-sm text-muted-foreground mb-3">{article.excerpt}</Text>
                                    
                                    <View className="flex-row items-center gap-2 mb-3">
                                        <Send size={14} color="#666" />
                                        <Text className="text-xs text-muted-foreground">{article.newsletter}</Text>
                                    </View>
                                    
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row gap-4">
                                            <View className="flex-row items-center gap-1">
                                                <Eye size={14} color="#666" />
                                                <Text className="text-xs text-muted-foreground">{article.views.toLocaleString()}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <MessageCircle size={14} color="#666" />
                                                <Text className="text-xs text-muted-foreground">{article.comments}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <Share2 size={14} color="#666" />
                                                <Text className="text-xs text-muted-foreground">{article.shares}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    
                                    <View className="flex-row flex-wrap gap-2">
                                        {article.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === "newsletters" && (
                    <View className="space-y-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Newsletters</Text>
                            <TouchableOpacity className="bg-primary rounded-lg px-3 py-1">
                                <Text className="text-primary-foreground text-sm font-medium">Create</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {mockNewsletters.map(newsletter => (
                            <View key={newsletter.id} className="bg-card rounded-lg p-4 border border-border">
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold">{newsletter.name}</Text>
                                        <Text className="text-sm text-muted-foreground">{newsletter.description}</Text>
                                    </View>
                                    <Badge variant={newsletter.status === "active" ? "default" : "secondary"}>
                                        {newsletter.status}
                                    </Badge>
                                </View>
                                
                                <View className="grid grid-cols-2 gap-4 mb-3">
                                    <View>
                                        <Text className="text-xs text-muted-foreground">Subscribers</Text>
                                        <Text className="text-lg font-bold">{newsletter.subscribers.toLocaleString()}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-muted-foreground">Frequency</Text>
                                        <Text className="font-bold">{newsletter.frequency}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-muted-foreground">Segments</Text>
                                        <Text className="font-bold">{newsletter.segments}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-muted-foreground">Automations</Text>
                                        <Text className="font-bold">{newsletter.automations}</Text>
                                    </View>
                                </View>
                                
                                <View className="flex-row gap-2">
                                    <TouchableOpacity className="border border-border rounded px-3 py-1">
                                        <Text className="text-sm">View Segments</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="border border-border rounded px-3 py-1">
                                        <Text className="text-sm">Manage</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === "subscribers" && (
                    <View className="space-y-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Subscribers</Text>
                            <View className="flex-row gap-2">
                                <TouchableOpacity className="border border-border rounded px-3 py-1">
                                    <Text className="text-sm">Import</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="border border-border rounded px-3 py-1">
                                    <Text className="text-sm">Export</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {mockSubscribers.map(subscriber => (
                            <View key={subscriber.id} className="bg-card rounded-lg p-4 border border-border">
                                <View className="flex-row items-start gap-3 mb-3">
                                    <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                                        <Text className="text-primary font-bold">
                                            {subscriber.name.split(' ').map(n => n[0]).join('')}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold">{subscriber.name}</Text>
                                        <Text className="text-sm text-muted-foreground">{subscriber.email}</Text>
                                    </View>
                                    <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>
                                        {subscriber.status}
                                    </Badge>
                                </View>
                                
                                <View className="flex-row flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                                    <View className="flex-row items-center gap-1">
                                        <Globe size={14} color="#666" />
                                        <Text>{subscriber.location}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        <Calendar size={14} color="#666" />
                                        <Text>Joined {subscriber.subscribedAt}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        <TrendingUp size={14} color="#666" />
                                        <Text>{subscriber.engagement}% engagement</Text>
                                    </View>
                                </View>
                                
                                <View className="mb-3">
                                    <Text className="text-xs font-medium text-muted-foreground mb-1">Newsletters:</Text>
                                    <View className="flex-row flex-wrap gap-1">
                                        {subscriber.newsletters.map(newsletterId => {
                                            const newsletter = mockNewsletters.find(n => n.id === newsletterId);
                                            return newsletter ? (
                                                <Badge key={newsletterId} variant="secondary" className="text-xs">
                                                    <Send size={10} />
                                                    <Text className="ml-1">{newsletter.name}</Text>
                                                </Badge>
                                            ) : null;
                                        })}
                                    </View>
                                </View>
                                
                                <View className="flex-row gap-2">
                                    <TouchableOpacity className="border border-border rounded px-3 py-1">
                                        <Text className="text-sm">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="border border-border rounded px-3 py-1">
                                        <Text className="text-sm">Activity</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === "analytics" && (
                    <View className="space-y-4">
                        <Text className="text-xl font-bold mb-4">Analytics</Text>
                        
                        {/* Overview Cards */}
                        <View className="grid grid-cols-2 gap-3">
                            <View className="bg-card rounded-lg p-4 border border-border items-center">
                                <Text className="text-2xl font-bold text-primary">4,576</Text>
                                <Text className="text-xs text-muted-foreground">Total Subscribers</Text>
                            </View>
                            <View className="bg-card rounded-lg p-4 border border-border items-center">
                                <Text className="text-2xl font-bold text-green-500">3</Text>
                                <Text className="text-xs text-muted-foreground">Newsletters</Text>
                            </View>
                            <View className="bg-card rounded-lg p-4 border border-border items-center">
                                <Text className="text-2xl font-bold text-blue-500">12</Text>
                                <Text className="text-xs text-muted-foreground">Articles</Text>
                            </View>
                            <View className="bg-card rounded-lg p-4 border border-border items-center">
                                <Text className="text-2xl font-bold text-orange-500">68.5%</Text>
                                <Text className="text-xs text-muted-foreground">Avg Open Rate</Text>
                            </View>
                        </View>
                        
                        {/* Top Content */}
                        <View className="bg-card rounded-lg p-4 border border-border">
                            <Text className="font-bold mb-3">Top Content</Text>
                            <View className="space-y-3">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-sm flex-1">Getting Started with AI Agents</Text>
                                    <Text className="text-xs text-muted-foreground">12.4k views</Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-sm flex-1">Building Scalable Newsletters</Text>
                                    <Text className="text-xs text-muted-foreground">8.9k views</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Create Article Modal */}
            {isCreating && (
                <View className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                    <View className="bg-background rounded-xl p-6 max-w-2xl w-full max-h-[90vh]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Create Article</Text>
                            <TouchableOpacity onPress={() => setIsCreating(false)}>
                                <X size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView className="flex-1">
                            <View className="space-y-4">
                                {/* Newsletter Selection */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">Choose Newsletter</Text>
                                    <View className="space-y-2">
                                        {mockNewsletters.map(newsletter => (
                                            <TouchableOpacity
                                                key={newsletter.id}
                                                onPress={() => setSelectedNewsletter(newsletter)}
                                                className={`p-3 rounded-lg border ${
                                                    selectedNewsletter?.id === newsletter.id
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border"
                                                }`}
                                            >
                                                <Text className="font-bold">{newsletter.name}</Text>
                                                <Text className="text-xs text-muted-foreground">{newsletter.subscribers} subscribers</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                
                                {selectedNewsletter && (
                                    <>
                                        <View>
                                            <Text className="text-sm font-medium mb-2">Article Title</Text>
                                            <View className="border border-border rounded-lg px-3 py-2">
                                                <Text className="text-muted-foreground">Enter article title</Text>
                                            </View>
                                        </View>
                                        
                                        <View>
                                            <Text className="text-sm font-medium mb-2">Short Description</Text>
                                            <View className="border border-border rounded-lg px-3 py-2 h-20">
                                                <Text className="text-muted-foreground">Brief description for newsletter preview</Text>
                                            </View>
                                        </View>
                                        
                                        <View>
                                            <Text className="text-sm font-medium mb-2">Cover Image</Text>
                                            <View className="border-2 border-dashed border-border rounded-lg p-8 items-center">
                                                <Image size={40} color="#666" />
                                                <Text className="text-sm text-muted-foreground mt-2">Tap to upload cover image</Text>
                                                <Text className="text-xs text-muted-foreground">Recommended: 800x400px</Text>
                                            </View>
                                        </View>
                                        
                                        <View className="flex-row gap-2 pt-4">
                                            <TouchableOpacity className="flex-1 border border-border rounded-lg py-2">
                                                <Text className="text-center">Save Draft</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="flex-1 bg-primary rounded-lg py-2">
                                                <Text className="text-center text-primary-foreground">Publish</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
}
