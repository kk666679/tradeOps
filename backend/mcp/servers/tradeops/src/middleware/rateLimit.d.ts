export interface RateLimitOptions {
    key: string;
    perMinute: number;
}
export declare function rateLimit({ key, perMinute }: RateLimitOptions): void;
