import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesFlatOrder } from '../models/sales-flat-order.model'

@Injectable()
export class SalesFlatOrderRepo extends BaseSequelizeRepo<SalesFlatOrder> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALES_FLAT_ORDER)
    private salesFlatOrderModel: typeof SalesFlatOrder,
  ) {
    super(sequelize, salesFlatOrderModel)
  }
}
