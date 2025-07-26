import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import { MAGENTO_MODEL_NAME, MAGNETO_DB_PROVIDER } from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Op, Sequelize } from 'sequelize'
import { FreeShippingMethod } from './methods/free-shipping.method'
import {
  SHIPPING_METHOD,
  SHIPPING_METHOD_PREFIX,
  ShippingMethod,
} from './shipping.types'

interface IShippingRepo {
  getAll(): Promise<ShippingMethod[]>
  getByCode(code: string): Promise<ShippingMethod | null>
}

@Injectable()
export class ShippingRepo implements IShippingRepo {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CORE_CONFIG_DATA)
    private readonly coreConfigDataModel: typeof CoreConfigData,
  ) {}

  async getAll(): Promise<ShippingMethod[]> {
    const allShippingMethods: ShippingMethod[] = []

    const allCarriers = await this.coreConfigDataModel.findAll({
      where: {
        path: {
          [Op.like]: `${SHIPPING_METHOD_PREFIX}/%/%`,
        },
      },
    })

    let allCarrierCodes = allCarriers
      .map((carrier) => carrier.path.split('/')[1])
      .filter((carrierCode) => carrierCode)

    allCarrierCodes = Array.from(new Set(allCarrierCodes))
    allCarrierCodes.forEach((carrierCode) => {
      const carrierConfigs = allCarriers.filter(
        (carrier) => carrier.path.split('/')[1] === carrierCode,
      )

      const shippingMethod = this.toShippingEntity(carrierCode, carrierConfigs)
      if (shippingMethod) {
        allShippingMethods.push(shippingMethod)
      }
    })

    return allShippingMethods
  }

  private toShippingEntity(
    carrierCode: string,
    shippingConfigData: CoreConfigData[],
  ): ShippingMethod | null {
    let shippingMethod: ShippingMethod | null = null

    const carrierConfigData = shippingConfigData.filter(
      (config) => config.path.split('/')[1] === carrierCode,
    )

    switch (carrierCode) {
      case SHIPPING_METHOD.FREE_SHIPPING:
        shippingMethod = new FreeShippingMethod(carrierConfigData)
        break
      default:
        break
    }

    return shippingMethod
  }

  async getByCode(code: string): Promise<ShippingMethod | null> {
    const allConfigRows = await this.coreConfigDataModel.findAll({
      where: {
        path: {
          [Op.like]: `${SHIPPING_METHOD_PREFIX}/${code}/%`,
        },
      },
    })

    const allCarrierCodes = Array.from(
      new Set(
        allConfigRows
          .map((carrier) => carrier.path.split('/')[1])
          .filter((carrierCode) => carrierCode),
      ),
    )

    if (allCarrierCodes.length === 0 || allCarrierCodes.length > 1) {
      return null
    }

    const shippingMethodCode = allCarrierCodes[0]
    const shippingMethod = this.toShippingEntity(
      shippingMethodCode,
      allConfigRows,
    )

    return shippingMethod
  }
}
