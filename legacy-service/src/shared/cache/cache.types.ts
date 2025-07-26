import { StoredDataNoRaw } from 'keyv'

export enum CACHE_PROVIDER {
  // General cache
  CORE_REDIS_CACHE = 'CORE_REDIS_CACHE',
  CORE_MEMORY_CACHE = 'CORE_MEMORY_CACHE',

  // Session store
  SESSION_REDIS_STORE = 'SESSION_REDIS_STORE',
  SESSION_MEMORY_STORE = 'SESSION_MEMORY_STORE',
}

export abstract class AbstractCacheService {
  abstract get<T>(key: string): Promise<StoredDataNoRaw<T> | null>
  abstract set<T>(key: string, value: T, ttlInMs?: number): Promise<boolean>
  abstract has(key: string): Promise<boolean>
  abstract delete(key: string): Promise<boolean>
  abstract clear(): Promise<void>
}
