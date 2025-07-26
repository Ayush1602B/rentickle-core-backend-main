import { DatabaseModule } from '@/database/db.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { QueryParseMiddleware } from '@/shared/api/query-parser.middleware'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { SalesRuleRepo } from './repo/salesrule.repo'

@Module({
  imports: [DatabaseModule],
  controllers: [OfferController],
  providers: [
    OfferService,
    SalesRuleRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.SALESRULE),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALESRULE_COUPON),
  ],
  exports: [OfferService],
})
export class OfferModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new QueryParseMiddleware([], []).use).forRoutes({
      path: 'offers',
      method: RequestMethod.GET,
    })
  }
}
