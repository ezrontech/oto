import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MOCK_TASKS, MOCK_EVENTS } from '../../data/mock';
import { CheckSquare, Calendar, Users, Briefcase } from 'lucide-react-native';

export default function WorkspaceScreen() {
    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
            <View className="mb-6">
                <Text className="text-2xl font-bold text-foreground">WorkSpace</Text>
                <Text className="text-muted-foreground">Projects & Tasks</Text>
            </View>

            {/* Quick Stats / Tabs Placeholder */}
            <View className="flex-row gap-2 mb-6">
                <View className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                    <Text className="text-primary font-medium text-xs">Tasks</Text>
                </View>
                <View className="bg-secondary px-4 py-2 rounded-full border border-border">
                    <Text className="text-muted-foreground font-medium text-xs">Calendar</Text>
                </View>
            </View>

            {/* Tasks Section */}
            <Text className="text-lg font-bold text-foreground mb-3">Active Tasks</Text>
            <View className="gap-3 mb-8">
                {MOCK_TASKS.map((task) => (
                    <View key={task.id} className="bg-card border border-border rounded-xl p-4">
                        <View className="flex-row items-center gap-3">
                            <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
                                <CheckSquare size={16} color="#000" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-foreground">{task.title}</Text>
                                <Text className="text-xs text-muted-foreground mt-0.5">{task.client} • {task.due}</Text>
                            </View>
                            <View className="bg-secondary px-2 py-1 rounded">
                                <Text className="text-[10px] text-muted-foreground">{task.status}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Calendar Section */}
            <Text className="text-lg font-bold text-foreground mb-3">Upcoming Events</Text>
            <View className="gap-3">
                {MOCK_EVENTS.map((event) => (
                    <View key={event.id} className="bg-card border-l-4 border-l-primary border border-t-border border-r-border border-b-border rounded-r-xl p-4">
                        <Text className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{event.type}</Text>
                        <Text className="text-sm font-semibold text-foreground mb-1">{event.title}</Text>
                        <View className="flex-row items-center gap-2">
                            <Calendar size={12} color="#888" />
                            <Text className="text-xs text-muted-foreground">{event.date} • {event.time}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
