import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Sequelize } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { CatalogProductEntityText } from '../models/catalog-product-entity-text.model'

@Injectable()
export class CatalogProductEntityRepo extends BaseSequelizeRepo<CatalogProductEntityText> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_TEXT)
    private catalogProductEntityTextModel: typeof CatalogProductEntityText,
  ) {
    super(sequelize, catalogProductEntityTextModel)
  }
}
