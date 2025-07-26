import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { AUTH_USER_TYPE, AuthTokenPayload } from '../../auth.types'
import { SalesFlatQuote } from '@/checkout/cart/models/sales-flat-quote.model'

export class IntrospectInputDto extends BaseDto<IntrospectOutputDto> {
  @IsString()
  @IsOptional()
  declare tokenPayload: AuthTokenPayload

  @IsNumber()
  declare storeId: number
}

export class IntrospectOutputDto extends BaseDto<IntrospectOutputDto> {
  @ApiResponseProperty()
  @IsBoolean()
  isActive: boolean

  @ApiResponseProperty()
  @IsString()
  userId: string

  @ApiResponseProperty()
  @IsString()
  userType: string

  @ApiResponseProperty()
  @IsString()
  email: string

  @ApiResponseProperty()
  @IsString()
  @IsOptional()
  role: string

  @ApiResponseProperty()
  @IsString()
  customerGroupId: string

  @ApiResponseProperty()
  @IsString()
  createdInStoreId: number

  @ApiResponseProperty()
  @IsString()
  fullName: string

  @ApiResponseProperty()
  @IsString()
  @IsOptional()
  createdAt: string

  @ApiResponseProperty()
  @IsString()
  @IsOptional()
  lastLoginAt: string

  @ApiResponseProperty()
  @IsString({ each: true })
  @IsOptional()
  permissions: string[]

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  activeCartId: number | null

  static async fromEntity(
    customer: CustomerEntity,
    activeCart: SalesFlatQuote | null = null,
  ): Promise<IntrospectOutputDto> {
    return new IntrospectOutputDto({
      isActive: customer.isActive && customer.isActive === 1,
      userType: AUTH_USER_TYPE.CUSTOMER,
      userId: customer.entityId.toString(),
      email: customer.email!,
      customerGroupId: customer.groupId.toString(),
      createdInStoreId: customer.storeId,
      fullName: await customer.getFullName(),
      createdAt: customer.createdAt.toISOString(),
      permissions: [],
      activeCartId: activeCart && activeCart.entityId,
    })
  }
}
