import { CustomerModule } from '@/customer/customer/customer.module'
import { DatabaseModule } from '@/database/db.module'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AppConfigModule } from '@shared/config/config.module'
import { CustomerAccountApiService } from './api/customer-account.api'
import { CustomerAccountController } from './customer-account.controller'

@Module({
  imports: [
    AppConfigModule,
    JwtModule,
    forwardRef(() => CustomerModule),
    DatabaseModule,
  ],
  providers: [CustomerAccountApiService],
  controllers: [CustomerAccountController],
})
export class CustomerAccountModule {}
