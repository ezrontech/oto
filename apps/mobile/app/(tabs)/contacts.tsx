import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MOCK_CONTACTS } from '../../data/mock';
import { Mail, Phone, MoreHorizontal, Search, Plus, Filter, Tag, Users, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ContactsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('All');

    const filteredContacts = filter === 'All'
        ? MOCK_CONTACTS
        : MOCK_CONTACTS.filter(c => c.status === filter);

    return (
        <View className="flex-1 bg-background">
            <View className="p-4 pb-2 border-b border-border bg-background">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-foreground">Oto CRM</Text>
                        <Text className="text-muted-foreground text-xs">Manage your relationships</Text>
                    </View>
                    <TouchableOpacity className="bg-primary p-2 rounded-lg">
                        <Plus size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-muted/50 rounded-xl px-3 py-2 mb-4 border border-border">
                    <Search size={18} color="#888" />
                    <TextInput
                        placeholder="Search contacts..."
                        className="flex-1 ml-2 text-sm text-foreground"
                        placeholderTextColor="#888"
                    />
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 mb-4">
                    {['All', 'Client', 'Customer', 'Lead'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full border ${filter === cat ? 'bg-primary border-primary' : 'bg-secondary border-border'}`}
                        >
                            <Text className={`text-[11px] font-bold ${filter === cat ? 'text-white' : 'text-muted-foreground'}`}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity className="px-4 py-1.5 rounded-full border border-dashed border-primary flex-row items-center gap-1">
                        <Tag size={12} color="#6366f1" />
                        <Text className="text-[11px] font-bold text-primary">Segments</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <FlatList
                data={filteredContacts}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-card border border-border rounded-2xl p-4 shadow-sm"
                        onPress={() => router.push(`/contacts/${item.id}`)}
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
                                    <Text className="font-bold text-primary">{item.name.charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text className="text-base font-bold text-foreground">{item.name}</Text>
                                    <View className="flex-row items-center gap-1.5 mt-0.5">
                                        <View className={`px-2 py-0.5 rounded ${item.status === 'Client' ? 'bg-primary/10' : 'bg-secondary'}`}>
                                            <Text className={`text-[10px] font-bold uppercase ${item.status === 'Client' ? 'text-primary' : 'text-muted-foreground'}`}>{item.status}</Text>
                                        </View>
                                        <Text className="text-[10px] text-muted-foreground">• {item.tags?.[0] || 'Uncategorized'}</Text>
                                    </View>
                                </View>
                            </View>
                            <ChevronRight size={16} color="#888" />
                        </View>

                        <View className="border-t border-border/50 mt-3 pt-3 flex-row justify-between items-center">
                            <View className="flex-row gap-1 items-center">
                                <Phone size={12} color="#888" />
                                <Text className="text-[10px] text-muted-foreground">{item.phone}</Text>
                            </View>
                            <View className="bg-secondary px-2 py-1 rounded flex-row items-center gap-1">
                                <Users size={12} color="#666" />
                                <Text className="text-[10px] font-bold text-muted-foreground">Oto Handled</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View className="py-20 items-center">
                        <Text className="text-muted-foreground italic">No contacts found in this segment.</Text>
                    </View>
                )}
            />
        </View>
    );
}
