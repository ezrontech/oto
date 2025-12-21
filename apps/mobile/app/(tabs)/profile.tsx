import { View, Text, Switch } from "react-native";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { User, Settings, Shield } from "lucide-react-native";

export default function ProfileScreen() {
    return (
        <View className="flex-1 bg-background p-4 gap-4">
            <Card className="flex-row items-center gap-4">
                <View className="h-16 w-16 rounded-full bg-primary/10 items-center justify-center">
                    <User size={32} color="black" />
                </View>
                <View>
                    <Text className="text-lg font-bold text-foreground">Ezron</Text>
                    <Text className="text-sm text-muted-foreground">Founder Workspace</Text>
                    <View className="flex-row mt-2">
                        <Badge label="Pro Plan" />
                    </View>
                </View>
            </Card>

            <Text className="text-sm font-semibold text-muted-foreground uppercase mt-4 mb-2">Settings</Text>

            <Card className="gap-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <Settings size={20} color="#666" />
                        <Text className="text-foreground">General</Text>
                    </View>
                    <Text className="text-muted-foreground">{">"}</Text>
                </View>
                <View className="h-[1px] bg-border/50" />
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <Shield size={20} color="#666" />
                        <Text className="text-foreground">Privacy</Text>
                    </View>
                    <Text className="text-muted-foreground">{">"}</Text>
                </View>
            </Card>

            <Card className="mt-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-foreground">Dark Mode</Text>
                    <Switch />
                </View>
            </Card>
        </View>
    );
}
