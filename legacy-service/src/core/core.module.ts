import { Module } from '@nestjs/common'
import { CmsModule } from './cms/cms.module'
import { CoreConfigModule } from './config/core-config.module'
import { StoreModule } from './store/store.module'

@Module({
  imports: [CoreConfigModule, StoreModule, CmsModule],
  exports: [CoreConfigModule, StoreModule, CmsModule],
})
export class CoreModule {}
