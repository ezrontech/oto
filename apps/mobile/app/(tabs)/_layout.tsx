import { Tabs } from "expo-router";
import { MessageSquare, Settings, User, LayoutDashboard, Briefcase, Bot, Box, Layers, FlaskConical, FileText } from "lucide-react-native";
import { useColorScheme, View } from "react-native";
import { BlurView } from "expo-blur"; // Note: Requires install, or fallback to View with opacity

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const iconColor = isDark ? "#fafafa" : "#0a0a0a";

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
                },
                headerTitleStyle: {
                    color: iconColor,
                },
                tabBarActiveTintColor: iconColor,
                tabBarInactiveTintColor: "#888",
                tabBarStyle: {
                    backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
                    borderTopColor: isDark ? "#262626" : "#e5e5e5",
                    elevation: 0,
                    shadowOpacity: 0,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "MyHub",
                    tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="contacts"
                options={{
                    title: "Contacts",
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="spaces"
                options={{
                    title: "Spaces",
                    tabBarIcon: ({ color }) => <Layers size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="articles"
                options={{
                    title: "Articles",
                    tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Conversations",
                    tabBarIcon: ({ color }) => <Bot size={24} color={color} />,
                    tabBarLabel: "Conversations",
                }}
            />
            <Tabs.Screen
                name="tools"
                options={{
                    title: "Labs",
                    tabBarIcon: ({ color }) => <FlaskConical size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    href: null,
                    tabBarButton: () => null,
                }}
            />
        </Tabs>
    );
}
