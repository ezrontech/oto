import { View, ViewProps } from 'react-native';

export function Card({ className, ...props }: ViewProps) {
    return (
        <View
            className={`rounded-xl border border-border/50 bg-card p-4 shadow-sm ${className}`}
            {...props}
        />
    );
}
