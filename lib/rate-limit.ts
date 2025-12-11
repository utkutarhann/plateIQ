type RateLimitStore = Map<string, { count: number; lastReset: number }>;

const store: RateLimitStore = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

export function rateLimit(ip: string): boolean {
    const now = Date.now();
    const record = store.get(ip);

    if (!record) {
        store.set(ip, { count: 1, lastReset: now });
        return true;
    }

    if (now - record.lastReset > WINDOW_MS) {
        store.set(ip, { count: 1, lastReset: now });
        return true;
    }

    if (record.count >= MAX_REQUESTS) {
        return false;
    }

    record.count += 1;
    return true;
}
