import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
    label: string;
    variant?: 'default' | 'secondary' | 'outline';
}

export function Badge({ label, variant = 'default', className, ...props }: BadgeProps) {
    let bgClass = 'bg-primary';
    let textClass = 'text-primary-foreground';

    if (variant === 'secondary') {
        bgClass = 'bg-secondary';
        textClass = 'text-secondary-foreground';
    } else if (variant === 'outline') {
        bgClass = 'bg-transparent border border-border';
        textClass = 'text-foreground';
    }

    return (
        <View
            className={`self-start rounded-full px-2.5 py-0.5 ${bgClass} ${className}`}
            {...props}
        >
            <Text className={`text-xs font-medium ${textClass}`}>
                {label}
            </Text>
        </View>
    );
}
