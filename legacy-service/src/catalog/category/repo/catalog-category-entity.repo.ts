import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CatalogCategoryEntity } from '../models/catalog-category-entity.model'

@Injectable()
export class CatalogCategoryEntityRepo extends BaseSequelizeRepo<CatalogCategoryEntity> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY)
    private catalogCategoryEntityModel: typeof CatalogCategoryEntity,
  ) {
    super(sequelize, catalogCategoryEntityModel)
  }
}
