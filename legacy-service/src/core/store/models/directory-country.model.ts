import {
  MAGENTO_MODEL_NAME,
  MAGENTO_TABLE_NAME,
  MAX_CHAR_COLUMN_LENGTH,
} from '@/database/db.types'
import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { DirectoryCountryRegion } from './directory-country-region.model'

export type DirectoryCountryAttributes = InferAttributes<DirectoryCountry>
export type DirectoryCountryCreationAttributes =
  InferCreationAttributes<DirectoryCountry>

export class DirectoryCountry extends Model<
  DirectoryCountryAttributes,
  DirectoryCountryCreationAttributes
> {
  declare countryId: string
  declare iso2Code: CreationOptional<string | null>
  declare iso3Code: CreationOptional<string | null>

  declare DirectoryCountryRegion: NonAttribute<DirectoryCountryRegion[]>
  declare getDirectoryCountryRegions: HasManyGetAssociationsMixin<DirectoryCountryRegion>

  static associations: {
    DirectoryCountryRegion: Association<
      DirectoryCountryRegion,
      DirectoryCountry
    >
  }

  static initialize(sequelize: Sequelize) {
    DirectoryCountry.init(
      {
        countryId: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_2),
          primaryKey: true,
        },
        iso2Code: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_2),
          allowNull: true,
          defaultValue: null,
        },
        iso3Code: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_3),
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.DIRECTORY_COUNTRY,
        tableName: MAGENTO_TABLE_NAME.DIRECTORY_COUNTRY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    DirectoryCountry.hasMany(DirectoryCountryRegion, {
      foreignKey: 'countryId',
    })
  }
}
