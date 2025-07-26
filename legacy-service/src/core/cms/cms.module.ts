import { CatalogModule } from '@/catalog/catalog.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { StoreModule } from '../store/store.module'
import { CmsController } from './cms.controller'
import { CmsService } from './cms.service'
import { BannerEntityRepo } from './repo'

@Module({
  imports: [StoreModule, CatalogModule],
  providers: [
    CmsService,
    BannerEntityRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.BANNER_ENTITY),
  ],
  controllers: [CmsController],
  exports: [BannerEntityRepo],
})
export class CmsModule {}
