import { CustomerAddressEntity } from '@/customer/customer/models/customer-address-entity.model'
import { AppLogger } from '@/shared/logging/logger.service'
import { Injectable } from '@nestjs/common'
import { OrderAddress, OrderDocument } from '../models/rmp-order.model'
import { RmpBaseRepo } from '../repo/base.repo'
import { RmpOrderRepo } from '../repo/rmp-order.repo'
import {
  RmpOrderNotFoundException,
  ShippingAddressNotFoundException,
} from '../rmp.errors'
import { ADDRESS_TYPE, RmpBaseService } from '../rmp.types'
interface IRmpOrderService {
  validateAndGetByIncrementId(incrementId: string): Promise<OrderDocument>
  assignMagentoCustomerAddressToRmpShippingAddress(
    rmpRecord: OrderDocument,
    customerAddress: CustomerAddressEntity,
  ): Promise<OrderDocument>
}
@Injectable()
export class RmpOrderService
  extends RmpBaseService<OrderDocument>
  implements IRmpOrderService
{
  constructor(
    private readonly logger: AppLogger,
    private readonly rmpOrderRepo: RmpOrderRepo,
  ) {
    super()
  }

  getRepo(): RmpBaseRepo<OrderDocument> {
    return this.rmpOrderRepo
  }

  async validateAndGetByIncrementId(
    incrementId: string,
  ): Promise<OrderDocument> {
    this.logger.log(
      `Validating and getting order by increment ID: ${incrementId}`,
    )

    const order = await this.rmpOrderRepo.findOne({
      'details.0.orderId': incrementId,
    })

    if (!order) {
      throw new RmpOrderNotFoundException(
        `Order not found with increment ID: ${incrementId}`,
      )
    }

    return order
  }

  private _validateAndGetRmpOrderShippingAddress(
    rmpRecord: OrderDocument,
  ): OrderAddress {
    const shippingAddress = rmpRecord.details[2].find(
      (address) => address.addressType === ADDRESS_TYPE.SHIPPING,
    )

    if (!shippingAddress) {
      throw new ShippingAddressNotFoundException(
        `Shipping address not found for order with increment ID: ${rmpRecord.details[0][0].orderId}`,
      )
    }

    return shippingAddress
  }

  async assignMagentoCustomerAddressToRmpShippingAddress(
    rmpRecord: OrderDocument,
    customerAddress: CustomerAddressEntity,
  ): Promise<OrderDocument> {
    const rmpShippingAddress =
      this._validateAndGetRmpOrderShippingAddress(rmpRecord)

    const customerAddressAttributes = await customerAddress.toAttributeMap()

    const [lineOne, lineTwo] = (() => {
      const w = customerAddressAttributes.street.split(' '),
        h = Math.ceil(w.length / 2)
      return [w.slice(0, h).join(' '), w.slice(h).join(' ')]
    })()

    rmpShippingAddress.addressType = ADDRESS_TYPE.SHIPPING
    rmpShippingAddress.customerName =
      customerAddressAttributes.firstname +
      ' ' +
      customerAddressAttributes.lastname
    rmpShippingAddress.phone =
      customerAddressAttributes.telephone ?? rmpShippingAddress.phone
    rmpShippingAddress.companyName =
      customerAddressAttributes.company ?? rmpShippingAddress.companyName
    rmpShippingAddress.addressInfo.lineOne = lineOne
    rmpShippingAddress.addressInfo.lineTwo = lineTwo
    rmpShippingAddress.addressInfo.city = customerAddressAttributes.city
    rmpShippingAddress.addressInfo.region = customerAddressAttributes.region
    rmpShippingAddress.addressInfo.pincode = customerAddressAttributes.postcode

    return Promise.resolve(rmpRecord)
  }
}
