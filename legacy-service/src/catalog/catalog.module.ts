import { Module } from '@nestjs/common'
import { CategoryModule } from './category/category.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { CatalogHelper } from './catalog.helper'

@Module({
  imports: [CategoryModule, ProductModule, ReviewModule],
  providers: [CatalogHelper],
  exports: [CategoryModule, ProductModule, ReviewModule, CatalogHelper],
})
export class CatalogModule {}
