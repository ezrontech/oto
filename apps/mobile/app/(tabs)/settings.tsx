import { View, Text, ScrollView, TouchableOpacity, Switch as RNSwitch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    User,
    Shield,
    Bell,
    Briefcase,
    ChevronRight,
    Camera,
    Check,
    Eye,
    Globe,
    Lock,
    Settings as SettingsIcon,
    Moon,
    Laptop
} from 'lucide-react-native';
import { useState } from 'react';
import { MOCK_CURRENT_USER } from '../../data/mock';

export default function SettingsScreen() {
    const router = useRouter();
    const [user, setUser] = useState(MOCK_CURRENT_USER);

    const handleToggleMessages = () => {
        setUser(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                receiveMessagesFromAnyone: !prev.settings.receiveMessagesFromAnyone
            }
        }));
    };

    return (
        <ScrollView className="flex-1 bg-background">
            <Stack.Screen options={{ title: 'Settings' }} />

            {/* Profile Header */}
            <View className="p-6 items-center border-b border-border">
                <TouchableOpacity className="relative">
                    <View className="h-20 w-20 rounded-full bg-primary/10 items-center justify-center border-2 border-dashed border-primary/20">
                        <User size={32} color="#6366f1" opacity={0.4} />
                    </View>
                    <View className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-background">
                        <Camera size={14} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground mt-4">{user.name}</Text>
                <Text className="text-sm text-muted-foreground">{user.email}</Text>
            </View>

            {/* Settings Groups */}
            <View className="p-4 gap-6">

                {/* Account Section */}
                <View>
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-2">Digital Identity</Text>
                    <View className="bg-card border border-border rounded-2xl overflow-hidden">
                        <SettingsItem
                            icon={<User size={18} color="#6366f1" />}
                            label="Edit Profile"
                            onPress={() => router.push('/settings/profile')}
                        />
                        <SettingsItem
                            icon={<View className="h-4 w-4 border border-indigo-500 rounded-[2px] items-center justify-center"><View className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /></View>}
                            label="My Contact Card"
                            onPress={() => router.push('/settings/contact-card')}
                            badge={user.contactCard.visibility.toUpperCase()}
                        />
                    </View>
                </View>

                {/* Agency Management */}
                <View>
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-2">Agency Administration</Text>
                    <View className="bg-card border border-border rounded-2xl overflow-hidden">
                        <SettingsItem
                            icon={<SettingsIcon size={18} color="#6366f1" />}
                            label="Agency Management"
                            onPress={() => router.push('/settings/agency')}
                        />
                    </View>
                </View>

                {/* Privacy Section */}
                <View>
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-2">Privacy & Interactions</Text>
                    <View className="bg-card border border-border rounded-2xl overflow-hidden">
                        <View className="flex-row items-center justify-between p-4 border-b border-border/50">
                            <View className="flex-row items-center gap-3 flex-1">
                                <Shield size={18} color="#22c55e" />
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-foreground">Open Messaging</Text>
                                    <Text className="text-[10px] text-muted-foreground">Anyone can message you</Text>
                                </View>
                            </View>
                            <RNSwitch
                                value={user.settings.receiveMessagesFromAnyone}
                                onValueChange={handleToggleMessages}
                                trackColor={{ false: '#767577', true: '#6366f1' }}
                            />
                        </View>
                        <SettingsItem
                            icon={<Lock size={18} color="#888" />}
                            label="Security & Access"
                            onPress={() => router.push('/settings/security')}
                        />
                    </View>
                </View>

                {/* Preferences */}
                <View>
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-2">Preferences</Text>
                    <View className="bg-card border border-border rounded-2xl overflow-hidden">
                        <SettingsItem
                            icon={<Bell size={18} color="#f59e0b" />}
                            label="Notifications"
                            onPress={() => router.push('/settings/notifications')}
                        />
                        <SettingsItem
                            icon={<Moon size={18} color="#6366f1" />}
                            label="Appearance"
                            value="Dark"
                            onPress={() => router.push('/settings/appearance')}
                        />
                    </View>
                </View>

                {/* Log Out */}
                <TouchableOpacity className="mt-4 p-4 items-center">
                    <Text className="text-destructive font-bold">Log Out</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

function SettingsItem({ icon, label, onPress, badge, value }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between p-4 border-b border-border/50 active:bg-muted/30"
        >
            <View className="flex-row items-center gap-3">
                {icon}
                <Text className="text-sm font-bold text-foreground">{label}</Text>
            </View>
            <View className="flex-row items-center gap-2">
                {badge && (
                    <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                        <Text className="text-[8px] font-black text-primary">{badge}</Text>
                    </View>
                )}
                {value && (
                    <Text className="text-xs text-muted-foreground">{value}</Text>
                )}
                <ChevronRight size={16} color="#888" />
            </View>
        </TouchableOpacity>
    );
}
