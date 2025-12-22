"use client";

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
    Users, TrendingUp, AlertCircle, Bot,
    MessageSquare, Sparkles, Clock, Zap,
    BookOpen, ChevronRight, BarChart2, Lightbulb
} from 'lucide-react-native';
import { MOCK_CONTACTS, MOCK_AGENTS, MOCK_FEED, MOCK_PRODUCTIVITY, MOCK_NOTES, MOCK_SPACES } from '../../data/mock';

export default function MyHubScreen() {
    const router = useRouter();

    const getContextualTips = () => {
        const tips = [];
        if (MOCK_PRODUCTIVITY.efficiencyGain > 20) {
            tips.push({
                title: "Efficiency Peak",
                content: `You're ${MOCK_PRODUCTIVITY.efficiencyGain}% faster this week. Try automating 5 more tasks to break your record.`,
                icon: <Zap size={16} color="#f59e0b" />
            });
        }
        if (MOCK_SPACES.length > 2) {
            tips.push({
                title: "Community Insight",
                content: "Trending: 'AI Ops' is the top topic in your spaces. Join the conversation to boost engagement.",
                icon: <MessageSquare size={16} color="#3b82f6" />
            });
        }
        return tips.length > 0 ? tips : [MOCK_NOTES[2]];
    };

    const tips = getContextualTips();

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Minimalist Header */}
            <View className="px-6 pt-8 pb-6 bg-background">
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-foreground">Good morning, Ezron</Text>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">System Health: Optimal</Text>
                    </View>
                    <TouchableOpacity className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                        <Sparkles size={18} color="#6366f1" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Productivity Quick Stats */}
            <View className="px-4 flex-row gap-3 mb-6">
                <View className="flex-1 bg-card border border-border/60 rounded-2xl p-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Clock size={16} color="#22c55e" />
                        <Text className="text-[9px] font-bold text-green-600 uppercase tracking-tight">Saved</Text>
                    </View>
                    <Text className="text-xl font-bold text-foreground">{MOCK_PRODUCTIVITY.hoursSaved}h</Text>
                </View>

                <View className="flex-1 bg-card border border-border/60 rounded-2xl p-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <MessageSquare size={16} color="#3b82f6" />
                        <Text className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Handled</Text>
                    </View>
                    <Text className="text-xl font-bold text-foreground">{MOCK_PRODUCTIVITY.inquiriesResolved}</Text>
                </View>
            </View>

            {/* Contextual Tips from Oto */}
            <View className="px-4 mb-8">
                <View className="flex-row items-center gap-2 mb-4 px-1">
                    <Lightbulb size={18} color="#f59e0b" />
                    <Text className="text-lg font-bold text-foreground tracking-tight">Tips from Oto</Text>
                </View>
                {tips.map((tip, idx) => (
                    <View key={idx} className="bg-card border border-border/40 rounded-2xl p-4 mb-3 shadow-sm shadow-black/5">
                        <View className="flex-row items-center gap-2 mb-2">
                            {tip.icon ? tip.icon : <Lightbulb size={14} color="#f59e0b" />}
                            <Text className="text-xs font-bold text-foreground">{tip.title}</Text>
                        </View>
                        <Text className="text-xs text-muted-foreground leading-relaxed font-medium">
                            {tip.content}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Agency Workforce */}
            <View className="px-4 mb-8">
                <View className="flex-row justify-between items-center mb-4 px-1">
                    <View className="flex-row items-center gap-2">
                        <Bot size={18} color="#6366f1" />
                        <Text className="text-lg font-bold text-foreground tracking-tight">Digital Workforce</Text>
                    </View>
                    <Badge count={MOCK_AGENTS.filter(a => a.status === 'active').length} />
                </View>

                <View className="space-y-3">
                    {MOCK_AGENTS.slice(0, 3).map(agent => (
                        <TouchableOpacity key={agent.id} className="bg-muted/20 border border-border/40 rounded-2xl p-4 flex-row items-center gap-3">
                            <View className="h-10 w-10 rounded-xl bg-card border border-border/60 items-center justify-center">
                                <Text className="text-[10px] font-bold text-primary">{agent.avatar}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-foreground">{agent.name}</Text>
                                <Text className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{agent.role}</Text>
                            </View>
                            <View className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-muted'}`} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Agency Pulse */}
            <View className="px-4 pb-20">
                <View className="flex-row justify-between items-center mb-4 px-1">
                    <View className="flex-row items-center gap-2">
                        <BarChart2 size={18} color="#888" />
                        <Text className="text-lg font-bold text-foreground tracking-tight">Agency Pulse</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/spaces")}>
                        <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">See All</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {MOCK_FEED?.slice(0, 2).map((post: any) => (
                        <View key={post.id} className="flex-row gap-3 border-b border-border/20 pb-4">
                            <View className={`h-10 w-10 rounded-xl ${post.user.avatar} items-center justify-center opacity-80`}>
                                <Users size={20} color="#666" />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between">
                                    <Text className="text-foreground text-sm font-bold">{post.user.name}</Text>
                                    <Text className="text-muted-foreground text-[9px] font-bold uppercase tracking-tighter">{post.time}</Text>
                                </View>
                                <Text className="text-muted-foreground text-xs mt-1 leading-snug font-medium" numberOfLines={2}>{post.content}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

function Badge({ count }: { count: number }) {
    return (
        <View className="bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            <Text className="text-primary text-[10px] font-bold">{count} Active</Text>
        </View>
    );
}
