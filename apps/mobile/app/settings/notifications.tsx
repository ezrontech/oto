import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Bell,
    MessageSquare,
    Users,
    Bot,
    Newspaper,
    Volume2
} from 'lucide-react-native';
import { useState } from 'react';

export default function NotificationsScreen() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [messagesEnabled, setMessagesEnabled] = useState(true);
    const [spacesEnabled, setSpacesEnabled] = useState(true);
    const [agentsEnabled, setAgentsEnabled] = useState(true);
    const [updatesEnabled, setUpdatesEnabled] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Notifications',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-6 pb-20">
                    {/* Master Controls */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Master Controls</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Bell size={18} color="#6366f1" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Push Notifications</Text>
                                        <Text className="text-[10px] text-muted-foreground">Receive notifications on this device</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={pushEnabled}
                                    onValueChange={setPushEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                            <View className="p-4 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Bell size={18} color="#888" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Email Notifications</Text>
                                        <Text className="text-[10px] text-muted-foreground">Receive updates via email</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={emailEnabled}
                                    onValueChange={setEmailEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Notification Categories */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Categories</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <MessageSquare size={18} color="#22c55e" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Messages</Text>
                                        <Text className="text-[10px] text-muted-foreground">Direct messages and mentions</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={messagesEnabled}
                                    onValueChange={setMessagesEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Users size={18} color="#3b82f6" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Spaces</Text>
                                        <Text className="text-[10px] text-muted-foreground">Activity in your spaces</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={spacesEnabled}
                                    onValueChange={setSpacesEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Bot size={18} color="#f59e0b" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">AI Agents</Text>
                                        <Text className="text-[10px] text-muted-foreground">Agent alerts and updates</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={agentsEnabled}
                                    onValueChange={setAgentsEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                            <View className="p-4 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Newspaper size={18} color="#888" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Product Updates</Text>
                                        <Text className="text-[10px] text-muted-foreground">New features and announcements</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={updatesEnabled}
                                    onValueChange={setUpdatesEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Sound & Alerts */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Sound & Alerts</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Volume2 size={18} color="#6366f1" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Notification Sounds</Text>
                                        <Text className="text-[10px] text-muted-foreground">Play sound for notifications</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={soundEnabled}
                                    onValueChange={setSoundEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                            <View className="p-4">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-2">Do Not Disturb</Text>
                                <View className="bg-muted/30 p-3 rounded-xl">
                                    <Text className="text-xs text-foreground">Scheduled: 10:00 PM - 8:00 AM</Text>
                                    <Text className="text-[10px] text-muted-foreground mt-1">Mute all notifications during this time</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
