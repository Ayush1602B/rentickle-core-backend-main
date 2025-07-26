import { DatabaseModule } from '@/database/db.module'
import { RMP_COLLECTION_NAME } from '@/database/db.types'
import { provideRmpCollection } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { RmpOrderRepo } from './repo/rmp-order.repo'
import { RmpPickupRepo } from './repo/rmp-pickup.repo'
import { RmpOrderService } from './services/rmp-order.service'
import { LoggingModule } from '@/shared/logging/logger.module'
import { EavModule } from '@/eav/eav.module'

@Module({
  imports: [DatabaseModule, LoggingModule, EavModule],
  providers: [
    RmpOrderRepo,
    provideRmpCollection(RMP_COLLECTION_NAME.ORDER),
    RmpPickupRepo,
    provideRmpCollection(RMP_COLLECTION_NAME.PICKUP),
    RmpOrderService,
  ],
  exports: [RmpOrderRepo, RmpPickupRepo, RmpOrderService],
})
export class RmpModule {}
