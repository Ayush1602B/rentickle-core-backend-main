import { CustomerAddressService } from '@/customer/customer/customer-address.service'
import { CustomerService } from '@/customer/customer/customer.service'
import { CustomerAddressEntity } from '@/customer/customer/models/customer-address-entity.model'
import { Injectable } from '@nestjs/common'
import {
  UpsertCustomerAddressInputDto,
  UpsertCustomerAddressOutputDto,
} from './dto/upsert-customer-address.dto'

interface ICustomerAccountApiService {
  upsertCustomerAddress(
    customerId: number,
    addressDto: UpsertCustomerAddressInputDto,
  ): Promise<UpsertCustomerAddressOutputDto>
}

@Injectable()
export class CustomerAccountApiService implements ICustomerAccountApiService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerAddressService: CustomerAddressService,
  ) {}

  async upsertCustomerAddress(
    customerId: number,
    addressDto: UpsertCustomerAddressInputDto,
  ): Promise<UpsertCustomerAddressOutputDto> {
    const { addressId, addressInfo } = addressDto

    const customer =
      await this.customerService.validateAndGetCustomerById(customerId)

    let customerAddress: CustomerAddressEntity | null = null

    if (addressId) {
      customerAddress =
        await this.customerAddressService.validateAndGetCustomerAddressById(
          addressId,
        )

      await this.customerAddressService.validateCustomerAddressOwnership(
        customerAddress,
        customer,
      )

      await this.customerAddressService.updateCustomerAddress(
        customerAddress,
        addressInfo,
        addressDto.markDefaultBilling,
        addressDto.markDefaultShipping,
      )
    }

    if (customerAddress === null) {
      await this.customerAddressService.createCustomerAddress(
        customer,
        addressInfo,
        addressDto.markDefaultBilling,
        addressDto.markDefaultShipping,
      )
    }

    return {
      message: 'Customer address upserted successfully',
    }
  }
}
