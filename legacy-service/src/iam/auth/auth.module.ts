import { StoreModule } from '@/core/store/store.module'
import { CustomerModule } from '@/customer/customer/customer.module'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AppConfigModule } from '@shared/config/config.module'
import { OtpModule } from '../otp/otp.module'
import { AuthApiService } from './api/auth-api.service'
import { AuthController } from './auth.controller'
import { AuthHelper } from './auth.helper'
import { AuthService } from './auth.service'
@Module({
  imports: [
    AppConfigModule,
    JwtModule,
    forwardRef(() => CustomerModule),
    OtpModule,
    StoreModule,
  ],
  controllers: [AuthController],
  providers: [AuthApiService, AuthService, AuthHelper],
  exports: [AuthService, AuthHelper],
})
export class AuthModule {}
