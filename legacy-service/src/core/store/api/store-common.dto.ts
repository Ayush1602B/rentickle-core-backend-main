import { BaseDto } from '@/shared/api/api.types'
import { ApiProperty } from '@nestjs/swagger'
import { CoreStoreGroup } from '../models/core-store-group.model'
import { CoreStore } from '../models/core-store.model'
import { DirectoryRegionCity } from '../models/directory-region-city.model'

class StoreGroupDto extends BaseDto<StoreGroupDto> {
  @ApiProperty()
  declare groupId: number
  @ApiProperty()
  declare websiteId: number
  @ApiProperty()
  declare name: string
  @ApiProperty()
  declare rootCategoryId: number
  @ApiProperty()
  declare defaultStoreId: number

  static fromEntity(storeGroup: CoreStoreGroup): Promise<StoreGroupDto> {
    return Promise.resolve(
      new StoreGroupDto({
        groupId: storeGroup.groupId,
        websiteId: storeGroup.websiteId,
        name: storeGroup.name,
        rootCategoryId: storeGroup.rootCategoryId,
        defaultStoreId: storeGroup.defaultStoreId,
      }),
    )
  }
}

class StoreCityDto extends BaseDto<StoreCityDto> {
  @ApiProperty()
  declare cityId: number
  @ApiProperty()
  declare cityName: string
  @ApiProperty()
  declare regionId: number
  @ApiProperty()
  declare regionName: string
  @ApiProperty()
  declare regionCode: string
  @ApiProperty()
  declare countryId: string

  static async fromEntity(city: DirectoryRegionCity): Promise<StoreCityDto> {
    const cityRegion = await city.getDirectoryCountryRegion()

    return new StoreCityDto({
      cityId: city.cityId,
      cityName: city.defaultName,
      regionId: city.regionId,
      regionName: cityRegion.defaultName!,
      regionCode: cityRegion.code!,
      countryId: 'IN',
    })
  }
}

export class StoreDto extends BaseDto<StoreDto> {
  @ApiProperty()
  declare id: number
  @ApiProperty()
  declare name: string
  @ApiProperty()
  declare code: string | null
  @ApiProperty()
  declare sortOrder: number
  @ApiProperty()
  declare isActive: boolean

  @ApiProperty({ type: StoreGroupDto })
  declare StoreGroup: StoreGroupDto

  @ApiProperty({ type: StoreCityDto, isArray: true })
  declare mappedCities: StoreCityDto[]

  static async fromEntity(store: CoreStore): Promise<StoreDto> {
    const storeCities = await store.getDirectoryRegionCities()
    return new StoreDto({
      id: store.storeId,
      name: store.name,
      code: store.code,
      sortOrder: store.sortOrder,
      isActive: store.isActive === 1,
      StoreGroup: store.CoreStoreGroup
        ? await StoreGroupDto.fromEntity(store.CoreStoreGroup)
        : undefined,
      mappedCities: await Promise.all(
        (storeCities || []).map((city) => {
          return StoreCityDto.fromEntity(city)
        }),
      ),
    })
  }
}
