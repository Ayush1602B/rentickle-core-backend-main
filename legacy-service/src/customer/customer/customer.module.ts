import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { EavModule } from '@/eav/eav.module'
import { IAMModule } from '@/iam/iam.module'
import { StoreModule } from '@/core/store/store.module'
import { forwardRef, Module } from '@nestjs/common'
import { CustomerApiService } from './api/customer-api.service'
import { CustomerAddressService } from './customer-address.service'
import { CustomerService } from './customer.service'
import { CustomerAddressEntityRepo } from './repo/customer-address-entity.repo'
import { CustomerEntityRepo } from './repo/customer-entity.repo'
import { CartModule } from '@/checkout/cart/cart.module'

@Module({
  imports: [
    EavModule,
    forwardRef(() => IAMModule),
    StoreModule,
    forwardRef(() => CartModule),
  ],
  controllers: [],
  providers: [
    CustomerApiService,
    CustomerService,
    CustomerEntityRepo,
    CustomerAddressService,
    CustomerAddressEntityRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ENTITY),
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ENTITY_VARCHAR),
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_VARCHAR),
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_TEXT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_INT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_DECIMAL),
    provideMagentoModel(MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY),
  ],
  exports: [
    CustomerApiService,
    CustomerService,
    CustomerAddressService,
    CustomerEntityRepo,
  ],
})
export class CustomerModule {}
