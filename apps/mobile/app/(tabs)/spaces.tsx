import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MOCK_SPACES } from '../../data/mock';
import { Briefcase, Users, Globe, ChevronRight, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SpacesScreen() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-background p-4">
            <View className="mb-6 flex-row justify-between items-center">
                <View>
                    <Text className="text-2xl font-bold text-foreground">Spaces</Text>
                    <Text className="text-muted-foreground">Team, Community, & Club</Text>
                </View>
                <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg">
                    <Text className="text-primary-foreground font-bold text-xs">+ Create</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs (Visual Only for proto) */}
            <View className="flex-row gap-2 mb-6">
                <View className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                    <Text className="text-primary font-medium text-xs">All</Text>
                </View>
                <View className="bg-secondary px-4 py-2 rounded-full border border-border">
                    <Text className="text-muted-foreground font-medium text-xs">Team</Text>
                </View>
                <View className="bg-secondary px-4 py-2 rounded-full border border-border">
                    <Text className="text-muted-foreground font-medium text-xs">Community</Text>
                </View>
                <View className="bg-secondary px-4 py-2 rounded-full border border-border">
                    <Text className="text-muted-foreground font-medium text-xs">Club</Text>
                </View>
            </View>

            <View className="gap-4 pb-12">
                {MOCK_SPACES.map((space) => {
                    let Icon = Briefcase;
                    if (space.type === "Community") Icon = Globe;
                    if (space.type === "Club") Icon = Home;

                    return (
                        <TouchableOpacity
                            key={space.id}
                            className="bg-card border border-border rounded-xl p-4"
                            onPress={() => router.push(`/spaces/${space.id}`)}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="h-10 w-10 rounded-lg bg-secondary items-center justify-center">
                                    <Icon size={20} color="#000" />
                                </View>
                                <View className="bg-secondary px-2 py-0.5 rounded">
                                    <Text className="text-[10px] text-muted-foreground uppercase">{space.type}</Text>
                                </View>
                            </View>

                            <Text className="text-lg font-bold text-foreground mb-1">{space.name}</Text>
                            <Text className="text-sm text-muted-foreground mb-4">{space.description}</Text>

                            <View className="flex-row items-center justify-between border-t border-border/50 pt-3">
                                <View className="flex-row items-center gap-1">
                                    <Users size={12} color="#888" />
                                    <Text className="text-xs text-muted-foreground">{space.members} Members</Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-xs font-bold text-primary">Open</Text>
                                    <ChevronRight size={12} color="#6366f1" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}
