import { StoreModule } from '@/core/store/store.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { EavModule } from '@/eav/eav.module'
import { QueryParseMiddleware } from '@/shared/api/query-parser.middleware'
import { LoggingModule } from '@/shared/logging/logger.module'
import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { CatalogModule } from '../catalog.module'
import { ProductModule } from '../product/product.module'
import { CategoryApiService } from './api/category-api.service'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { CatalogCategoryEntityRepo } from './repo/catalog-category-entity.repo'

@Module({
  imports: [
    EavModule,
    StoreModule,
    forwardRef(() => ProductModule),
    forwardRef(() => CatalogModule),
    LoggingModule,
  ],
  controllers: [CategoryController],
  providers: [
    CategoryApiService,
    CategoryService,
    CatalogCategoryEntityRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_DATETIME),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_DECIMAL),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_INT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_TEXT),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_ENTITY_VARCHAR),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_CATEGORY_PRODUCT),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_SET),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_OPTION),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_OPTION_VALUE),
  ],
  exports: [CategoryService, CatalogCategoryEntityRepo],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new QueryParseMiddleware(['*'], ['entityId']).use).forRoutes(
      {
        path: '{*catId}/products',
        method: RequestMethod.GET,
      },
      {
        path: '/categories',
        method: RequestMethod.GET,
      },
    )
  }
}
