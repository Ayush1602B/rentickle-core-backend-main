import { MAGENTO_ADMIN_STORE_ID, MAGENTO_MODEL_NAME } from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { CoreStoreGroup } from '../models/core-store-group.model'
import { CoreStore } from '../models/core-store.model'
import { StoreDto } from './store-common.dto'

export interface IStoreApiService {
  getAll(includeInactive?: boolean): Promise<StoreDto[]>
  getById(storeId: number): Promise<StoreDto | null>
}

@Injectable()
export class StoreApiService implements IStoreApiService {
  constructor(
    @Inject(MAGENTO_MODEL_NAME.CORE_STORE)
    private readonly magentoCoreStoreModel: typeof CoreStore,
  ) {}

  private toStoreDto(store: CoreStore): StoreDto {
    return new StoreDto({
      id: store.storeId,
      code: store.code,
      name: store.name,
      sortOrder: store.sortOrder,
      isActive: store.isActive === 1,
      StoreGroup: store.CoreStoreGroup?.toJSON(),
    })
  }

  async getAll(includeInactive = false): Promise<StoreDto[]> {
    const allStoresExcludingAdmin = await this.magentoCoreStoreModel.findAll({
      where: {
        isActive: includeInactive ? [true, false] : true,
        storeId: { [Op.ne]: MAGENTO_ADMIN_STORE_ID },
      },
    })

    return allStoresExcludingAdmin.map(this.toStoreDto)
  }

  async getById(storeId: number): Promise<StoreDto | null> {
    const magentoStore = await this.magentoCoreStoreModel.findByPk(storeId, {
      include: [
        {
          model: CoreStoreGroup,
        },
      ],
    })
    if (!magentoStore) {
      return null
    }

    return this.toStoreDto(magentoStore)
  }
}
