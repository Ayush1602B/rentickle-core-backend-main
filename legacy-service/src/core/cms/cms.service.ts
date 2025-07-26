import { DEFAULT_STORE_VIEW_ID } from '@/database/db.types'
import { Injectable } from '@nestjs/common'
import { CoreStore } from '../store/models/core-store.model'
import { BANNER_STATUS } from './cms.types'
import { BannerEntity } from './models'
import { BannerEntityRepo } from './repo'

interface ICmsService {
  getBannersForStore(store: CoreStore): Promise<BannerEntity[]>
}

@Injectable()
export class CmsService implements ICmsService {
  constructor(private readonly bannerEntityRepo: BannerEntityRepo) {}
  /**
   * Fetches banners for the given store.
   * It first retrieves all banners, then filters them based on the store ID and the default store view ID.
   * The banners are sorted by their order before being returned.
   *
   * @param store - The store for which to fetch banners.
   * @returns A promise that resolves to an array of BannerEntity objects.
   */
  async getBannersForStore(store: CoreStore): Promise<BannerEntity[]> {
    const allBanners = await this.bannerEntityRepo.findAll({
      where: { status: BANNER_STATUS.ENABLED },
      order: [['order', 'ASC']],
    })

    const defaultBanners = allBanners.filter(
      (banner) =>
        banner.storeId.indexOf(DEFAULT_STORE_VIEW_ID.toString()) !== -1,
    )

    if (store.storeId === DEFAULT_STORE_VIEW_ID) {
      return defaultBanners.sort((a, b) => a.order - b.order)
    }

    const storeBanners = allBanners.filter(
      (banner) => banner.storeId.indexOf(store.storeId.toString()) !== -1,
    )

    return [...defaultBanners, ...storeBanners].sort(
      (a, b) => a.order - b.order,
    )
  }
}
