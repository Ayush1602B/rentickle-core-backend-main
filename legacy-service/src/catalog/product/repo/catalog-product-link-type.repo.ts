import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CatalogProductLinkType } from '../models/catalog-product-link-type.model'

@Injectable()
export class CatalogProductLinkTypeRepo extends BaseSequelizeRepo<CatalogProductLinkType> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_LINK_TYPE)
    private catalogProductLinkTypeModel: typeof CatalogProductLinkType,
  ) {
    super(sequelize, catalogProductLinkTypeModel)
  }
}
