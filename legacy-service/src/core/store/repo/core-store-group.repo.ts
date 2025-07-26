import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Sequelize } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { CoreStoreGroup } from '../models/core-store-group.model'
@Injectable()
export class CoreStoreGroupRepo extends BaseSequelizeRepo<CoreStoreGroup> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CORE_STORE_GROUP)
    private coreStoreGroupModel: typeof CoreStoreGroup,
  ) {
    super(sequelize, coreStoreGroupModel)
  }
}
