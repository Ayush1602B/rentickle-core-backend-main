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
import { CoreStoreGroup } from './core-store-group.model'
import { CoreWebsite } from './core-website.model'
import { DirectoryRegionCity } from './directory-region-city.model'

export type CoreStoreAttributes = InferAttributes<CoreStore>
export type CoreStoreCreationAttributes = InferCreationAttributes<CoreStore>

export class CoreStore extends Model<
  CoreStoreAttributes,
  CoreStoreCreationAttributes
> {
  declare storeId: CreationOptional<number>
  declare code: CreationOptional<string | null>
  declare websiteId: number
  declare groupId: number
  declare name: string
  declare sortOrder: CreationOptional<number>
  declare isActive: CreationOptional<number>

  declare CoreStoreGroup: NonAttribute<CoreStoreGroup>
  declare getCoreStoreGroup: BelongsToGetAssociationMixin<CoreStoreGroup>

  declare CoreWebsite: NonAttribute<CoreWebsite>
  declare getCoreWebsite: BelongsToGetAssociationMixin<CoreWebsite>

  declare DirectoryRegionCities: NonAttribute<DirectoryRegionCity[]>
  declare getDirectoryRegionCities: HasManyGetAssociationsMixin<DirectoryRegionCity>

  static associations: {
    CoreStoreGroup: Association<CoreStoreGroup, CoreStore>
    CoreWebsite: Association<CoreWebsite, CoreStore>
    DirectoryRegionCities: Association<DirectoryRegionCity, CoreStore>
  }

  static initialize(sequelize: Sequelize) {
    CoreStore.init(
      {
        storeId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        websiteId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        groupId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        name: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_255),
          allowNull: false,
        },
        sortOrder: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          defaultValue: 0,
        },
        isActive: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CORE_STORE,
        tableName: MAGENTO_TABLE_NAME.CORE_STORE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CoreStore.belongsTo(CoreStoreGroup, {
      foreignKey: 'groupId',
    })

    CoreStore.belongsTo(CoreWebsite, {
      foreignKey: 'websiteId',
    })

    CoreStore.hasMany(DirectoryRegionCity, {
      foreignKey: 'storeId',
    })
  }

  isStoreActive(): boolean {
    return this.isActive === 1
  }
}
