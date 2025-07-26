import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CustomerEntity } from '../models/customer-entity.model'

@Injectable()
export class CustomerEntityRepo extends BaseSequelizeRepo<CustomerEntity> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CUSTOMER_ENTITY)
    private readonly customerEntityModel: typeof CustomerEntity,
  ) {
    super(sequelize, customerEntityModel)
  }
}
