import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CatalogProductLink } from '../models/catalog-product-link.model'

@Injectable()
export class CatalogProductLinkRepo extends BaseSequelizeRepo<CatalogProductLink> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_LINK)
    private catalogProductLinkModel: typeof CatalogProductLink,
  ) {
    super(sequelize, catalogProductLinkModel)
  }
}
