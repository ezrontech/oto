"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@oto/ui";
import { InteractiveChart } from "@/components/InteractiveChart";

export type AnalyticsMetric = {
    id: string;
    title: string;
    description: string;
    color: string;
    series: Array<{ date: string; value: number }>;
    totalLabel: string;
    totalValue: string;
};

export function AnalyticsDrilldownSheet({
    metric,
    onClose
}: {
    metric: AnalyticsMetric | null;
    onClose: () => void;
}) {
    return (
        <Sheet open={!!metric} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="sm:max-w-[520px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-left">
                            <SheetTitle className="text-xl font-bold">{metric?.title}</SheetTitle>
                            <SheetDescription className="text-sm">{metric?.description}</SheetDescription>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold whitespace-nowrap">
                            {metric?.totalLabel}: {metric?.totalValue}
                        </Badge>
                    </div>
                </SheetHeader>

                {metric && (
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold">7-Day Trend</CardTitle>
                                <CardDescription>Detailed view of the selected metric over the last week.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-56">
                                    <InteractiveChart
                                        data={metric.series}
                                        variant="detailed"
                                        color={metric.color}
                                        height="224px"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Daily Breakdown</p>
                                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">Last 7 days</Badge>
                            </div>
                            <div className="rounded-xl border border-border/50 bg-card/40">
                                {metric.series.map((p, idx) => (
                                    <div key={p.date} className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">{p.date}</span>
                                            <span className="text-sm font-black" style={{ color: metric.color }}>
                                                {p.value.toLocaleString()}
                                            </span>
                                        </div>
                                        {idx !== metric.series.length - 1 && (
                                            <div className="mt-3 border-b border-border/50" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Next</p>
                            <Button className="w-full rounded-xl" onClick={onClose}>
                                Back
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
