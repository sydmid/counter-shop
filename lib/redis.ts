import Redis from "ioredis";

class MemoryCacheFallback {
  private store: Map<string, { val: string; expiresAt?: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.val;
  }

  async set(key: string, val: string, mode?: string, ttl?: number): Promise<string> {
    const expiresAt = ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { val, expiresAt });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const num = current ? parseInt(current, 10) + 1 : 1;
    this.store.set(key, { val: num.toString() });
    return num;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (item) {
      item.expiresAt = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }
}

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let redisClient: any;

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 2) {
        console.warn("⚠️ Redis unavailable, falling back to high-performance in-memory cache.");
        return null;
      }
      return Math.min(times * 100, 1000);
    },
    lazyConnect: true,
  });

  redisClient.on("error", (err: any) => {
    // Graceful silent fallback to memory cache if redis server is not running
  });
} catch (e) {
  redisClient = new MemoryCacheFallback();
}

export const redis = redisClient;
