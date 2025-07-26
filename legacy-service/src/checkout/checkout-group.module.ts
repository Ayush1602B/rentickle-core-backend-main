import { Module } from '@nestjs/common'
import { CartModule } from './cart/cart.module'
import { CheckoutModule } from './checkout/checkout.module'
import { OfferModule } from './offer/offer.module'

@Module({
  imports: [OfferModule, CartModule, CheckoutModule],
  exports: [OfferModule, CartModule, CheckoutModule],
})
export class CheckoutGroupModule {}
