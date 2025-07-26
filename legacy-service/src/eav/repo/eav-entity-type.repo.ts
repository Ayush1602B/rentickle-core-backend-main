import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { EavEntityType } from '../models/eav-entity-type.model'

@Injectable()
export class EavEntityTypeRepo extends BaseSequelizeRepo<EavEntityType> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.EAV_ENTITY_TYPE)
    private eavEntityTypeModel: typeof EavEntityType,
  ) {
    super(sequelize, eavEntityTypeModel)
  }
}
