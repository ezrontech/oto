import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MOCK_CONTACTS } from '../../data/mock';
import {
    Phone, Mail, MessageSquare, History, FileText, Sparkles,
    ChevronRight, MoreHorizontal, User, Tag, Plus, Send, Share2
} from 'lucide-react-native';
import { useState } from 'react';

export default function ContactDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const contact = MOCK_CONTACTS.find(c => c.id.toString() === id) || MOCK_CONTACTS[0];

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                title: "Contact Profile",
                headerRight: () => (
                    <TouchableOpacity className="mr-2"><MoreHorizontal size={20} color="#666" /></TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Profile */}
                <View className="items-center py-8 bg-card border-b border-border">
                    <View className="h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                        <Text className="text-3xl font-bold text-primary">{contact.name.charAt(0)}</Text>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">{contact.name}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                        <View className={`px-2 py-0.5 rounded ${contact.status === 'Client' ? 'bg-primary/20' : 'bg-secondary'}`}>
                            <Text className={`text-[10px] font-bold ${contact.status === 'Client' ? 'text-primary' : 'text-muted-foreground'} uppercase`}>{contact.status}</Text>
                        </View>
                        <Text className="text-muted-foreground text-xs">• {contact.email}</Text>
                    </View>

                    <View className="flex-row gap-4 mt-6 px-6">
                        <TouchableOpacity className="flex-1 bg-secondary p-3 rounded-xl items-center flex-row justify-center gap-2">
                            <Phone size={18} color="#666" />
                            <Text className="text-foreground font-bold text-xs">Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-secondary p-3 rounded-xl items-center flex-row justify-center gap-2">
                            <Mail size={18} color="#666" />
                            <Text className="text-foreground font-bold text-xs">Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-green-500 p-3 rounded-xl items-center flex-row justify-center gap-2 border border-green-600">
                            <MessageSquare size={18} color="#fff" />
                            <Text className="text-white font-bold text-xs">WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tags */}
                <View className="p-4 border-b border-border flex-row flex-wrap gap-2">
                    {contact.tags?.map((tag: any) => (
                        <View key={tag} className="bg-muted px-3 py-1 rounded-full border border-border">
                            <Text className="text-[10px] font-medium text-muted-foreground"># {tag}</Text>
                        </View>
                    ))}
                    <TouchableOpacity className="px-3 py-1 rounded-full border border-dashed border-primary">
                        <Text className="text-[10px] font-bold text-primary">+ Add Tag</Text>
                    </TouchableOpacity>
                </View>

                {/* Notes */}
                <View className="p-4 space-y-4">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                            <FileText size={16} color="#666" />
                            <Text className="text-sm font-bold text-foreground">Internal Notes</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-xs font-bold text-primary">+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="gap-3">
                        {contact.notes?.map((note: any) => (
                            <View key={note.id} className="bg-card border border-border rounded-xl p-3">
                                <Text className="text-sm text-foreground leading-relaxed">{note.content}</Text>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text className="text-[10px] font-bold text-primary uppercase italic">{note.author}</Text>
                                    <Text className="text-[10px] text-muted-foreground">{note.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Timeline */}
                <View className="p-4 space-y-4 mt-2">
                    <View className="flex-row items-center gap-2">
                        <History size={16} color="#666" />
                        <Text className="text-sm font-bold text-foreground">Timeline</Text>
                    </View>
                    <View className="space-y-4">
                        {contact.activity?.map((act: any) => (
                            <View key={act.id} className="flex-row gap-3">
                                <View className="w-1 bg-primary/20 rounded-full h-full absolute left-2 top-2" />
                                <View className="h-5 w-5 bg-background border-2 border-primary rounded-full z-10 items-center justify-center">
                                    <View className="h-1.5 w-1.5 bg-primary rounded-full" />
                                </View>
                                <View className="flex-1 pb-4">
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-bold text-foreground capitalize">{act.type}</Text>
                                        <Text className="text-[10px] text-muted-foreground font-bold">{act.date}</Text>
                                    </View>
                                    <Text className="text-xs text-muted-foreground mt-0.5">{act.summary}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Oto Insight */}
                <View className="mx-4 mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                    <View className="flex-row items-center gap-2 mb-2">
                        <Sparkles size={16} color="#6366f1" />
                        <Text className="text-[10px] font-bold text-primary uppercase">Agent Summary</Text>
                    </View>
                    <Text className="text-xs italic text-foreground leading-relaxed">
                        "I re-analyzed {contact.name}'s sentiment ({contact.sentiment}). They seem highly engaged with the scaling strategy. I suggest drafting a follow-up email tomorrow."
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
