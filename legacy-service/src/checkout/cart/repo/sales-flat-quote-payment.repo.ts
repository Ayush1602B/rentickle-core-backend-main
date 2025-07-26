import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesFlatQuotePayment } from '../models/sales-flat-quote-payment.model'

@Injectable()
export class SalesFlatQuotePaymentRepo extends BaseSequelizeRepo<SalesFlatQuotePayment> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_PAYMENT)
    private salesFlatQuotePaymentModel: typeof SalesFlatQuotePayment,
  ) {
    super(sequelize, salesFlatQuotePaymentModel)
  }
}
