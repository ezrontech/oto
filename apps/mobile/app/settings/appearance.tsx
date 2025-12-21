import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Sun,
    Moon,
    Laptop,
    Check,
    Type,
    Palette
} from 'lucide-react-native';
import { useState } from 'react';

export default function AppearanceScreen() {
    const router = useRouter();
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [accentColor, setAccentColor] = useState('#6366f1');

    const accentColors = [
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Teal', value: '#14b8a6' },
    ];

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Appearance',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} className="ml-2">
                        <ChevronLeft size={24} color="#6366f1" />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView className="flex-1 p-4">
                <View className="gap-6 pb-20">
                    {/* Theme */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Theme</Text>
                        <View className="gap-3">
                            <ThemeOption
                                active={theme === 'light'}
                                onPress={() => setTheme('light')}
                                icon={<Sun size={20} color={theme === 'light' ? '#fff' : '#888'} />}
                                label="Light"
                                description="Bright and clean"
                            />
                            <ThemeOption
                                active={theme === 'dark'}
                                onPress={() => setTheme('dark')}
                                icon={<Moon size={20} color={theme === 'dark' ? '#fff' : '#888'} />}
                                label="Dark"
                                description="Easy on the eyes"
                            />
                            <ThemeOption
                                active={theme === 'system'}
                                onPress={() => setTheme('system')}
                                icon={<Laptop size={20} color={theme === 'system' ? '#fff' : '#888'} />}
                                label="System"
                                description="Match device settings"
                            />
                        </View>
                    </View>

                    {/* Accent Color */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Accent Color</Text>
                        <View className="bg-card border border-border rounded-2xl p-4">
                            <View className="flex-row flex-wrap gap-3">
                                {accentColors.map((color) => (
                                    <TouchableOpacity
                                        key={color.value}
                                        onPress={() => setAccentColor(color.value)}
                                        className="items-center gap-1"
                                    >
                                        <View
                                            className="h-12 w-12 rounded-full items-center justify-center border-2"
                                            style={{
                                                backgroundColor: color.value,
                                                borderColor: accentColor === color.value ? color.value : 'transparent'
                                            }}
                                        >
                                            {accentColor === color.value && (
                                                <Check size={20} color="#fff" strokeWidth={3} />
                                            )}
                                        </View>
                                        <Text className="text-[9px] text-muted-foreground">{color.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Font Size */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Text Size</Text>
                        <View className="bg-card border border-border rounded-2xl overflow-hidden">
                            <TouchableOpacity
                                onPress={() => setFontSize('small')}
                                className={`p-4 border-b border-border/50 flex-row items-center justify-between ${fontSize === 'small' ? 'bg-primary/5' : ''}`}
                            >
                                <View className="flex-row items-center gap-3">
                                    <Type size={16} color={fontSize === 'small' ? '#6366f1' : '#888'} />
                                    <Text className={`text-xs ${fontSize === 'small' ? 'font-bold text-foreground' : 'text-foreground/70'}`}>
                                        Small
                                    </Text>
                                </View>
                                {fontSize === 'small' && <Check size={18} color="#6366f1" />}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setFontSize('medium')}
                                className={`p-4 border-b border-border/50 flex-row items-center justify-between ${fontSize === 'medium' ? 'bg-primary/5' : ''}`}
                            >
                                <View className="flex-row items-center gap-3">
                                    <Type size={18} color={fontSize === 'medium' ? '#6366f1' : '#888'} />
                                    <Text className={`text-sm ${fontSize === 'medium' ? 'font-bold text-foreground' : 'text-foreground/70'}`}>
                                        Medium
                                    </Text>
                                </View>
                                {fontSize === 'medium' && <Check size={18} color="#6366f1" />}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setFontSize('large')}
                                className={`p-4 flex-row items-center justify-between ${fontSize === 'large' ? 'bg-primary/5' : ''}`}
                            >
                                <View className="flex-row items-center gap-3">
                                    <Type size={20} color={fontSize === 'large' ? '#6366f1' : '#888'} />
                                    <Text className={`text-base ${fontSize === 'large' ? 'font-bold text-foreground' : 'text-foreground/70'}`}>
                                        Large
                                    </Text>
                                </View>
                                {fontSize === 'large' && <Check size={18} color="#6366f1" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Display Density */}
                    <View>
                        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Display Density</Text>
                        <View className="bg-card border border-border rounded-2xl p-4">
                            <Text className="text-xs text-muted-foreground">
                                Adjust spacing and padding throughout the app for a more compact or comfortable view.
                            </Text>
                            <View className="flex-row gap-2 mt-3">
                                <TouchableOpacity className="flex-1 p-3 border border-border rounded-xl items-center">
                                    <Text className="text-xs font-bold text-foreground">Compact</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 p-3 border-2 border-primary rounded-xl items-center bg-primary/5">
                                    <Text className="text-xs font-bold text-primary">Default</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 p-3 border border-border rounded-xl items-center">
                                    <Text className="text-xs font-bold text-foreground">Comfortable</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function ThemeOption({ active, onPress, icon, label, description }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`p-4 rounded-2xl border-2 flex-row items-center gap-3 ${active ? 'bg-primary border-primary' : 'bg-card border-border'}`}
        >
            <View className={`h-12 w-12 rounded-xl items-center justify-center ${active ? 'bg-white/20' : 'bg-muted'}`}>
                {icon}
            </View>
            <View className="flex-1">
                <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-foreground'}`}>{label}</Text>
                <Text className={`text-[10px] ${active ? 'text-white/70' : 'text-muted-foreground'}`}>{description}</Text>
            </View>
            {active && <Check size={20} color="#fff" strokeWidth={3} />}
        </TouchableOpacity>
    );
}
