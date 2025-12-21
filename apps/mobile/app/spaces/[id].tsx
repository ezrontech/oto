import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MOCK_SPACES, MOCK_TASKS, MOCK_FEED, MOCK_GOALS, MOCK_CONTENT_PLAN, MOCK_CURRENT_USER } from '../../data/mock';
import {
    Users, Briefcase, Globe, Home, ChevronRight, Target, Layout, CheckSquare,
    FileText, Rocket, Sparkles, MessageSquare, Heart, Bookmark, Repeat, Share2,
    Calendar, MoreHorizontal, Search, Bell, Plus, Image as ImageIcon, Video, Link as LinkIcon
} from 'lucide-react-native';
import { useState } from 'react';

export default function SpaceDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const space = MOCK_SPACES.find(s => s.id === id) || MOCK_SPACES[0];

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                title: space.name,
                headerRight: () => (
                    <View className="flex-row gap-3 mr-2">
                        <TouchableOpacity><Search size={20} color="#666" /></TouchableOpacity>
                        <TouchableOpacity><Bell size={20} color="#666" /></TouchableOpacity>
                    </View>
                )
            }} />

            {space.type === "Community" ? (
                <CommunitySpaceView space={space} />
            ) : space.type === "Club" ? (
                <ClubSpaceView space={space} />
            ) : (
                <TeamSpaceView space={space} />
            )}
        </View>
    );
}

