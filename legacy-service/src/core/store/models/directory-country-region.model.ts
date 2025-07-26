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
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { DirectoryCountry } from './directory-country.model'
import { DirectoryRegionCity } from './directory-region-city.model'

export type DirectoryCountryRegionAttributes =
  InferAttributes<DirectoryCountryRegion>
export type DirectoryCountryRegionCreationAttributes =
  InferCreationAttributes<DirectoryCountryRegion>

export class DirectoryCountryRegion extends Model<
  DirectoryCountryRegionAttributes,
  DirectoryCountryRegionCreationAttributes
> {
  declare regionId: CreationOptional<number>
  declare countryId: string
  declare code: CreationOptional<string | null>
  declare defaultName: CreationOptional<string | null>

  declare DirectoryCountry: NonAttribute<DirectoryCountry>
  declare getDirectoryCountry: BelongsToGetAssociationMixin<DirectoryCountry>

  declare DirectorRegionCities: NonAttribute<DirectoryRegionCity[]>
  declare getDirectorRegionCities: HasManyGetAssociationsMixin<DirectoryRegionCity>

  static associations: {
    DirectoryCountry: Association<DirectoryCountry, DirectoryCountryRegion>
    DirectorRegionCities: Association<
      DirectoryRegionCity,
      DirectoryCountryRegion
    >
  }

  static initialize(sequelize: Sequelize) {
    DirectoryCountryRegion.init(
      {
        regionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        countryId: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_2),
          allowNull: false,
        },
        code: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_32),
          allowNull: true,
          defaultValue: null,
        },
        defaultName: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_255),
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.DIRECTORY_COUNTRY_REGION,
        tableName: MAGENTO_TABLE_NAME.DIRECTORY_COUNTRY_REGION,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    DirectoryCountryRegion.belongsTo(DirectoryCountry, {
      foreignKey: 'countryId',
    })

    DirectoryCountryRegion.hasMany(DirectoryRegionCity, {
      foreignKey: 'regionId',
    })
  }
}
