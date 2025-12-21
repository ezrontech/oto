import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Lock,
    Shield,
    Fingerprint,
    Smartphone,
    ChevronRight
} from 'lucide-react-native';
import { useState } from 'react';

export default function SecurityScreen() {
    const router = useRouter();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(true);

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Security & Access',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-6 pb-20">
                    {/* Password */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Password</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <TouchableOpacity className="p-4 flex-row items-center justify-between active:bg-muted/30">
                                <View className="flex-row items-center gap-3 flex-1">
                                    <Lock size={18} color="#6366f1" />
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-foreground">Change Password</Text>
                                        <Text className="text-[10px] text-muted-foreground">Last changed 3 months ago</Text>
                                    </View>
                                </View>
                                <ChevronRight size={16} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Authentication */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Authentication</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Shield size={18} color="#22c55e" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Two-Factor Authentication</Text>
                                        <Text className="text-[10px] text-muted-foreground">Extra security for your account</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={twoFactorEnabled}
                                    onValueChange={setTwoFactorEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                            <View className="p-4 flex-row justify-between items-center">
                                <View className="flex-1 gap-1 flex-row items-center">
                                    <Fingerprint size={18} color="#6366f1" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-bold text-foreground">Biometric Login</Text>
                                        <Text className="text-[10px] text-muted-foreground">Use fingerprint or Face ID</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={biometricEnabled}
                                    onValueChange={setBiometricEnabled}
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Active Sessions */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Active Sessions</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50">
                                <View className="flex-row items-center gap-3">
                                    <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                                        <Smartphone size={18} color="#6366f1" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-foreground">iPhone 15 Pro</Text>
                                        <Text className="text-[10px] text-muted-foreground">Current device • San Francisco, CA</Text>
                                    </View>
                                    <View className="bg-green-500/10 px-2 py-0.5 rounded-full">
                                        <Text className="text-[8px] font-black text-green-600">ACTIVE</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="p-4">
                                <View className="flex-row items-center gap-3">
                                    <View className="h-10 w-10 rounded-full bg-muted items-center justify-center">
                                        <Smartphone size={18} color="#888" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-bold text-foreground">iPad Pro</Text>
                                        <Text className="text-[10px] text-muted-foreground">Last active 2 days ago • Los Angeles, CA</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Security Activity */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Recent Activity</Text>
                        <View className="bg-card border border-border rounded-2xl p-4">
                            <View className="space-y-3">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-xs text-foreground">Password changed</Text>
                                    <Text className="text-[10px] text-muted-foreground">3 months ago</Text>
                                </View>
                                <View className="border-b border-border/50" />
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-xs text-foreground">New device login</Text>
                                    <Text className="text-[10px] text-muted-foreground">2 weeks ago</Text>
                                </View>
                                <View className="border-b border-border/50" />
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-xs text-foreground">Email verified</Text>
                                    <Text className="text-[10px] text-muted-foreground">6 months ago</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
