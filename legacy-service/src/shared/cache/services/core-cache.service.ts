import { Inject, Injectable } from '@nestjs/common'
import { CacheableMemory } from 'cacheable'
import { RedisStore } from 'connect-redis'
import Keyv, { StoredDataNoRaw } from 'keyv'
import { AbstractCacheService, CACHE_PROVIDER } from '../cache.types'

@Injectable()
export class CoreCacheService extends AbstractCacheService {
  constructor(
    @Inject(CACHE_PROVIDER.CORE_REDIS_CACHE)
    private readonly redisCache: Keyv<RedisStore>,

    @Inject(CACHE_PROVIDER.CORE_MEMORY_CACHE)
    private readonly memoryCache: Keyv<CacheableMemory>,
  ) {
    super()
  }

  private get activeCache() {
    // Always prioritize Redis, fallback to Memory if Redis is unavailable
    return this.redisCache || this.memoryCache
  }

  get<T>(key: string): Promise<StoredDataNoRaw<T> | null> {
    return this.activeCache.get(key)
  }

  set<T>(key: string, value: T, ttlInMs?: number): Promise<boolean> {
    return this.activeCache.set(key, value, ttlInMs)
  }

  has(key: string): Promise<boolean> {
    return this.activeCache.has(key)
  }

  delete(key: string): Promise<boolean> {
    return this.activeCache.delete(key)
  }

  // Optional utility
  async clear(): Promise<void> {
    await this.activeCache.clear()
  }
}
