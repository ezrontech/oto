"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Textarea, ScrollArea, Avatar, AvatarFallback } from "@oto/ui";
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Video, Smile, MoreVertical, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { hasPermission, SpaceRole } from "@/lib/permissions";

interface CommunitySpaceViewProps {
    spaceId: string;
    spaceName: string;
}

export default function CommunitySpaceView({ spaceId, spaceName }: CommunitySpaceViewProps) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<SpaceRole>('member');
    const [isCreating, setIsCreating] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserRole();
        loadPosts();
        subscribeToPosts();
    }, [spaceId]);

    const loadUserRole = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/roles`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const myRole = data.data?.find((r: any) => r.user_id === user?.id);
                if (myRole) setUserRole(myRole.role);
            }
        } catch (error) {
            console.error("Failed to load role:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/posts`, {
                headers: { "Authorization": `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setPosts(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
        }
    };

    const subscribeToPosts = () => {
        const subscription = supabase
            .channel(`posts:${spaceId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'posts',
                filter: `space_id=eq.${spaceId}`
            }, (payload) => {
                setPosts(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    };

    const handleCreatePost = async () => {
        if (!newPost.content.trim()) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${spaceId}/posts`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    title: newPost.title,
                    content: newPost.content,
                    status: 'published'
                })
            });

            if (res.ok) {
                setNewPost({ title: "", content: "" });
                setIsCreating(false);
                loadPosts();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to create post");
            }
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    const handleReaction = async (postId: string, reaction: string) => {
        // TODO: Implement reaction system
        console.log("React to post:", postId, reaction);
    };

    const canCreatePost = hasPermission(userRole, 'post', 'Community');

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-6">
                <div>
                    <h2 className="font-bold text-lg">{spaceName}</h2>
                    <p className="text-xs text-muted-foreground">Community Space</p>
                </div>
                {canCreatePost && (
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                    </Button>
                )}
            </div>

            {/* Create Post Modal */}
            {isCreating && (
                <div className="p-6 border-b bg-muted/30">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Post title (optional)"
                                value={newPost.title}
                                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <Textarea
                                placeholder="What's on your mind?"
                                value={newPost.content}
                                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                                className="min-h-[120px]"
                            />
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Image
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Video className="h-4 w-4 mr-2" />
                                    Video
                                </Button>
                                <div className="flex-1" />
                                <Button variant="outline" onClick={() => setIsCreating(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreatePost}>
                                    Publish
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Feed */}
            <ScrollArea className="flex-1">
                <div className="max-w-2xl mx-auto p-6 space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No posts yet</p>
                            {canCreatePost && (
                                <Button className="mt-4" onClick={() => setIsCreating(true)}>
                                    Create First Post
                                </Button>
                            )}
                        </div>
                    ) : (
                        posts.map(post => (
                            <Card key={post.id} className="overflow-hidden">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {post.users?.name?.[0] || 'C'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">{post.users?.name || 'Creator'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(post.published_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {post.title && (
                                        <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                                    {/* Reactions */}
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleReaction(post.id, 'like')}
                                        >
                                            <Heart className="h-4 w-4" />
                                            <span className="text-xs">
                                                {Object.keys(post.reactions?.like || {}).length || 0}
                                            </span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <MessageCircle className="h-4 w-4" />
                                            <span className="text-xs">0</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
