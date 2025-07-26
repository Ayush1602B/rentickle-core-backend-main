import { CatalogModule } from '@/catalog/catalog.module'
import { CoreConfigModule } from '@/core/config/core-config.module'
import { StoreModule } from '@/core/store/store.module'
import { CustomerModule } from '@/customer/customer/customer.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { EavModule } from '@/eav/eav.module'
import { IAMModule } from '@/iam/iam.module'
import { AppConfigModule } from '@/shared/config/config.module'
import { LoggingModule } from '@/shared/logging/logger.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ShippingModule } from '../shipping/shipping.module'
import { CartApiService } from './api/cart-api.service'
import { CartCalculator } from './cart.calculator'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { SalesFlatQuoteItemRepo } from './repo/sales-flat-quote-item.repo'
import { SalesFlatQuoteRepo } from './repo/sales-flat-quote.repo'

@Module({
  imports: [
    IAMModule,
    JwtModule,
    LoggingModule,
    AppConfigModule,
    CatalogModule,
    EavModule,
    CustomerModule,
    StoreModule,
    ShippingModule,
    CoreConfigModule,
  ],
  controllers: [CartController],
  providers: [
    CartApiService,
    CartService,
    CartCalculator,
    SalesFlatQuoteRepo,
    SalesFlatQuoteItemRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ADDRESS),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ITEM),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_PAYMENT),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ITEM_OPTION),
    provideMagentoModel(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_SHIPPING_RATE),
  ],
  exports: [CartService, SalesFlatQuoteRepo],
})
export class CartModule {}
