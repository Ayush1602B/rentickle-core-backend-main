import { DEFAULT_STORE_ID } from '@/database/db.types'
import { Injectable } from '@nestjs/common'
import { Op, WhereOptions } from 'sequelize'
import { CoreConfigData } from './models/core-config-data.model'
import { CoreConfigDataRepo } from './repo/core-config-data.repo'

interface ICoreConfigService {
  get(path: string, storeId?: number): Promise<CoreConfigData | null>
  getAll(pathLike: string, storeId?: number): Promise<CoreConfigData[]>
}

@Injectable()
export class CoreConfigService implements ICoreConfigService {
  constructor(private readonly coreConfigDataRepo: CoreConfigDataRepo) {}

  async get(
    path: string,
    storeId: number = DEFAULT_STORE_ID,
  ): Promise<CoreConfigData | null> {
    const configRow = await this.coreConfigDataRepo.findOne({
      where: {
        path,
        scopeId: storeId,
      },
    })

    if (!configRow) {
      return null
    }

    return configRow
  }

  async getAll(pathLike: string, storeId?: number): Promise<CoreConfigData[]> {
    let query: WhereOptions<CoreConfigData> = {
      path: {
        [Op.like]: `${pathLike}%`,
      },
    }

    if (storeId) {
      query = {
        ...query,
        scopeId: storeId,
      }
    }

    const configRows = await this.coreConfigDataRepo.findAll({
      where: query,
    })

    return configRows
  }
}
