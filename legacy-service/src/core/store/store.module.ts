import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { StoreApiService } from './api/store-api.service'
import { CoreStoreGroupRepo } from './repo/core-store-group.repo'
import { CoreStoreRepo } from './repo/core-store.repo'
import { CoreWebsiteRepo } from './repo/core-website.repo'
import { DirectoryCountryRegionRepo } from './repo/directory-country-region.repo'
import { DirectoryCountryRepo } from './repo/directory-country.repo'
import { DirectoryRegionCityRepo } from './repo/directory-region-city.repo'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'

@Module({
  imports: [],
  controllers: [StoreController],
  providers: [
    StoreService,
    StoreApiService,
    CoreStoreRepo,
    CoreStoreGroupRepo,
    CoreWebsiteRepo,
    DirectoryCountryRepo,
    DirectoryCountryRegionRepo,
    DirectoryRegionCityRepo,
    provideMagentoModel(MAGENTO_MODEL_NAME.CORE_STORE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CORE_STORE_GROUP),
    provideMagentoModel(MAGENTO_MODEL_NAME.CORE_WEBSITE),
    provideMagentoModel(MAGENTO_MODEL_NAME.DIRECTORY_COUNTRY),
    provideMagentoModel(MAGENTO_MODEL_NAME.DIRECTORY_COUNTRY_REGION),
    provideMagentoModel(MAGENTO_MODEL_NAME.DIRECTORY_REGION_CITY),
  ],
  exports: [
    StoreService,
    CoreStoreRepo,
    CoreStoreGroupRepo,
    CoreWebsiteRepo,
    DirectoryCountryRegionRepo,
    DirectoryRegionCityRepo,
  ],
})
export class StoreModule {}
