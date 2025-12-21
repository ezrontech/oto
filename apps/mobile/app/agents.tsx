import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MOCK_AGENTS } from '../data/mock';
import { Bot, Search, MoreHorizontal, Sparkles, Wrench, MessageSquare, ArrowLeft } from 'lucide-react-native';

export default function AgentsScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="pt-12 px-4 pb-4 bg-background border-b border-border flex-row items-center gap-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-bold text-foreground">AI Workforce</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>

                {/* Builder CTA */}
                <View className="bg-card border-2 border-primary/20 border-dashed rounded-xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                        <Sparkles size={16} color="#6366f1" />
                        <Text className="font-bold text-base text-foreground">Draft New Agent</Text>
                    </View>
                    <Text className="text-muted-foreground text-xs mb-3">
                        Describe the role, and Oto will configure the tools and knowledge.
                    </Text>
                    <View className="flex-row gap-2">
                        <TextInput
                            placeholder="e.g. 'Returns Manager...'"
                            className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground"
                            placeholderTextColor="#888"
                        />
                        <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg items-center justify-center">
                            <Text className="text-primary-foreground font-bold text-xs">Start</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Agents Grid */}
                <View>
                    <Text className="text-lg font-bold text-foreground mb-4">Active Agents</Text>
                    <View className="gap-4">
                        {MOCK_AGENTS.map((agent) => (
                            <TouchableOpacity key={agent.id} className="bg-card border border-border rounded-xl p-4">
                                <View className="flex-row items-start gap-4 mb-3">
                                    <View className="h-10 w-10 rounded-full bg-secondary items-center justify-center border border-border">
                                        <Text className="font-bold text-primary">{agent.avatar}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold text-base text-foreground">{agent.name}</Text>
                                        <View className="bg-secondary self-start px-2 py-0.5 rounded mt-1">
                                            <Text className="text-[10px] text-muted-foreground">{agent.role}</Text>
                                        </View>
                                    </View>
                                    <MoreHorizontal size={20} color="#888" />
                                </View>

                                <Text className="text-sm text-muted-foreground mb-4 leading-5">{agent.description}</Text>

                                <View className="flex-row justify-between items-center border-t border-border/50 pt-3">
                                    <View className="flex-row gap-2">
                                        <View className="h-6 w-6 rounded bg-secondary items-center justify-center">
                                            <Wrench size={12} color="#666" />
                                        </View>
                                        <View className="h-6 w-6 rounded bg-secondary items-center justify-center">
                                            <MessageSquare size={12} color="#666" />
                                        </View>
                                    </View>
                                    <View className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
