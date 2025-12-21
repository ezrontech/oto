import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Save,
    Globe,
    Briefcase,
    Lock,
    Plus,
    Trash2,
    Link as LinkIcon
} from 'lucide-react-native';
import { useState } from 'react';
import { MOCK_CURRENT_USER } from '../../data/mock';

export default function EditContactCardScreen() {
    const router = useRouter();
    const [user, setUser] = useState(MOCK_CURRENT_USER);

    const handleVisibilityChange = (visibility: "public" | "private" | "professional") => {
        setUser(prev => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                visibility
            }
        }));
    };

    const handleAddLink = () => {
        setUser(prev => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                links: [...prev.contactCard.links, { platform: "Website", url: "" }]
            }
        }));
    };

    const handleRemoveLink = (index: number) => {
        setUser(prev => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                links: prev.contactCard.links.filter((_, i) => i !== index)
            }
        }));
    };

    const handleLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
        const newLinks = [...user.contactCard.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setUser(prev => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                links: newLinks
            }
        }));
    };

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'My Contact Card',
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
                    {/* Visibility */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Card Visibility</Text>
                        <View className="flex-row gap-2">
                            <VisibilityOption
                                active={user.contactCard.visibility === 'public'}
                                onPress={() => handleVisibilityChange('public')}
                                icon={<Globe size={18} color={user.contactCard.visibility === 'public' ? '#fff' : '#888'} />}
                                label="Public"
                            />
                            <VisibilityOption
                                active={user.contactCard.visibility === 'professional'}
                                onPress={() => handleVisibilityChange('professional')}
                                icon={<Briefcase size={18} color={user.contactCard.visibility === 'professional' ? '#fff' : '#888'} />}
                                label="Professional"
                            />
                            <VisibilityOption
                                active={user.contactCard.visibility === 'private'}
                                onPress={() => handleVisibilityChange('private')}
                                icon={<Lock size={18} color={user.contactCard.visibility === 'private' ? '#fff' : '#888'} />}
                                label="Private"
                            />
                        </View>
                    </View>

                    {/* Bio */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Bio / Tagline</Text>
                        <View className="bg-card border border-border rounded-2xl p-4">
                            <TextInput
                                className="text-foreground text-sm min-h-[100px]"
                                multiline
                                placeholder="Write a brief bio..."
                                placeholderTextColor="#888"
                                value={user.contactCard.bio}
                                onChangeText={(text) => setUser(prev => ({
                                    ...prev,
                                    contactCard: { ...prev.contactCard, bio: text }
                                }))}
                                style={{ textAlignVertical: 'top' }}
                            />
                        </View>
                    </View>

                    {/* Links */}
                    <View>
                        <View className="flex-row justify-between items-center mb-3 px-1">
                            <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Social Links</Text>
                            <TouchableOpacity onPress={handleAddLink} className="flex-row items-center gap-1">
                                <Plus size={14} color="#6366f1" />
                                <Text className="text-primary text-[10px] font-bold">ADD LINK</Text>
                            </TouchableOpacity>
                        </View>
                        {user.contactCard.links.length === 0 && (
                            <View className="bg-muted/30 p-4 rounded-2xl mb-3">
                                <Text className="text-xs text-muted-foreground text-center mb-3">Popular platforms:</Text>
                                <View className="flex-row flex-wrap gap-2 justify-center">
                                    {['LinkedIn', 'Twitter', 'GitHub', 'Instagram', 'Website'].map((platform) => (
                                        <TouchableOpacity
                                            key={platform}
                                            onPress={() => {
                                                setUser(prev => ({
                                                    ...prev,
                                                    contactCard: {
                                                        ...prev.contactCard,
                                                        links: [...prev.contactCard.links, { platform, url: '' }]
                                                    }
                                                }));
                                            }}
                                            className="bg-card border border-border px-3 py-1.5 rounded-full"
                                        >
                                            <Text className="text-[10px] font-bold text-foreground">{platform}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                        <View className="gap-3">
                            {user.contactCard.links.map((link, index) => (
                                <View key={index} className="bg-card border border-border rounded-2xl p-4 flex-row gap-3 items-center">
                                    <View className="w-20 border-r border-border pr-3">
                                        <TextInput
                                            className="text-foreground text-xs font-bold"
                                            value={link.platform}
                                            onChangeText={(t) => handleLinkChange(index, 'platform', t)}
                                            placeholder="Platform"
                                            placeholderTextColor="#888"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <TextInput
                                            className="text-primary text-xs"
                                            value={link.url}
                                            onChangeText={(t) => handleLinkChange(index, 'url', t)}
                                            placeholder="https://..."
                                            placeholderTextColor="#888"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => handleRemoveLink(index)}>
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function VisibilityOption({ active, onPress, icon, label }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 p-4 rounded-2xl border-2 items-center gap-2 ${active ? 'bg-primary border-primary' : 'bg-card border-border'}`}
        >
            {icon}
            <Text className={`text-[10px] font-bold ${active ? 'text-white' : 'text-muted-foreground'}`}>{label}</Text>
        </TouchableOpacity>
    );
}
