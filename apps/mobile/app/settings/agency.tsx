import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Settings as SettingsIcon,
    Palette,
    Bot,
    Layout,
    Globe,
    Shield
} from 'lucide-react-native';
import { useState } from 'react';

export default function AgencySettingsScreen() {
    const router = useRouter();
    const [welcomeEnabled, setWelcomeEnabled] = useState(true);

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Agency Management',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-6 pb-20">
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Agency Profile</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-1">Agency Name</Text>
                                <TextInput className="text-foreground text-sm font-bold" defaultValue="Antigravity Media" />
                            </View>
                            <View className="p-4">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-1">Primary Domain</Text>
                                <TextInput className="text-primary text-sm font-bold" defaultValue="antigravity.agency" autoCapitalize="none" />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Branding</Text>
                        <View className="bg-card border border-border rounded-2xl p-4 flex-row items-center gap-4">
                            <View className="h-12 w-12 rounded-xl bg-[#6366f1] items-center justify-center">
                                <Text className="text-white font-black text-xl">A</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-foreground">Brand Palette</Text>
                                <Text className="text-[10px] text-muted-foreground">Indigo Theme</Text>
                            </View>
                            <TouchableOpacity className="bg-muted px-3 py-2 rounded-lg">
                                <Palette size={16} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">AI Automation</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1">
                                    <Text className="text-sm font-bold text-foreground">Auto-Welcome</Text>
                                    <Text className="text-[10px] text-muted-foreground">Bot greets new members</Text>
                                </View>
                                <Switch value={welcomeEnabled} onValueChange={setWelcomeEnabled} trackColor={{ false: '#767577', true: '#6366f1' }} />
                            </View>
                            <View className="p-4">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-2">Default Bot Greeting</Text>
                                <TextInput className="text-foreground text-xs bg-muted/30 p-3 rounded-xl min-h-[80px]" multiline defaultValue="Welcome to the workspace! I'm the Antigravity assistant." style={{ textAlignVertical: 'top' }} />
                            </View>
                        </View>
                    </View>

                    <View className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex-row items-center gap-4">
                        <Layout size={20} color="#6366f1" />
                        <View>
                            <Text className="text-sm font-bold text-foreground">128 Active Members</Text>
                            <Text className="text-[10px] text-muted-foreground">8 managed spaces</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
