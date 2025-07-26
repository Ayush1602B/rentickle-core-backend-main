import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesFlatQuoteItemOption } from '../models/sales-flat-quote-item-option.model'

@Injectable()
export class SalesFlatQuoteItemOptionRepo extends BaseSequelizeRepo<SalesFlatQuoteItemOption> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ITEM_OPTION)
    private salesFlatQuoteItemOptionModel: typeof SalesFlatQuoteItemOption,
  ) {
    super(sequelize, salesFlatQuoteItemOptionModel)
  }
}
