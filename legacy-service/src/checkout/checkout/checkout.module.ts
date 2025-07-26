import { StoreModule } from '@/core/store/store.module'
import { CustomerGroupModule } from '@/customer/customer-group.module'
import { EavModule } from '@/eav/eav.module'
import { OrderModule } from '@/sales/order/order.module'
import { AppConfigModule } from '@/shared/config/config.module'
import { LoggingModule } from '@/shared/logging/logger.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CartModule } from '../cart/cart.module'
import { PaymentModule } from '../payment/payment.module'
import { ShippingModule } from '../shipping/shipping.module'
import { CheckoutApiService } from './api/checkout-api.service'
import { CheckoutController } from './checkout.controller'

@Module({
  imports: [
    JwtModule,
    AppConfigModule,
    CartModule,
    LoggingModule,
    ShippingModule,
    PaymentModule,
    CustomerGroupModule,
    EavModule,
    StoreModule,
    OrderModule,
  ],
  providers: [CheckoutApiService],
  controllers: [CheckoutController],
  exports: [CheckoutApiService],
})
export class CheckoutModule {}
