import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MOCK_CONVERSATIONS } from '../../data/mock';
import { Send, Bot, User, Paperclip, Instagram, Facebook, MessageSquare, Search, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

export default function ChatScreen() {
    const [selectedConvId, setSelectedConvId] = useState(MOCK_CONVERSATIONS[0].id);
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [input, setInput] = useState("");

    const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = {
            id: Date.now(),
            role: "owner",
            sender: "Owner",
            content: input,
            timestamp: "Now"
        };

        setConversations(prev => prev.map(conv =>
            conv.id === selectedConvId
                ? { ...conv, messages: [...conv.messages, newMsg] }
                : conv
        ));
        setInput("");

        // Mock Agent Reply
        setTimeout(() => {
            const agentMsg = {
                id: Date.now() + 1,
                role: "agent",
                sender: "Agent",
                content: "Noted. I'll monitor for a reply.",
                timestamp: "Now"
            };
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConvId
                    ? { ...conv, messages: [...conv.messages, agentMsg] }
                    : conv
            ));
        }, 1000);
    }

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "Instagram": return <Instagram size={12} color="#db2777" />;
            case "Facebook": return <Facebook size={12} color="#2563eb" />;
            default: return <MessageSquare size={12} color="#16a34a" />;
        }
    };

    return (
        <View className="flex-1 bg-background">
            {/* Conversation Selector Horizontal */}
            <View className="bg-card border-b border-border py-3">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 gap-4 flex-row">
                    {conversations.map(conv => (
                        <TouchableOpacity
                            key={conv.id}
                            onPress={() => setSelectedConvId(conv.id)}
                            className={`items-center gap-1 px-1 ${selectedConvId === conv.id ? 'opacity-100' : 'opacity-50'}`}
                        >
                            <View className="relative">
                                <View className={`h-12 w-12 rounded-full border-2 items-center justify-center bg-secondary ${selectedConvId === conv.id ? 'border-primary' : 'border-transparent'}`}>
                                    <Text className="font-bold text-xs">{conv.contact.charAt(0)}</Text>
                                </View>
                                <View className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
                                    {getChannelIcon(conv.channel)}
                                </View>
                            </View>
                            <Text className="text-[9px] font-bold text-foreground" numberOfLines={1}>{conv.contact.split(' ')[0]}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={activeConv.messages}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 16, gap: 20 }}
                    renderItem={({ item }) => {
                        const isOwner = item.role === 'owner';
                        const isAgent = item.role === 'agent';
                        const isUser = item.role === 'user';

                        return (
                            <View className={`flex-row gap-3 ${(isOwner || isAgent) ? 'flex-row-reverse' : ''}`}>
                                <View className={`h-8 w-8 rounded-full items-center justify-center ${isOwner ? 'bg-primary' : isAgent ? 'bg-purple-600' : 'bg-secondary'}`}>
                                    {isOwner ? <User size={16} color="#fff" /> : isAgent ? <Bot size={16} color="#fff" /> : <Text className="font-bold text-[10px]">{activeConv.contact.charAt(0)}</Text>}
                                </View>
                                <View className={`p-4 rounded-2xl max-w-[80%] ${(isOwner || isAgent) ? 'rounded-tr-none' : 'rounded-tl-none'} ${isOwner ? 'bg-primary' : isAgent ? 'bg-purple-50 border border-purple-200' : 'bg-card border border-border'}`}>
                                    <View className={`flex-row items-center gap-2 mb-1 ${isOwner || isAgent ? 'justify-end' : ''}`}>
                                        <Text className={`text-[10px] font-bold ${isOwner ? 'text-white/80' : isAgent ? 'text-purple-600' : 'text-muted-foreground'}`}>
                                            {item.sender}
                                        </Text>
                                        {isOwner && <View className="bg-white/20 px-1 rounded"><Text className="text-[7px] text-white font-black">OWNER</Text></View>}
                                        {isAgent && <View className="bg-purple-600 px-1 rounded"><Text className="text-[7px] text-white font-black">AGENT</Text></View>}
                                    </View>
                                    <Text className={`text-sm ${isOwner ? 'text-white' : isAgent ? 'text-purple-900' : 'text-foreground'}`}>
                                        {item.content}
                                    </Text>
                                    <View className={`mt-2 ${(isOwner || isAgent) ? 'items-end' : 'items-start'}`}>
                                        <Text className={`text-[9px] opacity-50 ${isOwner ? 'text-white' : 'text-muted-foreground'}`}>{item.timestamp}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                />

                <View className="p-4 border-t border-border bg-background flex-row items-center gap-3">
                    <TouchableOpacity className="p-2">
                        <Paperclip size={20} color="#888" />
                    </TouchableOpacity>
                    <View className="flex-1 bg-secondary rounded-2xl px-4 py-3 flex-row items-center border border-border/50">
                        <TextInput
                            placeholder={`Reply as Owner...`}
                            className="flex-1 text-foreground text-sm"
                            placeholderTextColor="#888"
                            multiline
                            value={input}
                            onChangeText={setInput}
                        />
                    </View>
                    <TouchableOpacity
                        className={`h-11 w-11 rounded-full items-center justify-center shadow-lg shadow-primary/20 ${input.trim() ? 'bg-primary' : 'bg-muted'}`}
                        onPress={handleSend}
                        disabled={!input.trim()}
                    >
                        <Send size={20} color={input.trim() ? "#fff" : "#888"} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
