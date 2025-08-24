import { Injectable, Logger } from "@nestjs/common";
import { ThrottlerStorage } from "@nestjs/throttler";
import { ThrottlerStorageRecord } from "@nestjs/throttler/dist/throttler-storage-record.interface";
import Redis, { RedisOptions } from "ioredis";

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisThrottlerStorage.name);

  constructor(options: RedisOptions) {
    this.redis = new Redis(options);

    this.redis.on("connect", () =>
      this.logger.log("Connected to Redis for Throttler")
    );
    this.redis.on("error", (err) =>
      this.logger.error("Redis Throttler Error: " + err.message)
    );
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    const redisKey = `throttler:${throttlerName}:${key}`;
    const blockKey = `${redisKey}:blocked`;

    const isBlocked = await this.redis.exists(blockKey);
    if (isBlocked) {
      const blockTtl = await this.redis.ttl(blockKey);
      return {
        totalHits: limit + 1,
        timeToExpire: blockTtl,
        isBlocked: true,
        timeToBlockExpire: blockTtl,
      };
    }

    const current = await this.redis.incr(redisKey);
    if (current === 1) {
      await this.redis.expire(redisKey, ttl);
    }

    const ttlRemaining = await this.redis.ttl(redisKey);

    if (current > limit) {
      await this.redis.set(blockKey, 1, "EX", blockDuration);
      return {
        totalHits: current,
        timeToExpire: ttlRemaining,
        isBlocked: true,
        timeToBlockExpire: blockDuration,
      };
    }

    return {
      totalHits: current,
      timeToExpire: ttlRemaining,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
