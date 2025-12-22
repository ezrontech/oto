import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Bell,
    MessageSquare,
    Users,
    Bot,
    Newspaper,
    Volume2,
    ShieldCheck,
    Zap
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
    const [testing, setTesting] = useState(false);

    const handleTestPush = () => {
        setTesting(true);
        setTimeout(() => {
            setTesting(false);
            Alert.alert(
                "Push Test Success",
                "Oto simulation: Signal sent to device successfully. Token: 'oto_mock_8291...'",
                [{ text: "OK" }]
            );
        }, 1500);
    };

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Alert Settings',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-8 pb-32">
                    {/* Native Connectivity Status */}
                    <View className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 flex-row items-center gap-4">
                        <View className="h-12 w-12 bg-primary/10 rounded-2xl items-center justify-center">
                            <ShieldCheck size={24} color="#6366f1" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Native Connection</Text>
                            <Text className="text-sm font-bold text-foreground">Push Engine Active</Text>
                            <Text className="text-[10px] text-muted-foreground mt-0.5">Device Token Ready (expo-notifications)</Text>
                        </View>
                        <View className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </View>

                    {/* Master Controls */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-1">Master Controls</Text>
                        <View className="bg-card border border-border/60 rounded-[24px] overflow-hidden shadow-sm shadow-black/5">
                            <ControlRow
                                icon={<Bell size={18} color="#6366f1" />}
                                label="Push Notifications"
                                description="Real-time alerts on your device"
                                value={pushEnabled}
                                onValueChange={setPushEnabled}
                            />
                            <ControlRow
                                icon={<Bell size={18} color="#888" />}
                                label="Email Updates"
                                description="Daily digest and critical alerts"
                                value={emailEnabled}
                                onValueChange={setEmailEnabled}
                                last
                            />
                        </View>
                    </View>

                    {/* Simulation Tool */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-1">Connectivity Labs</Text>
                        <TouchableOpacity
                            onPress={handleTestPush}
                            disabled={testing}
                            className={`bg-card border border-border/60 rounded-[20px] p-4 flex-row items-center justify-between shadow-sm shadow-black/5 ${testing ? 'opacity-50' : ''}`}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="h-8 w-8 bg-purple-500/10 rounded-xl items-center justify-center">
                                    <Zap size={16} color="#a855f7" />
                                </View>
                                <Text className="text-sm font-bold text-foreground">{testing ? 'Testing Engine...' : 'Test Push Connection'}</Text>
                            </View>
                            <ChevronLeft size={16} color="#888" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                    </View>

                    {/* Categories */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-1">Delivery Channels</Text>
                        <View className="bg-card border border-border/60 rounded-[24px] overflow-hidden shadow-sm shadow-black/5">
                            <ControlRow
                                icon={<MessageSquare size={18} color="#22c55e" />}
                                label="Conversations"
                                description="High priority customer replies"
                                value={messagesEnabled}
                                onValueChange={setMessagesEnabled}
                            />
                            <ControlRow
                                icon={<Users size={18} color="#3b82f6" />}
                                label="Workspace Spaces"
                                description="Shared updates and mentions"
                                value={spacesEnabled}
                                onValueChange={setSpacesEnabled}
                            />
                            <ControlRow
                                icon={<Bot size={18} color="#f59e0b" />}
                                label="AI Agent Status"
                                description="Workflow logs and successes"
                                value={agentsEnabled}
                                onValueChange={setAgentsEnabled}
                                last
                            />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

function ControlRow({ icon, label, description, value, onValueChange, last }: any) {
    return (
        <View className={`p-5 flex-row justify-between items-center ${!last ? 'border-b border-border/40' : ''}`}>
            <View className="flex-1 flex-row items-center gap-4">
                <View className="h-9 w-9 bg-muted/30 rounded-xl items-center justify-center">{icon}</View>
                <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground">{label}</Text>
                    <Text className="text-[10px] text-muted-foreground font-medium mt-0.5">{description}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#767577', true: '#6366f1' }}
            />
        </View>
    );
}
