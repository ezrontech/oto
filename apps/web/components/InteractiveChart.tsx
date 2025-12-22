"use client";

import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid
} from "recharts";

interface DataPoint {
    date: string;
    value: number;
}

interface InteractiveChartProps {
    data: DataPoint[];
    variant?: "sparkline" | "detailed";
    color?: string;
    height?: number | string;
}

export function InteractiveChart({
    data,
    variant = "sparkline",
    color = "#6366f1",
    height = "100%"
}: InteractiveChartProps) {

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/90 backdrop-blur-md border border-border/50 p-2 rounded-lg shadow-xl text-[10px] font-bold">
                    <p className="text-muted-foreground uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
                    <p style={{ color }}>{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    if (variant === "sparkline") {
        return (
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#gradient-${color})`}
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradient-detailed-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: color, strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#gradient-detailed-${color})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
