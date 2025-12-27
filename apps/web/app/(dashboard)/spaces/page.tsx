"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input } from "@oto/ui";
import { Plus, Search, Users, Briefcase, Home, Share2, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SpacesPage() {
    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSpaces();
    }, []);

    const loadSpaces = async () => {
        try {
            const res = await fetch("/api/spaces");
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
    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Spaces</h1>
                        <p className="text-muted-foreground mt-1">Manage your team, community, and club spaces.</p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Space
                    </Button>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search spaces..." className="pl-8" />
                    </div>
                    <Button variant="outline">All</Button>
                    <Button variant="ghost">Team</Button>
                    <Button variant="ghost">Community</Button>
                    <Button variant="ghost">Club</Button>
                </div>

                {/* Spaces Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spaces.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No spaces yet</h3>
                            <p className="text-muted-foreground mb-6">Create your first space to collaborate with AI agents</p>
                            <Button size="lg">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Space
                            </Button>
                        </div>
                    ) : (
                        spaces.map((space: any) => {
                            let Icon = Briefcase;
                            if (space.type === "Community") Icon = Globe;
                            if (space.type === "Club") Icon = Home;

                            return (
                                <Link key={space.id} href={`/spaces/${space.id}`}>
                                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                    <Icon size={20} />
                                                </div>
                                                <Badge variant={space.type === "Community" ? "secondary" : "outline"}>
                                                    {space.type}
                                                </Badge>
                                            </div>
                                        <CardTitle className="mt-4">{space.name}</CardTitle>
                                        <CardDescription>{space.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto pt-0">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>{space.members} Members</span>
                                            </div>
                                            <div className="ml-auto font-medium text-xs bg-secondary px-2 py-1 rounded">
                                                {space.role}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                    )}
                </div>
            </div>
        </div>
    );
}
