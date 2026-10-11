declare class MetricRegistry {
    private counters;
    private histograms;
    counter(name: string, help: string, labels?: Record<string, string>): void;
    observe(name: string, help: string, value: number, buckets?: number[]): void;
    render(): string;
}
export declare const metrics: MetricRegistry;
export {};
