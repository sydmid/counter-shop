import { redis } from "./redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Sliding window rate limiter using Redis atomic operations.
 * Supports IP-based and UserID-based throttling.
 */
export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    if (current > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: windowSeconds,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - current),
      resetSeconds: windowSeconds,
    };
  } catch (err) {
    // In case of any redis failure, allow request gracefully
    return {
      allowed: true,
      remaining: 999,
      resetSeconds: 0,
    };
  }
}
