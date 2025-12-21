import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    User,
    Camera,
    Mail
} from 'lucide-react-native';
import { useState } from 'react';
import { MOCK_CURRENT_USER } from '../../data/mock';

export default function EditProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState(MOCK_CURRENT_USER);

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Edit Profile',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.back()} className="mr-2">
                        <Text className="text-primary font-bold">Save</Text>
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-6 pb-20">
                    {/* Profile Picture */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Profile Picture</Text>
                        <View className="items-center">
                            <TouchableOpacity className="relative">
                                <View className="h-24 w-24 rounded-full bg-primary/10 items-center justify-center border-2 border-dashed border-primary/20">
                                    <User size={40} color="#6366f1" opacity={0.4} />
                                </View>
                                <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background">
                                    <Camera size={16} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <Text className="text-xs text-muted-foreground mt-3">Tap to change photo</Text>
                        </View>
                    </View>

                    {/* Basic Info */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Basic Information</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <View className="p-4 border-b border-border/50">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-1">Display Name</Text>
                                <TextInput
                                    className="text-foreground text-sm font-bold"
                                    value={user.name}
                                    onChangeText={(text) => setUser(prev => ({ ...prev, name: text }))}
                                />
                            </View>
                            <View className="p-4 border-b border-border/50">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-1">Email Address</Text>
                                <View className="flex-row items-center gap-2">
                                    <Mail size={14} color="#888" />
                                    <Text className="text-foreground/50 text-sm">{user.email}</Text>
                                </View>
                                <Text className="text-[9px] text-muted-foreground mt-1">Email cannot be changed</Text>
                            </View>
                            <View className="p-4">
                                <Text className="text-[10px] text-muted-foreground uppercase mb-1">Professional Title</Text>
                                <TextInput
                                    className="text-foreground text-sm font-bold"
                                    value={user.role}
                                    onChangeText={(text) => setUser(prev => ({ ...prev, role: text }))}
                                    placeholder="e.g. Agency Director"
                                    placeholderTextColor="#888"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Additional Info */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Additional Details</Text>
                        <View className="bg-card border border-border rounded-2xl p-4">
                            <Text className="text-[10px] text-muted-foreground uppercase mb-1">Company</Text>
                            <TextInput
                                className="text-foreground text-sm font-bold"
                                value={user.contactCard.company}
                                onChangeText={(text) => setUser(prev => ({
                                    ...prev,
                                    contactCard: { ...prev.contactCard, company: text }
                                }))}
                                placeholder="Your company name"
                                placeholderTextColor="#888"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
