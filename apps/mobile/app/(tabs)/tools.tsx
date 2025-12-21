import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MessageSquare, Mail, Calendar, PenTool, Phone } from 'lucide-react-native';

const TOOLS = [
    { id: 1, name: "WhatsApp Business", description: "Unified chat & automated responses.", icon: MessageSquare, connected: true, tag: "Essential", type: "Integration" },
    { id: 2, name: "Gmail", description: "Email automation and triage.", icon: Mail, connected: true, tag: "Essential", type: "Integration" },
    { id: 3, name: "Oto Mail", description: "Native email marketing.", icon: Mail, connected: true, tag: "Marketing", type: "Native" },
    { id: 4, name: "Oto Bookings", description: "Appointment scheduling.", icon: Calendar, connected: true, tag: "Productivity", type: "Native" },
    { id: 5, name: "Canva", description: "Design asset generation.", icon: PenTool, connected: false, tag: "Design", type: "Integration" },
    { id: 6, name: "Twilio Voice", description: "Interactive Voice Response.", icon: Phone, connected: false, tag: "Voice", type: "Integration" },
];

export default function ToolsScreen() {
    return (
        <ScrollView className="flex-1 bg-background p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold text-foreground">Tools</Text>
                <Text className="text-muted-foreground">Native & Integrations</Text>
            </View>

            <View className="gap-4">
                {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <View key={tool.id} className="bg-card border border-border rounded-xl p-4 flex-row gap-4">
                            <View className="h-12 w-12 rounded-xl bg-secondary items-center justify-center">
                                <Icon size={24} color="#000" />
                            </View>
                            <View className="flex-1 justify-between">
                                <View>
                                    <View className="flex-row justify-between items-start">
                                        <Text className="text-base font-bold text-foreground">{tool.name}</Text>
                                        <View className={`px-2 py-0.5 rounded border ${tool.type === 'Native' ? 'bg-primary border-primary' : 'bg-transparent border-input'}`}>
                                            <Text className={`text-[10px] ${tool.type === 'Native' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                                {tool.type === 'Native' ? 'Built-in' : 'Integration'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-xs text-muted-foreground mt-1">{tool.description}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}
