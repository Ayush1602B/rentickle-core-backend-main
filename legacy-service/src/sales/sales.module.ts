import { Module } from '@nestjs/common'
import { OrderModule } from './order/order.module'

@Module({
  imports: [OrderModule],
  providers: [],
  exports: [OrderModule],
})
export class SalesModule {}
