export type DataPoint = { date: string; value: number };

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function allocateInts(total: number, weights: number[]): number[] {
    const raw = weights.map((w) => w * total);
    const floored = raw.map((v) => Math.floor(v));
    let remaining = total - floored.reduce((a, b) => a + b, 0);

    const order = raw
        .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
        .sort((a, b) => b.frac - a.frac)
        .map((x) => x.idx);

    let i = 0;
    while (remaining > 0) {
        floored[order[i % order.length]] += 1;
        remaining -= 1;
        i += 1;
    }

    return floored;
}

function allocateFloats(total: number, weights: number[], decimals: number): number[] {
    const factor = Math.pow(10, decimals);
    const scaledTotal = Math.round(total * factor);

    const raw = weights.map((w) => w * scaledTotal);
    const floored = raw.map((v) => Math.floor(v));
    let remaining = scaledTotal - floored.reduce((a, b) => a + b, 0);

    const order = raw
        .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
        .sort((a, b) => b.frac - a.frac)
        .map((x) => x.idx);

    let i = 0;
    while (remaining > 0) {
        floored[order[i % order.length]] += 1;
        remaining -= 1;
        i += 1;
    }

    return floored.map((v) => v / factor);
}

export function generateWeeklyIntSeries(total: number, weights?: number[]): DataPoint[] {
    const w = weights ?? [0.12, 0.14, 0.16, 0.15, 0.18, 0.14, 0.11];
    const values = allocateInts(total, w);
    return WEEK_DAYS.map((d, idx) => ({ date: d, value: values[idx] }));
}

export function generateWeeklyFloatSeries(total: number, decimals = 1, weights?: number[]): DataPoint[] {
    const w = weights ?? [0.08, 0.1, 0.13, 0.14, 0.18, 0.2, 0.17];
    const values = allocateFloats(total, w, decimals);
    return WEEK_DAYS.map((d, idx) => ({ date: d, value: values[idx] }));
}

export function generateEfficiencyIndexSeries(efficiencyGainPercent: number): DataPoint[] {
    const base = 100;
    const curve = [0.55, 0.62, 0.7, 0.78, 0.92, 0.88, 0.8];
    return WEEK_DAYS.map((d, idx) => {
        const value = Math.round((base + efficiencyGainPercent * curve[idx]) * 10) / 10;
        return { date: d, value };
    });
}

export function getPeakDay(series: DataPoint[]): DataPoint {
    return series.reduce((best, p) => (p.value > best.value ? p : best), series[0]);
}

export function getAverage(series: DataPoint[]): number {
    if (series.length === 0) return 0;
    return series.reduce((a, b) => a + b.value, 0) / series.length;
}
