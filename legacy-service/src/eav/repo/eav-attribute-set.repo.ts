import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { EavAttributeSet } from '../models/eav-attribute-set.model'

@Injectable()
export class EavAttributeSetRepo extends BaseSequelizeRepo<EavAttributeSet> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_SET)
    private eavAttributeSetModel: typeof EavAttributeSet,
  ) {
    super(sequelize, eavAttributeSetModel)
  }

  getByIds(attributeSetIds: number[]): Promise<EavAttributeSet[]> {
    return this.eavAttributeSetModel.findAll({
      where: {
        attributeSetId: attributeSetIds,
      },
    })
  }
}
