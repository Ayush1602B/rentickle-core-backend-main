import { AppConfigModule } from '@/shared/config/config.module'
import { AppConfigService } from '@/shared/config/config.service'
import { Module } from '@nestjs/common'
import { RedisStore } from 'connect-redis'
import * as session from 'express-session'
import { AppCacheModule } from '../cache/cache.module'
import { SessionHelper } from './session.helper'
import { SessionService } from './session.service'
import { SESSION_PROVIDER } from './session.types'

@Module({
  imports: [AppConfigModule, AppCacheModule],
  providers: [
    {
      provide: SESSION_PROVIDER,
      inject: [AppConfigService],
      useFactory: (
        configService: AppConfigService,
        redisStore: RedisStore,
        memoryStore: session.MemoryStore,
      ) => {
        const sess: session.SessionOptions = {
          secret: configService.get('SESSION_SECRET_KEY')!,
          resave: false,
          saveUninitialized: false,
          cookie: {
            sameSite: configService.isProd() ? 'strict' : 'none',
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
          },
          proxy: true,
          store: redisStore || memoryStore,
        }

        return session(sess)
      },
    },
    SessionService,
    SessionHelper,
  ],
  exports: [SessionService, SessionHelper],
})
export class SessionModule {}
