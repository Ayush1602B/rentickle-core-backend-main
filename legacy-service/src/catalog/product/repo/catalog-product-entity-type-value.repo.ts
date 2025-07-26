import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'

import { CatalogProductOptionTypeValue } from '../models/catalog-product-option-type-value.model'

@Injectable()
export class CatalogProductOptionTypeValueRepo extends BaseSequelizeRepo<CatalogProductOptionTypeValue> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_VALUE)
    private catalogProductOptionTypeValueModel: typeof CatalogProductOptionTypeValue,
  ) {
    super(sequelize, catalogProductOptionTypeValueModel)
  }
}
