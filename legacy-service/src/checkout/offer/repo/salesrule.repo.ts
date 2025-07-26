import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesRule } from '../models/salesrule.model'

@Injectable()
export class SalesRuleRepo extends BaseSequelizeRepo<SalesRule> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALESRULE)
    private salesruleModel: typeof SalesRule,
  ) {
    super(sequelize, salesruleModel)
  }
}
