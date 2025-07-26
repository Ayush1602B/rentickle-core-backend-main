import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesFlatQuoteItem } from '../models/sales-flat-quote-item.model'

@Injectable()
export class SalesFlatQuoteItemRepo extends BaseSequelizeRepo<SalesFlatQuoteItem> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ITEM)
    private salesFlatQuoteItemModel: typeof SalesFlatQuoteItem,
  ) {
    super(sequelize, salesFlatQuoteItemModel)
  }
}
