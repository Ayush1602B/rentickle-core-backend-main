import KeyvRedis from '@keyv/redis'
import { Module } from '@nestjs/common'
import { CacheableMemory } from 'cacheable'
import Keyv from 'keyv'
import { AppConfigModule } from '../config/config.module'
import { AppConfigService } from '../config/config.service'
import { CACHE_PROVIDER } from './cache.types'
import { CoreCacheService } from './services/core-cache.service'

@Module({
  imports: [AppConfigModule],
  providers: [
    // Cache Redis
    {
      provide: CACHE_PROVIDER.CORE_REDIS_CACHE,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return new Keyv(new KeyvRedis(configService.get('CACHE_REDIS_URI')), {
          namespace: 'core',
          useKeyPrefix: false,
        })
      },
    },
    {
      provide: CACHE_PROVIDER.CORE_MEMORY_CACHE,
      useFactory: () => {
        return new Keyv({
          store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
        })
      },
    },
    // // Session Redis (can point to same or different Redis DB)
    // {
    //   provide: CACHE_PROVIDER.SESSION_REDIS_STORE,
    //   inject: [AppConfigService],
    //   useFactory: async (configService: AppConfigService) => {
    //     // Initialize client.
    //     const sessionRedisUri = configService.get('SESSION_REDIS_URI')
    //     if (!sessionRedisUri) {
    //       console.error('SESSION_REDIS_URI is not defined.')
    //       return null
    //     }

    //     const redisClient: RedisClientType | null = createClient({
    //       url: configService.get('SESSION_REDIS_URI'),
    //     })

    //     await redisClient.connect()
    //     console.log(
    //       `Connection to ${CACHE_PROVIDER.SESSION_REDIS_STORE} has been established successfully.`,
    //     )

    //     // Initialize store.
    //     return new RedisStore({
    //       client: redisClient,
    //     })
    //   },
    // },
    // {
    //   provide: CACHE_PROVIDER.SESSION_MEMORY_STORE,
    //   useFactory: () => {
    //     return new session.MemoryStore()
    //   },
    // },
    CoreCacheService,
  ],
  exports: [
    CACHE_PROVIDER.CORE_REDIS_CACHE,
    CACHE_PROVIDER.CORE_MEMORY_CACHE,
    CoreCacheService,
  ],
})
export class AppCacheModule {}
