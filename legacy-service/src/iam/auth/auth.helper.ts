import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { AppConfigService } from '@/shared/config/config.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AUTH_USER_TYPE, AuthTokenPayload } from './auth.types'

@Injectable()
export class AuthHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  generateTokenPayload(
    customer: CustomerEntity,
  ): Omit<AuthTokenPayload, 'exp'> {
    return {
      id: customer.entityId,
      type: AUTH_USER_TYPE.CUSTOMER,
      email: customer.email!,
      iat: Date.now(),
    }
  }

  generateAccessToken(payload: Omit<AuthTokenPayload, 'exp'>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    })
  }
}
