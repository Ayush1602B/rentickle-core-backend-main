import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Sequelize } from 'sequelize'
import { Inject, Injectable } from '@nestjs/common'
import { CatalogProductEntityVarchar } from '../models/catalog-product-entity-varchar.model'

@Injectable()
export class CatalogProductEntityRepo extends BaseSequelizeRepo<CatalogProductEntityVarchar> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_VARCHAR)
    private catalogProductEntityVarcharModel: typeof CatalogProductEntityVarchar,
  ) {
    super(sequelize, catalogProductEntityVarcharModel)
  }
}
