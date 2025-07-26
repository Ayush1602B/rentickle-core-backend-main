import { ProductModule } from '@/catalog/product/product.module'
import { StoreModule } from '@/core/store/store.module'
import { CustomerModule } from '@/customer/customer/customer.module'
import { EavModule } from '@/eav/eav.module'
import { RmpModule } from '@/rmp/rmp.module'
import { OrderModule } from '@/sales/order/order.module'
import { SalesModule } from '@/sales/sales.module'
import { LoggingModule } from '@/shared/logging/logger.module'
import { Module } from '@nestjs/common'
import { BackfillCategoryCron } from './crons/backfill-category.cron'
import { UpdateCustomerAddressCron } from './crons/update-customer-address.cron'
import { JobController } from './job.controller'
import { OndemandJobService } from './services/ondemand-job.service'
import { ScheduledJobService } from './services/scheduled-job.service'
import { FixNobrokerOrderRentalCron } from './crons/update-no-broker-rental-cron'
@Module({
  imports: [
    LoggingModule,
    RmpModule,
    ProductModule,
    StoreModule,
    OrderModule,
    CustomerModule,
    EavModule,
    SalesModule,
  ],
  controllers: [JobController],
  providers: [
    ScheduledJobService,
    OndemandJobService,
    BackfillCategoryCron,
    UpdateCustomerAddressCron,
    FixNobrokerOrderRentalCron,
  ],
  exports: [],
})
export class JobModule {}
