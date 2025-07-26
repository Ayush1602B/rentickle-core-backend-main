import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Sequelize } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { CoreStore } from '../models/core-store.model'

@Injectable()
export class CoreStoreRepo extends BaseSequelizeRepo<CoreStore> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CORE_STORE)
    private coreStoreModel: typeof CoreStore,
  ) {
    super(sequelize, coreStoreModel)
  }
}
