import { CoreConfigModule } from '@/core/config/core-config.module'
import { StoreModule } from '@/core/store/store.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { EavModule } from '@/eav/eav.module'
import { QueryParseMiddleware } from '@/shared/api/query-parser.middleware'
import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { CatalogModule } from '../catalog.module'
import { CategoryModule } from '../category/category.module'
import { ReviewModule } from '../review/review.module'
import { ProductApiService } from './api/product-api.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { CatalogProductEntityMediaGalleryRepo } from './repo/catalog-product-entity-media-gallery.repo'
import { CatalogProductOptionTypeValueRepo } from './repo/catalog-product-entity-type-value.repo'
import { CatalogProductEntityRepo } from './repo/catalog-product-entity.repo'
import { CatalogProductLinkTypeRepo } from './repo/catalog-product-link-type.repo'
import { CatalogProductLinkRepo } from './repo/catalog-product-link.repo'
import { LoggingModule } from '@/shared/logging/logger.module'
import { AppCacheModule } from '@/shared/cache/cache.module'
@Module({
  imports: [
    StoreModule,
    EavModule,
    forwardRef(() => CategoryModule),
    forwardRef(() => CatalogModule),
    CoreConfigModule,
    ReviewModule,
    LoggingModule,
    AppCacheModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductApiService,
    ProductService,
    CatalogProductEntityRepo,
    CatalogProductOptionTypeValueRepo,
    CatalogProductOptionTypeValueRepo,
    CatalogProductEntityMediaGalleryRepo,
    CatalogProductLinkRepo,
    CatalogProductLinkTypeRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_PRODUCT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_INT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_VARCHAR),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_DECIMAL),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_TEXT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_DATETIME),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_SUPER_ATTRIBUTE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_PRICE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TITLE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_VALUE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_TITLE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_PRICE),
    provideMagentoModel(MAGENTO_MODEL_NAME.AVA_CATALOG_PRODUCT_ENTITY_DEPOSIT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOGINVENTORY_STOCK_ITEM),
    provideMagentoModel(
      MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY,
    ),
    provideMagentoModel(
      MAGENTO_MODEL_NAME.CATALOG_PRODUCT_ENTITY_MEDIA_GALLERY_VALUE,
    ),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_LINK),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_PRODUCT_LINK_TYPE),
  ],
  exports: [
    CatalogProductEntityRepo,
    CatalogProductOptionTypeValueRepo,
    CatalogProductEntityMediaGalleryRepo,
    CatalogProductLinkRepo,
    CatalogProductLinkTypeRepo,
    ProductService,
  ],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(new QueryParseMiddleware(['categoryId'], ['entityId']).use)
      .forRoutes({
        path: 'products',
        method: RequestMethod.GET,
      })
  }
}
