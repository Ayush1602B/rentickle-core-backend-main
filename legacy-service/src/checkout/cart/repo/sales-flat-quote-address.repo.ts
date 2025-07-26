import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesFlatQuoteAddress } from '../models/sales-flat-quote-address.model'

@Injectable()
export class SalesFlatQuoteAddressRepo extends BaseSequelizeRepo<SalesFlatQuoteAddress> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ADDRESS)
    private salesFlatQuoteAddressModel: typeof SalesFlatQuoteAddress,
  ) {
    super(sequelize, salesFlatQuoteAddressModel)
  }
}
