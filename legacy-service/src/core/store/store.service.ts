import { MAGENTO_ADMIN_STORE_ID } from '@/database/db.types'
import { Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { CoreStore } from './models/core-store.model'
import { DirectoryCountryRegion } from './models/directory-country-region.model'
import { DirectoryRegionCity } from './models/directory-region-city.model'
import { CoreStoreRepo } from './repo/core-store.repo'
import { DirectoryCountryRegionRepo } from './repo/directory-country-region.repo'
import { DirectoryRegionCityRepo } from './repo/directory-region-city.repo'
import {
  LocationCityNotFoundException,
  StoreNotFoundExeption,
} from './store.errors'

export interface IStoreService {
  getById(storeId: number): Promise<CoreStore | null>
  getAll(): Promise<CoreStore[]>
  getActiveStores(): Promise<CoreStore[]>
  getAssociatedCities(store: CoreStore): Promise<DirectoryRegionCity[]>
  validateAndGetStoreById(storeId: number): Promise<CoreStore>
  validateAndGetCityById(cityId: number): Promise<DirectoryRegionCity>
  validateAndGetRegionById(regionId: number): Promise<DirectoryCountryRegion>
}

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly coreStoreRepo: CoreStoreRepo,
    private readonly directoryRegionCityRepo: DirectoryRegionCityRepo,
    private readonly directoryCountryRegionRepo: DirectoryCountryRegionRepo,
  ) {}

  getById(storeId: number): Promise<CoreStore | null> {
    return this.coreStoreRepo.findOneByPk(storeId.toString())
  }

  getAll(): Promise<CoreStore[]> {
    return this.coreStoreRepo.findAll()
  }

  getActiveStores(): Promise<CoreStore[]> {
    return this.coreStoreRepo.findAll({
      where: {
        isActive: true,
        storeId: { [Op.ne]: MAGENTO_ADMIN_STORE_ID },
      },
    })
  }

  async getAssociatedCities(store: CoreStore): Promise<DirectoryRegionCity[]> {
    const cities = await this.directoryRegionCityRepo.findAll({
      where: {
        storeId: store.storeId,
      },
    })

    return cities
  }

  async validateAndGetStoreById(storeId: number): Promise<CoreStore> {
    const store = await this.getById(storeId)
    if (!store || !store.isStoreActive()) {
      throw new StoreNotFoundExeption(`Store with ID ${storeId} not found`)
    }

    return store
  }

  async validateAndGetCityById(cityId: number): Promise<DirectoryRegionCity> {
    const city = await this.directoryRegionCityRepo.findOneByPk(
      cityId.toString(),
    )
    if (!city) {
      throw new LocationCityNotFoundException(
        `City with ID ${cityId} not found`,
      )
    }

    return city
  }

  async validateAndGetRegionById(
    regionId: number,
  ): Promise<DirectoryCountryRegion> {
    const region = await this.directoryCountryRegionRepo.findOneByPk(
      regionId.toString(),
    )
    if (!region) {
      throw new LocationCityNotFoundException(
        `Region with ID ${regionId} not found`,
      )
    }

    return region
  }
}
