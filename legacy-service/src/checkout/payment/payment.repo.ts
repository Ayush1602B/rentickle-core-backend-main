import { CoreConfigData } from '@/core/config/models/core-config-data.model'
import { MAGENTO_MODEL_NAME, MAGNETO_DB_PROVIDER } from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Op, Sequelize } from 'sequelize'
import { PaymentMethodFactory } from './methods/payment-method.factory'
import {
  PAYMENT_METHOD,
  PAYMENT_METHOD_PREFIX,
  PaymentMethod,
} from './payment.types'

interface IPaymentRepo {
  getAll(): Promise<PaymentMethod[]>
  getByCode(code: string): Promise<PaymentMethod | null>
}

@Injectable()
export class PaymentRepo implements IPaymentRepo {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CORE_CONFIG_DATA)
    private readonly coreConfigDataModel: typeof CoreConfigData,
    private readonly paymentMethodFactory: PaymentMethodFactory,
  ) {}

  async getAll(): Promise<PaymentMethod[]> {
    const allPaymentMethods: PaymentMethod[] = []

    const allConfigRows = await this.coreConfigDataModel.findAll({
      where: {
        path: {
          [Op.like]: `${PAYMENT_METHOD_PREFIX}/%/%`,
        },
      },
    })

    const allPaymentMethodCodes = Array.from(
      new Set(
        allConfigRows
          .map((carrier) => carrier.path.split('/')[1])
          .filter((carrierCode) => carrierCode),
      ),
    )

    allPaymentMethodCodes.forEach((paymentMethodCode: PAYMENT_METHOD) => {
      const carrierConfigs = allConfigRows.filter(
        (carrier) => carrier.path.split('/')[1] === paymentMethodCode,
      )

      const paymentMethod = this.toPaymentEntity(
        paymentMethodCode,
        carrierConfigs,
      )
      if (paymentMethod) {
        allPaymentMethods.push(paymentMethod)
      }
    })

    return allPaymentMethods
  }

  private toPaymentEntity(
    methodCode: PAYMENT_METHOD,
    paymentConfigRows: CoreConfigData[],
  ): PaymentMethod | null {
    const paymentConfigData = paymentConfigRows.filter(
      (config) => config.path.split('/')[1] === methodCode,
    )

    const paymentMethod = this.paymentMethodFactory.create(
      methodCode,
      paymentConfigData,
    )

    return paymentMethod
  }

  async getByCode(code: string): Promise<PaymentMethod | null> {
    const allConfigRows = await this.coreConfigDataModel.findAll({
      where: {
        path: {
          [Op.like]: `${PAYMENT_METHOD_PREFIX}/${code}/%`,
        },
      },
    })

    const allPaymentMethodCodes = Array.from(
      new Set(
        allConfigRows
          .map((carrier) => carrier.path.split('/')[1])
          .filter((carrierCode) => carrierCode),
      ),
    )

    if (
      allPaymentMethodCodes.length === 0 ||
      allPaymentMethodCodes.length > 1
    ) {
      return null
    }

    const paymentMethodCode = allPaymentMethodCodes[0] as PAYMENT_METHOD
    const paymentMethod = this.toPaymentEntity(paymentMethodCode, allConfigRows)

    return paymentMethod
  }
}
