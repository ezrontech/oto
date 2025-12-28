"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input, Textarea, Switch, Label } from "@oto/ui";
import { Plus, Search, Users, Briefcase, Home, Globe, MessageCircle, Lock, Eye, AlertCircle, Link2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useWindowManager } from "@/context/window-manager";
import { canCreateSpace, Plan } from "@/lib/plans";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import dynamic from "next/dynamic";

const SpaceDetailPage = dynamic(() => import('./SpaceDetailPage'), { loading: () => null });

export default function SpacesView() {
    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSpaceType, setNewSpaceType] = useState<"Team" | "Community" | "Room">("Community");
    const [newSpaceName, setNewSpaceName] = useState("");
    const [newSpaceDescription, setNewSpaceDescription] = useState("");
    const [newSpaceVisibility, setNewSpaceVisibility] = useState<"public" | "private">("public");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("All");
    const { user } = useAuth() || {};
    const { openWindow } = useWindowManager();

    const filteredSpaces = spaces.filter(space => {
        const matchesSearch = (space.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (space.description?.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === "All" || space.type === typeFilter;
        return matchesSearch && matchesType;
    });

    useEffect(() => {
        loadSpaces();
    }, []);

    const loadSpaces = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/spaces", {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSpaces(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load spaces:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSpace = async () => {
        if (!newSpaceName.trim()) {
            alert("Please enter a name for the space.");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        const payload = {
            name: newSpaceName,
            type: newSpaceType,
            description: newSpaceDescription || `A new ${newSpaceType.toLowerCase()} space.`,
            visibility: newSpaceVisibility
        };

        console.log("🚀 Creating space with payload:", payload);

        try {
            // Get current session for the access token
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("❌ Session error:", sessionError);
                alert("Authentication error. Please refresh and try again.");
                setIsSubmitting(false);
                return;
            }

            if (!session?.access_token) {
                console.error("❌ No access token found");
                alert("You must be logged in to create a space.");
                setIsSubmitting(false);
                return;
            }

            console.log("✅ Session valid, making API request...");

            const res = await fetch("/api/spaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            console.log("📡 API Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("✅ Space created successfully:", data);

                setIsCreating(false);
                setNewSpaceName("");
                setNewSpaceDescription("");
                setNewSpaceVisibility("public");

                // Reload the spaces list to show the new space
                console.log("🔄 Reloading spaces list and opening new space");
                await loadSpaces();

                // Open the newly created space
                if (data.data?.id) {
                    handleOpenSpace(data.data);
                }
            } else {
                const errorData = await res.json();
                console.error("❌ Server error:", errorData);
                alert(`Failed to create space: ${errorData.message || errorData.details || errorData.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error("❌ Request error:", error);
            alert(`Network error: ${error.message || 'Please check your connection and try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenSpace = (space: any) => {
        openWindow(
            `space-${space.id}`,
            space.name,
            <SpaceDetailPage spaceId={space.id} />
        );
    };

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Spaces</h1>
                        <p className="text-muted-foreground mt-1">Manage your team, community, and room spaces.</p>
                    </div>
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create Space
                    </Button>
                </div>

                {isCreating && (
                    <Card className="border-primary/40 bg-background/60 backdrop-blur-xl sticky top-8 z-30 shadow-2xl animate-in fade-in zoom-in-95 duration-300 border-2">
                        <CardHeader>
                            <CardTitle>Create New Space</CardTitle>
                            <CardDescription>Choose the type and name for your new collaboration area.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {(["Community", "Room", "Team"] as const).map((type) => {
                                    return (
                                        <Button
                                            key={type}
                                            variant={newSpaceType === type ? "default" : "outline"}
                                            className="h-20 flex-col gap-2 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={() => setNewSpaceType(type)}
                                        >
                                            {type === "Team" && <Briefcase size={20} />}
                                            {type === "Community" && <Globe size={20} />}
                                            {type === "Room" && <MessageCircle size={20} />}
                                            {type}
                                        </Button>
                                    );
                                })}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="space-name" className="text-sm font-medium mb-2 block">Space Name</Label>
                                    <Input
                                        id="space-name"
                                        placeholder="Enter a name for your space"
                                        value={newSpaceName}
                                        onChange={(e) => setNewSpaceName(e.target.value)}
                                        className="bg-background/50"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="space-description" className="text-sm font-medium mb-2 block">Description (Optional)</Label>
                                    <Textarea
                                        id="space-description"
                                        placeholder="What is this space about?"
                                        value={newSpaceDescription}
                                        onChange={(e) => setNewSpaceDescription(e.target.value)}
                                        className="bg-background/50 min-h-[80px]"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        {newSpaceVisibility === "public" ? <Eye className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-orange-500" />}
                                        <div>
                                            <Label htmlFor="visibility-toggle" className="font-medium cursor-pointer">
                                                {newSpaceVisibility === "public" ? "Public Space" : "Private Space"}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                {newSpaceVisibility === "public"
                                                    ? "Anyone can discover and join this space"
                                                    : "Only invited members can access this space"}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        id="visibility-toggle"
                                        checked={newSpaceVisibility === "public"}
                                        onCheckedChange={(checked) => setNewSpaceVisibility(checked ? "public" : "private")}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setIsCreating(false)} disabled={isSubmitting} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateSpace} disabled={isSubmitting} className="flex-1 shadow-lg shadow-primary/20">
                                    {isSubmitting ? "Creating..." : "Create Space"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className={`space-y-8 transition-all duration-500 ${isCreating ? "blur-md opacity-40 scale-[0.98] pointer-events-none" : ""}`}>
                    {/* Search & Filter */}
                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search spaces..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {["All", "Team", "Community", "Room"].map(type => (
                            <Button
                                key={type}
                                variant={typeFilter === type ? "outline" : "ghost"}
                                onClick={() => setTypeFilter(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>

                    {/* Spaces Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSpaces.length === 0 && !loading ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                                <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    {searchQuery || typeFilter !== "All" ? "No matches found" : "No spaces yet"}
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    {searchQuery || typeFilter !== "All" ? "Try adjusting your filters" : "Create your first space to collaborate with AI agents"}
                                </p>
                                {!searchQuery && typeFilter === "All" && (
                                    <Button size="lg" onClick={() => setIsCreating(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Space
                                    </Button>
                                )}
                            </div>
                        ) : (
                            filteredSpaces.map((space: any) => {
                                let Icon = Briefcase;
                                if (space.type === "Community") Icon = Globe;
                                if (space.type === "Room" || space.type === "Club") Icon = MessageCircle;

                                const isPublic = space.type === "Community";
                                const isInviteOnly = space.type === "Team" || space.type === "Room";

                                return (
                                    <div
                                        key={space.id}
                                        onClick={() => handleOpenSpace(space)}
                                        className="block group cursor-pointer"
                                    >
                                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group-hover:shadow-lg">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Badge variant={space.type === "Community" ? "secondary" : "outline"}>
                                                            {space.type}
                                                        </Badge>
                                                        <Badge variant="outline" className="px-1 text-[10px] flex gap-1 items-center opacity-60">
                                                            {isPublic ? <Globe size={10} /> : <Lock size={10} />}
                                                            {isPublic ? "Public" : "Invite-only"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardTitle className="mt-4">{space.name}</CardTitle>
                                                <CardDescription className="line-clamp-2">{space.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-auto pt-0">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                                                    <div className="flex items-center gap-1">
                                                        <Users size={14} />
                                                        <span>{space.member_count || 0} Members</span>
                                                    </div>
                                                    <div className="ml-auto font-medium text-xs bg-secondary/50 px-2 py-1 rounded">
                                                        {space.user_id === user?.id ? "Owner" : "Member"}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
