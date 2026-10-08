import Redis from "ioredis";

import { env } from "../config/env";

export class RedisCacheService {
  private readonly client: Redis | null;

  constructor() {
    if (!env.REDIS_URL) {
      this.client = null;
      return;
    }

    this.client = new Redis(env.REDIS_URL, {
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy(attempt) {
        return Math.min(attempt * 200, 2000);
      },
    });

    this.client.on("error", (error) => {
      console.error("Redis connection error:", error.message);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      return null;
    }

    try {
      const value = await this.client.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error("Redis GET failed:", error);
      return null;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttlSeconds: number
  ): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      await this.client.set(
        key,
        JSON.stringify(value),
        "EX",
        ttlSeconds
      );
    } catch (error) {
      console.error("Redis SET failed:", error);
    }
  }

  async delete(...keys: string[]): Promise<void> {
    if (!this.client || keys.length === 0) {
      return;
    }

    try {
      await this.client.del(...keys);
    } catch (error) {
      console.error("Redis DEL failed:", error);
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      let cursor = "0";

      do {
        const [nextCursor, keys] =
          await this.client.scan(
            cursor,
            "MATCH",
            pattern,
            "COUNT",
            100
          );

        cursor = nextCursor;

        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== "0");
    } catch (error) {
      console.error("Redis cache invalidation failed:", error);
    }
  }
}

export const redisCache = new RedisCacheService();