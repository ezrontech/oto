import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Users, TrendingUp, AlertCircle, Bot, MessageSquare, Sparkles, Clock, Zap, BookOpen, ChevronRight, BarChart2 } from 'lucide-react-native';
import { MOCK_CONTACTS, MOCK_AGENTS, MOCK_FEED, MOCK_PRODUCTIVITY, MOCK_NOTES } from '../../data/mock';

export default function MyHubScreen() {
    const router = useRouter();
    const activeAgents = MOCK_AGENTS.filter(a => a.status === "active").length;

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Dynamic AI Briefing Header */}
            <View className="p-6 bg-primary/10 border-b border-primary/20">
                <View className="flex-row items-center gap-2 mb-2">
                    <View className="h-6 w-6 rounded-full bg-primary items-center justify-center">
                        <Bot size={14} color="#fff" />
                    </View>
                    <Text className="text-[10px] font-bold text-primary uppercase tracking-widest">Oto Intelligence</Text>
                </View>
                <Text className="text-xl font-bold text-foreground mb-2">Good morning, Ezron</Text>
                <Text className="text-sm italic text-foreground/80 leading-relaxed mb-4">
                    "{MOCK_NOTES[0].content}"
                </Text>
                <TouchableOpacity className="bg-primary px-4 py-2.5 rounded-xl self-start flex-row items-center gap-2">
                    <TrendingUp size={14} color="#fff" />
                    <Text className="text-white font-bold text-xs">Analyze Progress</Text>
                </TouchableOpacity>
            </View>

            {/* Productivity Quick Stats */}
            <View className="p-4 flex-row gap-3">
                <View className="flex-1 bg-card border border-border rounded-2xl p-4 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                        <Clock size={16} color="#22c55e" />
                        <Text className="text-[10px] font-bold text-green-600">SAVED</Text>
                    </View>
                    <Text className="text-2xl font-black text-foreground">{MOCK_PRODUCTIVITY.hoursSaved}h</Text>
                    <Text className="text-[10px] text-muted-foreground mt-1">This Week</Text>
                </View>

                <View className="flex-1 bg-card border border-border rounded-2xl p-4 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                        <MessageSquare size={16} color="#3b82f6" />
                        <Text className="text-[10px] font-bold text-blue-600">HANDLED</Text>
                    </View>
                    <Text className="text-2xl font-black text-foreground">{MOCK_PRODUCTIVITY.inquiriesResolved}</Text>
                    <Text className="text-[10px] text-muted-foreground mt-1">Total Replies</Text>
                </View>
            </View>

            {/* Efficiency Highlight */}
            <View className="mx-4 mb-6 bg-purple-600 rounded-2xl p-5 shadow-lg shadow-purple-200">
                <View className="flex-row justify-between items-start">
                    <View>
                        <Text className="text-white/80 text-xs font-bold uppercase mb-1">Efficiency Boost</Text>
                        <Text className="text-white text-3xl font-black">+{MOCK_PRODUCTIVITY.efficiencyGain}%</Text>
                    </View>
                    <Zap size={32} color="#fff" opacity={0.3} />
                </View>
                <Text className="text-white/90 text-xs mt-3 leading-tight">
                    Your agency is responding faster than 92% of competitors in your sector.
                </Text>
            </View>

            {/* Notes from Oto - Pro User Path */}
            <View className="p-4">
                <View className="flex-row items-center gap-2 mb-4">
                    <BookOpen size={18} color="#6366f1" />
                    <Text className="text-lg font-bold text-foreground">Notes from Oto</Text>
                </View>
                {MOCK_NOTES.map(note => (
                    <TouchableOpacity key={note.id} className="bg-muted/30 border border-border/50 rounded-2xl p-4 mb-3 flex-row items-center gap-3">
                        <View className="flex-1">
                            <Text className="text-sm font-bold text-foreground mb-1">{note.title}</Text>
                            <Text className="text-xs text-muted-foreground leading-relaxed">{note.content}</Text>
                        </View>
                        <ChevronRight size={16} color="#888" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Agency Pulse */}
            <View className="p-4">
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center gap-2">
                        <BarChart2 size={18} color="#888" />
                        <Text className="text-lg font-bold text-foreground">Agency Pulse</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/spaces")}>
                        <Text className="text-primary text-xs font-bold underline">See All</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-4">
                    {MOCK_FEED?.slice(0, 3).map((post: any) => (
                        <View key={post.id} className="flex-row gap-3 border-b border-border/50 pb-4 last:border-0">
                            <View className={`h-10 w-10 rounded-xl ${post.user.avatar} items-center justify-center`}>
                                <Users size={20} color="#666" />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between">
                                    <Text className="text-foreground text-sm font-bold">{post.user.name}</Text>
                                    <Text className="text-muted-foreground text-[10px]">{post.time}</Text>
                                </View>
                                <Text className="text-muted-foreground text-xs mt-1" numberOfLines={2}>{post.content}</Text>
                                <View className="flex-row gap-4 mt-2">
                                    <Text className="text-primary text-[10px] font-bold">Community • Reply</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

        </ScrollView>
    );
}
