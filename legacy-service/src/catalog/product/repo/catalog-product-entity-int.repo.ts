import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Sequelize } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { CatalogProductEntityInt } from '../models/catalog-product-entity-int.model'

@Injectable()
export class CatalogProductEntityRepo extends BaseSequelizeRepo<CatalogProductEntityInt> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_INT)
    private catalogProductEntityIntModel: typeof CatalogProductEntityInt,
  ) {
    super(sequelize, catalogProductEntityIntModel)
  }
}
