import { BaseDto } from '@/shared/api/api.types'
import { BaseAddressDto } from '@/shared/shared.interface'
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator'
import { MagentoCustomerAttributes } from '../../customer.types'
import { CustomerAddressEntityWithAttributeValues } from '../../models/customer-address-entity.model'
import { CustomerEntity } from '../../models/customer-entity.model'

export class CustomerDto extends BaseDto<CustomerDto> {
  @IsNumber()
  id: number

  @IsString()
  firstName: string

  @IsString()
  middleName: string

  @IsString()
  lastName: string

  @IsString()
  email: string

  @IsString()
  phone: string

  @IsBoolean()
  isEmailVerified: boolean

  @IsBoolean()
  isPhoneVerified: boolean

  @IsNumber()
  storeId: number

  @IsNumber()
  websiteId: number

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date

  static fromEntity(
    magentoCustomer: CustomerEntity,
    attributeMap: MagentoCustomerAttributes,
  ): Promise<CustomerDto> {
    return Promise.resolve(
      new CustomerDto({
        id: magentoCustomer.entityId,
        firstName: attributeMap.firstname!,
        email: magentoCustomer.email!,
        phone: magentoCustomer.phone!,
        middleName: attributeMap.middlename!,
        lastName: attributeMap.lastname!,
        storeId: magentoCustomer.storeId,
        websiteId: magentoCustomer.websiteId!,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: magentoCustomer.createdAt,
        updatedAt: magentoCustomer.updatedAt,
      }),
    )
  }
}

export class CustomerAddressDto extends BaseDto<CustomerAddressDto> {
  @IsNumber()
  addressId: number

  @IsNumber()
  customerId: number

  @IsObject()
  addressInfo: BaseAddressDto

  static async fromEntity(
    entity: CustomerAddressEntityWithAttributeValues,
  ): Promise<CustomerAddressDto> {
    return new CustomerAddressDto({
      addressId: entity.entityId,
      customerId: entity.parentId,
      addressInfo: new BaseAddressDto({ ...(await entity.getAttributesMap()) }),
    })
  }
}
