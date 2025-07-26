import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { StoreApiService } from './api/store-api.service'
import { StoreDto } from './api/store-common.dto'

@Controller('stores')
export class StoreController {
  constructor(private readonly storeApiService: StoreApiService) {}

  @Get('/')
  getAllStores(): Promise<StoreDto[]> {
    return this.storeApiService.getAll()
  }

  @Get('/:storeId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getStoreById(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<StoreDto> {
    const store = await this.storeApiService.getById(storeId)
    return store
  }

  @Post('/:storeId/choose')
  async selectStore(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<StoreDto> {
    const selectedStore = await this.storeApiService.selectStore(storeId)
    return selectedStore
  }
}
