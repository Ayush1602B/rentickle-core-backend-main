import { StoreService } from '@/core/store/store.service'
import { CustomerAddressService } from '@/customer/customer/customer-address.service'
import { DatabaseService } from '@/database/db.service'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { RmpOrderService } from '@/rmp/services/rmp-order.service'
import { OrderService } from '@/sales/order/order.service'
import { AppLogger } from '@/shared/logging/logger.service'
import { DEFAULT_COUNTRY_CODE } from '@/shared/shared.interface'
import { Injectable } from '@nestjs/common'
import { UpdateCustomerAddressCronOutputDto } from './dto/common.dto'
import { UpdateCustomerAddressCronDto } from './dto/update-customer-address.dto'

interface IUpdateCustomerAddressCron {
  run(
    data: UpdateCustomerAddressCronDto,
  ): Promise<UpdateCustomerAddressCronOutputDto>
}
@Injectable()
export class UpdateCustomerAddressCron implements IUpdateCustomerAddressCron {
  constructor(
    private readonly logger: AppLogger,
    private readonly customerAddressService: CustomerAddressService,
    private readonly orderService: OrderService,
    private readonly rmpOrderService: RmpOrderService,
    private readonly storeService: StoreService,
    private readonly databaseService: DatabaseService,
  ) {}

  async run({
    incrementId,
    address,
  }: UpdateCustomerAddressCronDto): Promise<UpdateCustomerAddressCronOutputDto> {
    this.logger.log('Starting update customer address script...')

    const [orderInMagento, orderInRmp] = await Promise.all([
      this.orderService.validateAndGetByIncrementId(incrementId),
      this.rmpOrderService.validateAndGetByIncrementId(incrementId),
    ])

    orderInMagento.SalesFlatOrderAddresses =
      await orderInMagento.getSalesFlatOrderAddresses()

    const orderCurrentShippingAddress = orderInMagento.getShippingAddress()!
    const [customer, addressCity, addressRegion] = await Promise.all([
      orderInMagento.getCustomerEntity(),
      this.storeService.validateAndGetCityById(address.cityId),
      this.storeService.validateAndGetRegionById(address.regionId),
    ])

    const newCustomerAddress =
      await this.customerAddressService.buildFromCustomerAddressAttributeMap({
        firstname: orderCurrentShippingAddress.firstname,
        lastname: orderCurrentShippingAddress.lastname,
        street: `${address.line1} ${address.line2}`,
        city_id: address.cityId,
        region_id: address.regionId,
        city: addressCity.defaultName,
        region: addressRegion.defaultName,
        postcode: address.postcode,
        country_id: DEFAULT_COUNTRY_CODE,
        address_type: ADDRESS_TYPE.SHIPPING,
      })
    customer.addAddress(newCustomerAddress)

    const updatedShippingAddress =
      await this.orderService.updateShippingAddressFromCustomerAddress(
        orderInMagento,
        newCustomerAddress,
      )

    await this.databaseService.startMagentoTransaction(async (txn) => {
      await customer.save({ transaction: txn })
      await newCustomerAddress.save({
        transaction: txn,
      })

      updatedShippingAddress.setCustomerAddress(newCustomerAddress)
      await orderInMagento.save({ transaction: txn })
    })

    await this.rmpOrderService.assignMagentoCustomerAddressToRmpShippingAddress(
      orderInRmp,
      newCustomerAddress,
    )

    await this.rmpOrderService
      .getRepo()
      .findOneAndUpdate(
        { _id: orderInRmp._id },
        { $set: { details: orderInRmp.details } },
        {},
      )

    return { message: 'Address updated successfully' }
  }
}
