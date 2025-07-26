import { DatabaseModule } from '@/database/db.module'
import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { provideMagentoModel } from '@/database/db.utils'
import { Module } from '@nestjs/common'
import { EavService } from './eav.service'
import { EavAttributeSetRepo } from './repo/eav-attribute-set.repo'
import { EavAttributeRepo } from './repo/eav-attribute.repo'
import { EavEntityStoreRepo } from './repo/eav-entity-store.repo'
import { EavEntityTypeRepo } from './repo/eav-entity-type.repo'

@Module({
  imports: [DatabaseModule],
  providers: [
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ENTITY_TYPE),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ENTITY_STORE),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ENTITY_ATTRIBUTE),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_SET),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_GROUP),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_OPTION),
    provideMagentoModel(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE_OPTION_VALUE),
    provideMagentoModel(MAGENTO_MODEL_NAME.CATALOG_EAV_ATTRIBUTE),
    EavService,
    EavAttributeRepo,
    EavEntityTypeRepo,
    EavEntityStoreRepo,
    EavAttributeSetRepo,
  ],
  exports: [
    EavService,
    EavEntityStoreRepo,
    EavEntityTypeRepo,
    EavAttributeSetRepo,
    EavAttributeRepo,
  ],
})
export class EavModule {}
