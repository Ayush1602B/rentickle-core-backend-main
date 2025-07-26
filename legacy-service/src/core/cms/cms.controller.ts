import { BaseRequest } from '@/shared/api/api.types'
import { Controller, Get, Req } from '@nestjs/common'
import { StoreService } from '../store/store.service'
import { CmsService } from './cms.service'
import { BannerDto } from './api/dto/cms-common.dto'
import { CatalogHelper } from '@/catalog/catalog.helper'

@Controller('cms')
export class CmsController {
  constructor(
    private readonly cmsService: CmsService,
    private readonly storeService: StoreService,
    private readonly catalogHelper: CatalogHelper,
  ) {}

  @Get('/banners')
  async getAllBanners(@Req() req: BaseRequest): Promise<BannerDto[]> {
    const store = await this.storeService.validateAndGetStoreById(req.storeId)
    const storeBanners = await this.cmsService.getBannersForStore(store)

    return storeBanners.map((banner) =>
      BannerDto.fromEntity(this.catalogHelper, banner),
    )
  }
}
