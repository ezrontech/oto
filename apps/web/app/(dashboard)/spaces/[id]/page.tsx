"use client";

import { use, useState, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    ContactCard
} from "@oto/ui";
import { MOCK_TASKS, MOCK_EVENTS, MOCK_CLIENTS, MOCK_TEAM, MOCK_FEED, MOCK_GOALS, MOCK_CONTENT_PLAN, MOCK_CURRENT_USER } from "../../../../data/mock";
import { CheckSquare, Calendar as CalendarIcon, Users, FileText, Send, Heart, MessageCircle, Share, Home, Repeat, Bookmark, Image as ImageIcon, Video, Link as LinkIcon, MoreHorizontal, Search, Bell, Target, Layout, Rocket, FileIcon, Sparkles } from "lucide-react";
import Link from 'next/link';
import { supabase } from "@/lib/supabase";

export default function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [space, setSpace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        loadSpace();
    }, [id]);

    const loadSpace = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/spaces/${id}`, {
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSpace(data.data);
            }
        } catch (error) {
            console.error("Failed to load space:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user: any) => {
        setSelectedUser({
            ...user,
            contactCard: user.contactCard || {
                visibility: "professional",
                bio: "Active member of " + space?.name,
                title: "Oto Community Member",
                connections: Math.floor(Math.random() * 500)
            },
            settings: user.settings || { receiveMessagesFromAnyone: true }
        });
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!space) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Space not found</h2>
                <Button asChild variant="outline">
                    <Link href="/spaces">Back to Spaces</Link>
                </Button>
            </div>
        );
    }

    const renderContent = () => {
        if (space.type === "Community") {
            return <CommunitySpaceView space={space} onUserClick={handleUserClick} />;
        }
        if (space.type === "Room") {
            return <RoomSpaceView space={space} onUserClick={handleUserClick} />;
        }
        return <TeamSpaceView space={space} />;
    };

    return (
        <>
            {renderContent()}

            <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <SheetContent className="p-0 border-l border-white/10 w-[400px] bg-background/60 backdrop-blur-2xl shadow-2xl">
                    <SheetHeader className="px-6 py-4 border-b border-white/5">
                        <SheetTitle className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" /> Member Profile
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex items-center justify-center p-6 bg-transparent h-full overflow-y-auto">
                        {selectedUser && (
                            <ContactCard
                                user={selectedUser}
                                visibility={selectedUser.contactCard.visibility}
                                isOwnCard={selectedUser.id === MOCK_CURRENT_USER.id}
                                onMessage={() => console.log("Messaging", selectedUser.name)}
                                onConnect={() => console.log("Connecting", selectedUser.name)}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

// --- TEAM SPACE (Internal Collaboration Hub) ---
function TeamSpaceView({ space }: { space: any }) {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <header className="px-8 py-6 border-b flex justify-between items-center bg-background/60 backdrop-blur-md z-10 sticky top-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        {space.name} <span className="text-sm font-normal text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/20">Team</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium flex items-center gap-1.5 mt-1">
                        <Rocket className="h-3.5 w-3.5 text-primary" /> Internal Team Hub • Exclusive Access
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Users className="mr-2 h-4 w-4" /> My Team</Button>
                    <Button size="sm" variant="secondary"><Share className="mr-2 h-4 w-4" /> Link</Button>
                </div>
            </header>

            <div className="flex-1 overflow-hidden relative">
                <Tabs defaultValue="goals" className="h-full flex flex-col">
                    <div className="px-8 pt-4 pb-2 border-b bg-background/40 backdrop-blur-sm sticky top-[89px] z-10">
                        <TabsList className="bg-background/50 border backdrop-blur-md p-1">
                            <TabsTrigger value="goals" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Target className="h-4 w-4" /> Goals</TabsTrigger>
                            <TabsTrigger value="planning" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Layout className="h-4 w-4" /> Planning</TabsTrigger>
                            <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><CheckSquare className="h-4 w-4" /> Tasks</TabsTrigger>
                            <TabsTrigger value="docs" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><FileText className="h-4 w-4" /> Docs</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-muted/10 pb-40">
                        {/* GOALS TAB */}
                        <TabsContent value="goals" className="m-0 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">Objectives & Key Results</h2>
                                    <p className="text-sm text-muted-foreground font-light">Internal team targets for Q4 2025.</p>
                                </div>
                                <Button size="sm"><Target className="mr-2 h-4 w-4" /> New Goal</Button>
                            </div>
                            <div className="grid gap-4">
                                {MOCK_GOALS.map(goal => (
                                    <Card key={goal.id} className="border-none shadow-sm hover:ring-1 ring-primary/20 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <Badge variant="secondary" className="mb-2 uppercase tracking-wider text-[10px]">{goal.category}</Badge>
                                                    <h3 className="font-bold text-lg">{goal.title}</h3>
                                                </div>
                                                <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${goal.progress}%` }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* PLANNING TAB */}
                        <TabsContent value="planning" className="m-0 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">Content & Strategy Planning</h2>
                                    <p className="text-sm text-muted-foreground font-light">Brainstorming and scheduling upcoming releases.</p>
                                </div>
                                <Button size="sm" variant="secondary"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MOCK_CONTENT_PLAN.map(item => (
                                    <Card key={item.id} className="border-none shadow-sm hover:bg-muted/40 cursor-pointer group">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Layout className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                                                <p className="text-xs text-muted-foreground">{item.date} • {item.status}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* TASKS TAB */}
                        <TabsContent value="tasks" className="m-0 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Internal Workflows</h2>
                                <Button size="sm"><CheckSquare className="mr-2 h-4 w-4" /> New Task</Button>
                            </div>
                            <div className="grid gap-4">
                                {MOCK_TASKS.map(task => (
                                    <Card key={task.id} className="border-none shadow-sm">
                                        <CardContent className="flex items-center p-4 gap-4">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CheckSquare className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm">{task.title}</h3>
                                                <p className="text-xs text-muted-foreground">{task.assignee} • Due {task.due}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{task.status}</Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* DOCS TAB */}
                        <TabsContent value="docs" className="m-0 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Internal Documentation</h2>
                                <Button size="sm" variant="outline"><FileIcon className="mr-2 h-4 w-4" /> Upload</Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {["Brand Guidelines", "Q4 Strategy", "API Docs", "Team Handbook"].map((doc, i) => (
                                    <Card key={i} className="border-none shadow-sm hover:border-primary/50 border cursor-pointer group">
                                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs font-bold">{doc}</span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </div>

                    {/* Team Insights Sidebar (Right side, fixed) */}
                    <div className="absolute right-8 bottom-8 w-80 space-y-4 pointer-events-none">
                        <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur pointer-events-auto animate-in slide-in-from-bottom-8 duration-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" /> Oto Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-xs font-bold text-primary mb-1 uppercase tracking-tighter">External Inquiry</p>
                                    <p className="text-[13px] leading-tight text-foreground">
                                        Client <span className="font-bold">Alice Johnson</span> checked on "Q4 Strategy" progress via WhatsApp.
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <Button size="sm" className="h-7 text-[10px] px-3">Share Progress</Button>
                                        <Button size="sm" variant="ghost" className="h-7 text-[10px] px-3 font-semibold">Draft Reply</Button>
                                    </div>
                                </div>
                                <div className="text-[11px] text-muted-foreground italic px-2">
                                    Oto is monitoring [Q4 Strategy] task in this space.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

// --- COMMUNITY SPACE (Threads Style) ---
function CommunitySpaceView({ space, onUserClick }: { space: any, onUserClick: (user: any) => void }) {
    return (
        <div className="h-full flex flex-col bg-background">
            {/* Sticky Header */}
            <header className="px-6 py-4 border-b flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg backdrop-blur-md border border-primary/20">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none">{space.name}</h1>
                        <p className="text-xs text-muted-foreground mt-1">{space.member_count || 0} Members • Public Space</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Search size={18} /></Button>
                    <Button variant="ghost" size="icon"><Bell size={18} /></Button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 p-6">

                    {/* FEED COLUMN */}
                    <div className="space-y-6">

                        <Card className="border-none shadow-sm bg-muted/30">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-primary/20 cursor-pointer" onClick={() => onUserClick(MOCK_CURRENT_USER)} />
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-muted-foreground">Start a thread...</span>
                                        </div>
                                        <textarea
                                            className="w-full bg-transparent outline-none text-foreground text-lg resize-none min-h-[60px]"
                                            placeholder="What's new in the community?"
                                        />
                                        <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                            <div className="flex gap-1 text-primary">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"><ImageIcon size={18} /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"><Video size={18} /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"><LinkIcon size={18} /></Button>
                                            </div>
                                            <Button size="sm" className="rounded-full px-6 font-semibold">Post</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Posts */}
                        <div className="space-y-4">
                            {MOCK_FEED?.map((post: any) => (
                                <Card key={post.id} className="border-none shadow-sm hover:bg-muted/30 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 pt-6">
                                        <div className="flex gap-4">
                                            <div
                                                className={`h-10 w-10 rounded-full ${post.user.avatar} border border-border cursor-pointer hover:border-primary transition-all`}
                                                onClick={(e) => { e.stopPropagation(); onUserClick(post.user); }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground hover:underline cursor-pointer" onClick={(e) => { e.stopPropagation(); onUserClick(post.user); }}>{post.user.name}</span>
                                                        <span className="text-muted-foreground text-sm">{post.user.handle}</span>
                                                        <span className="text-muted-foreground text-xs">• {post.time}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100"><MoreHorizontal size={16} /></Button>
                                                </div>
                                                <p className="text-[15px] leading-relaxed mb-3 text-foreground/90 whitespace-pre-wrap">{post.content}</p>

                                                {/* Media Rendering */}
                                                {post.type === 'image' && post.mediaUrl && (
                                                    <div className="mb-3 rounded-xl overflow-hidden border border-border">
                                                        <img src={post.mediaUrl} alt="Post media" className="w-full h-auto object-cover max-h-[400px]" />
                                                    </div>
                                                )}

                                                <div className="flex gap-6 pt-2">
                                                    <button className="flex items-center gap-2 group/action hover:text-primary text-muted-foreground transition-colors">
                                                        <div className="p-1.5 rounded-full group-hover/action:bg-primary/10"><MessageCircle size={18} /></div>
                                                        <span className="text-xs font-medium">{post.comments}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 group/action hover:text-green-500 text-muted-foreground transition-colors">
                                                        <div className="p-1.5 rounded-full group-hover/action:bg-green-500/10"><Repeat size={18} /></div>
                                                        <span className="text-xs font-medium">{post.shares}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 group/action hover:text-red-500 text-muted-foreground transition-colors">
                                                        <div className="p-1.5 rounded-full group-hover/action:bg-red-500/10"><Heart size={18} /></div>
                                                        <span className="text-xs font-medium">{post.likes}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* COMMUNITY SIDEBAR (Sticky, Right side) */}
                    <div className="hidden lg:block space-y-4 self-start sticky top-6">
                        {/* Trending Topics */}
                        <Card className="shadow-sm border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Trending Topics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {['AI Automation Tips', 'Agency Growth', 'Client Management', 'Workflow Optimization'].map((topic, i) => (
                                    <div key={i} className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                        <p className="text-sm font-semibold text-foreground">#{topic.replace(/\s/g, '')}</p>
                                        <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 50) + 10} posts</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Suggested Connections */}
                        <Card className="shadow-sm border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold">Suggested Connections</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {MOCK_TEAM.slice(0, 3).map(member => (
                                    <div key={member.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onUserClick(member)}>
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border group-hover:border-primary transition-all" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 text-xs">Connect</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- ROOM SPACE (Private Group) ---
function RoomSpaceView({ space, onUserClick }: { space: any, onUserClick: (user: any) => void }) {
    return (
        <div className="h-full flex flex-col p-8 items-center justify-center text-center">
            <div className="h-20 w-20 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 text-orange-600">
                <MessageCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-2">{space.name}</h1>
            <p className="text-muted-foreground max-w-md mb-8">A private room space for groups to organize events, share lists, and chat.</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
                <Card className="hover:border-primary/50 cursor-pointer p-6 flex flex-col items-center gap-4">
                    <CalendarIcon className="h-8 w-8 text-primary" />
                    <span className="font-semibold">Events Calendar</span>
                </Card>
                <Card className="hover:border-primary/50 cursor-pointer p-6 flex flex-col items-center gap-4">
                    <CheckSquare className="h-8 w-8 text-primary" />
                    <span className="font-semibold">Group Lists</span>
                </Card>
            </div>

            <div className="space-y-4 w-full max-w-md text-left">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">Active Members</h3>
                <div className="flex flex-wrap gap-2">
                    {space.space_members?.map((member: any) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-2 bg-muted/30 p-2 rounded-full border border-border/50 cursor-pointer hover:border-primary hover:bg-muted/50 transition-all"
                            onClick={() => onUserClick(member.users)}
                        >
                            <div className="h-6 w-6 rounded-full bg-primary/20" />
                            <span className="text-xs font-medium pr-2">{member.users?.name || member.users?.email || 'Unknown User'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function Plus(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
