import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Globe,
    Briefcase,
    Lock,
    Plus,
    Trash2,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Github,
    MessageCircle, // For WhatsApp
} from 'lucide-react-native';
import { useState } from 'react';
import { MOCK_CURRENT_USER } from '../../data/mock';

const PLATFORM_ICONS: Record<string, any> = {
    LinkedIn: <Linkedin size={14} color="#0a66c2" />,
    Twitter: <Twitter size={14} color="#1da1f2" />,
    Github: <Github size={14} color="#333" />,
    GitHub: <Github size={14} color="#333" />,
    Instagram: <Instagram size={14} color="#e4405f" />,
    Facebook: <Facebook size={14} color="#1877f2" />,
    WhatsApp: <MessageCircle size={14} color="#25d366" />,
    Website: <Globe size={14} color="#6366f1" />,
};

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

    const handleAddLink = (platform: string = "Website") => {
        setUser(prev => ({
            ...prev,
            contactCard: {
                ...prev.contactCard,
                links: [...prev.contactCard.links, { platform, url: "" }]
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
                title: 'Professional Card',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.back()} className="mr-2">
                        <Text className="text-primary font-bold uppercase tracking-widest text-[10px]">Save</Text>
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-8 pb-32">
                    {/* Visibility */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-1">Card Visibility</Text>
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
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-1">Bio / Tagline</Text>
                        <View className="bg-card border border-border/60 rounded-[24px] p-5 shadow-sm shadow-black/5">
                            <TextInput
                                className="text-foreground text-sm min-h-[120px] font-medium leading-relaxed"
                                multiline
                                placeholder="Write a brief professional summary..."
                                placeholderTextColor="#999"
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
                        <View className="flex-row justify-between items-center mb-4 px-1">
                            <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Social Connections</Text>
                            <TouchableOpacity onPress={() => handleAddLink()} className="flex-row items-center gap-1">
                                <Plus size={14} color="#6366f1" />
                                <Text className="text-primary text-[10px] font-bold tracking-widest">ADD NEW</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-muted/20 p-4 rounded-[24px] mb-6">
                            <Text className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest text-center mb-4">Quick Add</Text>
                            <View className="flex-row flex-wrap gap-2 justify-center">
                                {Object.keys(PLATFORM_ICONS).filter(k => k !== "Website").map((platform) => (
                                    <TouchableOpacity
                                        key={platform}
                                        onPress={() => handleAddLink(platform)}
                                        className="bg-card border border-border/40 px-3 py-2 rounded-full flex-row items-center gap-2"
                                    >
                                        {PLATFORM_ICONS[platform]}
                                        <Text className="text-[9px] font-bold text-foreground">{platform}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="gap-4">
                            {user.contactCard.links.map((link, index) => (
                                <View key={index} className="bg-card border border-border/60 rounded-[20px] p-4 flex-row gap-4 items-center shadow-sm shadow-black/5">
                                    <View className="h-10 w-10 bg-muted/30 rounded-xl items-center justify-center">
                                        {PLATFORM_ICONS[link.platform] || <Globe size={18} color="#888" />}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">{link.platform}</Text>
                                        <TextInput
                                            className="text-primary text-xs font-semibold"
                                            value={link.url}
                                            onChangeText={(t) => handleLinkChange(index, 'url', t)}
                                            placeholder="https://..."
                                            placeholderTextColor="#bbb"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => handleRemoveLink(index)} className="p-2">
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
            className={`flex-1 p-5 rounded-[24px] border-2 items-center gap-3 transition-all ${active ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-card border-border/60 shadow-sm shadow-black/5'}`}
        >
            <View className={active ? 'opacity-100' : 'opacity-40'}>
                {icon}
            </View>
            <Text className={`text-[10px] font-bold tracking-widest uppercase ${active ? 'text-white' : 'text-muted-foreground'}`}>{label}</Text>
        </TouchableOpacity>
    );
}
