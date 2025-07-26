import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { CatalogProductEntityMediaGallery } from '../models/catalog-product-entity-media-gallery.model'

@Injectable()
export class CatalogProductEntityMediaGalleryRepo extends BaseSequelizeRepo<CatalogProductEntityMediaGallery> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY)
    private catalogProductEntityMediaGalleryModel: typeof CatalogProductEntityMediaGallery,
  ) {
    super(sequelize, catalogProductEntityMediaGalleryModel)
  }
}
