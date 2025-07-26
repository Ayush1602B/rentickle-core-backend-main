import { Module } from '@nestjs/common'
import { CustomerAccountModule } from './customer-account/customer-account.module'
import { CustomerModule } from './customer/customer.module'

@Module({
  imports: [CustomerModule, CustomerAccountModule],
  exports: [CustomerModule, CustomerAccountModule],
})
export class CustomerGroupModule {}
