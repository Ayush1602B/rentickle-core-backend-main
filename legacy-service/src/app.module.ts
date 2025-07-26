import { CacheModule } from '@nestjs/cache-manager'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { JwtModule } from '@nestjs/jwt'
import { AppConfigModule } from '@shared/config/config.module'
import { AppConfigService } from '@shared/config/config.service'
import { ENVIRONMENT } from '@shared/config/config.types'
import { GlobalExceptionFilter } from '@shared/error/error.middleware'
import { LoggingInterceptor } from '@shared/interceptors/logging.interceptor'
import { LoggingModule } from '@shared/logging/logger.module'
import { AppLogger } from '@shared/logging/logger.service'
import { TracingMiddleware } from '@shared/trace/trace.middleware'
import { TraceModule } from '@shared/trace/trace.module'
import { TraceService } from '@shared/trace/trace.service'
import { Keyv } from 'keyv'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatalogModule } from './catalog/catalog.module'
import { CheckoutGroupModule } from './checkout/checkout-group.module'
import { CoreModule } from './core/core.module'
import { CustomerGroupModule } from './customer/customer-group.module'
import { DatabaseModule } from './database/db.module'
import { IAMModule } from './iam/iam.module'
import { SalesModule } from './sales/sales.module'
import { StoreResolverMiddleware } from './shared/api/store-resolver.middleware'
import { AppCacheModule } from './shared/cache/cache.module'
import { CACHE_PROVIDER } from './shared/cache/cache.types'
import { SharedModule } from './shared/shared.module'
import { MagentoRPCModule } from './rpc/rpc.module'

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== ENVIRONMENT.prod,
      port: Number(process.env.DEBUG_PORT || 9000),
    }),
    AppCacheModule,
    CacheModule.registerAsync({
      imports: [AppCacheModule],
      inject: [
        CACHE_PROVIDER.CORE_REDIS_CACHE,
        CACHE_PROVIDER.CORE_MEMORY_CACHE,
      ],
      useFactory: (redisStore: Keyv, memoryStore: Keyv) => ({
        stores: [redisStore, memoryStore],
      }),
    }),
    JwtModule.registerAsync({
      imports: [AppConfigModule], // Make sure to import ConfigModule
      inject: [AppConfigService], // Inject ConfigService
      useFactory: (configService: AppConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    AppConfigModule,
    LoggingModule,
    TraceModule,
    IAMModule,
    CatalogModule,
    DatabaseModule,
    CustomerGroupModule,
    CheckoutGroupModule,
    CoreModule,
    SalesModule,
    SharedModule,
    MagentoRPCModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppLogger,
    AppConfigService,
    TraceService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [AppLogger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TracingMiddleware).forRoutes('*')
    consumer.apply(StoreResolverMiddleware).forRoutes('*')
  }
}
