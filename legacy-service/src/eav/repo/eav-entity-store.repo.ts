import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { EavEntityStore } from '../models/eav-entity-store.model'

@Injectable()
export class EavEntityStoreRepo extends BaseSequelizeRepo<EavEntityStore> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.EAV_ENTITY_STORE)
    readonly eavEntityStoreModel: typeof EavEntityStore,
  ) {
    super(sequelize, eavEntityStoreModel)
  }
}