// --- TEAM SPACE (Internal Hub) ---
function TeamSpaceView({ space }: { space: any }) {
    const [activeTab, setActiveTab] = useState('goals');

    return (
        <View className="flex-1">
            <View className="px-4 py-4 bg-card border-b border-border">
                <View className="flex-row items-center gap-2">
                    <Text className="text-xl font-bold text-foreground">{space.name}</Text>
                    <View className="bg-secondary px-2 py-0.5 rounded border border-border">
                        <Text className="text-[10px] text-muted-foreground uppercase">Team</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-1.5 mt-1">
                    <Rocket size={14} color="#6366f1" />
                    <Text className="text-xs text-muted-foreground font-medium">Internal Team Hub • Exclusive Access</Text>
                </View>
            </View>

            {/* Tabs Navigation */}
            <View className="flex-row bg-background px-4 py-2 border-b border-border gap-4">
                {['goals', 'planning', 'tasks', 'docs'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`pb-2 border-b-2 ${activeTab === tab ? 'border-primary' : 'border-transparent'}`}
                    >
                        <Text className={`text-xs capitalize font-bold ${activeTab === tab ? 'text-primary' : 'text-muted-foreground'}`}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
                {activeTab === 'goals' && (
                    <View className="gap-4">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest">OKRs & Targets</Text>
                            <TouchableOpacity className="flex-row items-center gap-1">
                                <Plus size={14} color="#6366f1" />
                                <Text className="text-xs font-bold text-primary">New</Text>
                            </TouchableOpacity>
                        </View>
                        {MOCK_GOALS.map(goal => (
                            <View key={goal.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                                <View className="flex-row justify-between items-start mb-3">
                                    <View>
                                        <Text className="text-[10px] font-bold text-primary uppercase mb-1">{goal.category}</Text>
                                        <Text className="text-sm font-bold text-foreground">{goal.title}</Text>
                                    </View>
                                    <View className="bg-secondary px-2 py-1 rounded">
                                        <Text className="text-xs font-bold text-primary">{goal.progress}%</Text>
                                    </View>
                                </View>
                                <View className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <View className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === 'planning' && (
                    <View className="gap-4">
                        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Strategy & Content</Text>
                        {MOCK_CONTENT_PLAN.map(item => (
                            <TouchableOpacity key={item.id} className="bg-card border border-border rounded-xl p-4 flex-row items-center gap-4">
                                <View className="h-10 w-10 rounded-lg bg-primary/10 items-center justify-center">
                                    <Layout size={20} color="#6366f1" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-foreground">{item.title}</Text>
                                    <Text className="text-xs text-muted-foreground">{item.date} • {item.status}</Text>
                                </View>
                                <ChevronRight size={16} color="#888" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {activeTab === 'tasks' && (
                    <View className="gap-3">
                        {MOCK_TASKS.map(task => (
                            <View key={task.id} className="bg-card border border-border rounded-xl p-3 flex-row items-center gap-3">
                                <CheckSquare size={18} color="#6366f1" />
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-foreground">{task.title}</Text>
                                    <Text className="text-xs text-muted-foreground">{task.assignee} • Due {task.due}</Text>
                                </View>
                                <View className="bg-secondary px-2 py-0.5 rounded">
                                    <Text className="text-[10px] font-medium text-muted-foreground">{task.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === 'docs' && (
                    <View className="flex-row flex-wrap gap-4">
                        {["Brand Guidelines", "Q4 Strategy", "API Docs", "Team Handbook"].map((doc, i) => (
                            <View key={i} className="w-[47%] bg-card border border-border rounded-xl p-4 items-center">
                                <View className="h-12 w-12 rounded-lg bg-orange-50 items-center justify-center mb-2">
                                    <FileText size={24} color="#f97316" />
                                </View>
                                <Text className="text-xs font-bold text-foreground text-center">{doc}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Float Insights (Simplified for Mobile) */}
            <View className="absolute right-4 bottom-4 left-4">
                <View className="bg-background/95 border border-primary/20 rounded-2xl p-4 shadow-xl">
                    <View className="flex-row items-center gap-2 mb-2">
                        <Sparkles size={16} color="#6366f1" />
                        <Text className="text-xs font-bold text-primary uppercase">Oto Insights</Text>
                    </View>
                    <Text className="text-[13px] leading-tight text-foreground mb-3">
                        Client <Text className="font-bold">Alice Johnson</Text> checked on "Q4 Strategy" progress via WhatsApp.
                    </Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity className="bg-primary px-3 py-1.5 rounded-lg">
                            <Text className="text-white text-[11px] font-bold">Share Progress</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                            <Text className="text-foreground text-[11px] font-bold">Draft Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

// --- COMMUNITY SPACE (Full Parity) ---
function CommunitySpaceView({ space }: { space: any }) {
    const [selectedUser, setSelectedUser] = useState<any>(null);

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1 pb-12">
                {/* Header info */}
                <View className="px-4 py-3 bg-card border-b border-border">
                    <Text className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{space.members} Members • Public Space</Text>
                </View>

                {/* Composer Bar */}
                <TouchableOpacity
                    className="p-4 bg-muted/20 border-b border-border flex-row gap-3"
                    onPress={() => setSelectedUser(MOCK_CURRENT_USER)}
                >
                    <View className="h-10 w-10 rounded-full bg-slate-900" />
                    <View className="flex-1 justify-center">
                        <Text className="text-muted-foreground text-sm">Start a thread...</Text>
                    </View>
                    <View className="bg-primary px-4 py-2 rounded-full">
                        <Text className="text-white font-bold text-xs">Post</Text>
                    </View>
                </TouchableOpacity>

                {/* Feed */}
                <View className="p-2 gap-4">
                    {MOCK_FEED.map(post => (
                        <View key={post.id} className="bg-card border border-border rounded-xl p-4">
                            <View className="flex-row gap-3">
                                <TouchableOpacity onPress={() => setSelectedUser(post.user)}>
                                    <View className={`h-10 w-10 rounded-full ${post.user.avatar}`} />
                                </TouchableOpacity>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <TouchableOpacity className="flex-row items-center gap-1.5" onPress={() => setSelectedUser(post.user)}>
                                            <Text className="font-bold text-foreground text-sm">{post.user.name}</Text>
                                            <Text className="text-muted-foreground text-xs">• {post.time}</Text>
                                        </TouchableOpacity>
                                        <MoreHorizontal size={16} color="#888" />
                                    </View>
                                    <Text className="text-foreground text-sm leading-relaxed mb-3">{post.content}</Text>

                                    {post.type === 'image' && (
                                        <View className="h-48 w-full bg-secondary rounded-xl mb-3 overflow-hidden border border-border justify-center items-center">
                                            <ImageIcon size={32} color="#888" />
                                            <Text className="text-muted-foreground text-xs mt-2">Post Image Placeholder</Text>
                                        </View>
                                    )}

                                    <View className="flex-row gap-6">
                                        <TouchableOpacity className="flex-row items-center gap-1.5">
                                            <MessageSquare size={16} color="#666" />
                                            <Text className="text-xs text-muted-foreground">{post.comments}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center gap-1.5">
                                            <Heart size={16} color="#666" />
                                            <Text className="text-xs text-muted-foreground">{post.likes}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center gap-1.5">
                                            <Repeat size={16} color="#666" />
                                            <Text className="text-xs text-muted-foreground">{post.shares}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="ml-auto">
                                            <Share2 size={16} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* User Profile Overlay */}
            {selectedUser && (
                <View className="absolute inset-0 bg-black/60 items-center justify-center p-6 z-50">
                    <TouchableOpacity
                        className="absolute inset-0"
                        onPress={() => setSelectedUser(null)}
                    />
                    <View className="bg-card w-full rounded-3xl overflow-hidden border border-border shadow-2xl">
                        <View className="h-20 bg-primary/20" />
                        <View className="items-center -mt-10 px-6 pb-6">
                            <View className={`h-20 w-20 rounded-full border-4 border-card ${selectedUser.avatar || 'bg-primary'}`} />
                            <Text className="text-xl font-bold text-foreground mt-3">{selectedUser.name}</Text>
                            <Text className="text-sm text-muted-foreground">{selectedUser.handle || 'Member'}</Text>

                            <Text className="text-xs text-center text-foreground/80 mt-4 leading-relaxed italic">
                                "{selectedUser.bio || "Building the future with Oto."}"
                            </Text>

                            <View className="flex-row gap-2 mt-6 w-full">
                                <TouchableOpacity className="flex-1 bg-primary py-3 rounded-xl items-center shadow-lg shadow-primary/20">
                                    <Text className="text-white font-bold text-xs uppercase tracking-wider">Connect</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-secondary py-3 rounded-xl items-center border border-border">
                                    <Text className="text-foreground font-bold text-xs uppercase tracking-wider">Message</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                className="mt-6 p-2"
                                onPress={() => setSelectedUser(null)}
                            >
                                <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

// --- CLUB SPACE ---
function ClubSpaceView({ space }: { space: any }) {
    return (
        <ScrollView className="flex-1 bg-background p-6">
            <View className="items-center justify-center py-10">
                <View className="h-20 w-20 rounded-3xl bg-orange-100 items-center justify-center mb-6">
                    <Home size={40} color="#f97316" />
                </View>
                <Text className="text-2xl font-bold text-foreground mb-2 text-center">{space.name}</Text>
                <Text className="text-sm text-muted-foreground text-center mb-8">
                    A private club space for groups to organize events, share lists, and chat.
                </Text>

                <View className="flex-row gap-4 w-full">
                    <TouchableOpacity className="flex-1 bg-card border border-border p-6 rounded-2xl items-center shadow-sm">
                        <Calendar size={32} color="#6366f1" />
                        <Text className="font-bold text-foreground mt-3">Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-card border border-border p-6 rounded-2xl items-center shadow-sm">
                        <CheckSquare size={32} color="#6366f1" />
                        <Text className="font-bold text-foreground mt-3">Lists</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="w-full bg-primary py-4 rounded-xl mt-6 items-center flex-row justify-center gap-2">
                    <Users size={18} color="#fff" />
                    <Text className="text-white font-bold">Invite Club Members</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
