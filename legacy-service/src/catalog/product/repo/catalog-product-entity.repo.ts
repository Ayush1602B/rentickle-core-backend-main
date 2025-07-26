import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CatalogProductEntity } from '../models/catalog-product-entity.model'

@Injectable()
export class CatalogProductEntityRepo extends BaseSequelizeRepo<CatalogProductEntity> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY)
    private catalogProductEntityModel: typeof CatalogProductEntity,
  ) {
    super(sequelize, catalogProductEntityModel)
  }
}
