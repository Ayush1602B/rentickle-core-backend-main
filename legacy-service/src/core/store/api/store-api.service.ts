import { Injectable } from '@nestjs/common'
import { StoreNotFoundExeption } from '../store.errors'
import { StoreService } from '../store.service'
import { StoreDto } from './store-common.dto'

export interface IStoreApiService {
  getAll(includeInactive?: boolean): Promise<StoreDto[]>
  getById(storeId: number): Promise<StoreDto>
  selectStore(storeId: number): Promise<StoreDto>
}

@Injectable()
export class StoreApiService implements IStoreApiService {
  constructor(private readonly storeService: StoreService) {}

  async getAll(): Promise<StoreDto[]> {
    const allStoresExcludingAdmin = await this.storeService.getActiveStores()

    return Promise.all(
      allStoresExcludingAdmin.map((store) => StoreDto.fromEntity(store)),
    )
  }

  async getById(storeId: number): Promise<StoreDto> {
    const magentoStore = await this.storeService.getById(storeId)
    if (!magentoStore) {
      throw new StoreNotFoundExeption()
    }

    const storeGroup = await magentoStore.getCoreStoreGroup()
    magentoStore.CoreStoreGroup = storeGroup

    return StoreDto.fromEntity(magentoStore)
  }

  async selectStore(storeId: number): Promise<StoreDto> {
    const magentoStore = await this.storeService.getById(storeId)
    if (!magentoStore) {
      throw new StoreNotFoundExeption()
    }

    return StoreDto.fromEntity(magentoStore)
  }
}
