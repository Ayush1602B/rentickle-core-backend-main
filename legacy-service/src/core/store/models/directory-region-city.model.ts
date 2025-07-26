import {
  MAGENTO_MODEL_NAME,
  MAGENTO_TABLE_NAME,
  MAX_CHAR_COLUMN_LENGTH,
} from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CoreStore } from './core-store.model'
import { DirectoryCountryRegion } from './directory-country-region.model'

export type DirectoryRegionCityAttributes = InferAttributes<DirectoryRegionCity>
export type DirectoryRegionCityCreationAttributes =
  InferCreationAttributes<DirectoryRegionCity>

export class DirectoryRegionCity extends Model<
  DirectoryRegionCityAttributes,
  DirectoryRegionCityCreationAttributes
> {
  declare cityId: CreationOptional<number>
  declare code: string
  declare defaultName: string
  declare regionId: CreationOptional<number>
  declare storeId: CreationOptional<number>

  declare DirectoryCountryRegion: NonAttribute<DirectoryCountryRegion>
  declare getDirectoryCountryRegion: BelongsToGetAssociationMixin<DirectoryCountryRegion>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  static associations: {
    DirectoryCountryRegion: Association<
      DirectoryCountryRegion,
      DirectoryRegionCity
    >
  }

  static initialize(sequelize: Sequelize) {
    DirectoryRegionCity.init(
      {
        cityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        code: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_32),
          allowNull: false,
        },
        defaultName: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_255),
          allowNull: false,
        },
        regionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.DIRECTORY_REGION_CITY,
        tableName: MAGENTO_TABLE_NAME.DIRECTORY_REGION_CITY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    DirectoryRegionCity.belongsTo(DirectoryCountryRegion, {
      foreignKey: 'regionId',
    })

    DirectoryRegionCity.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })
  }
}
