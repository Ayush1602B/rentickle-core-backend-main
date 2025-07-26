import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
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
import { CoreStoreGroup } from './core-store-group.model'
import { CoreStore } from './core-store.model'

export type CoreWebsiteAttributes = InferAttributes<CoreWebsite>
export type CoreWebsiteCreationAttributes = InferCreationAttributes<CoreWebsite>
export class CoreWebsite extends Model<
  CoreWebsiteAttributes,
  CoreWebsiteCreationAttributes
> {
  declare websiteId: CreationOptional<number>
  declare code: CreationOptional<string | null>
  declare name: CreationOptional<string | null>
  declare sortOrder: number
  declare defaultGroupId: number
  declare isDefault: CreationOptional<number | null>

  declare CoreStoreGroups: NonAttribute<CoreStoreGroup[]>
  declare getCoreStoreGroups: HasManyGetAssociationsMixin<CoreStoreGroup>

  declare CoreStores: NonAttribute<CoreStore[]>
  declare getCoreStores: HasManyGetAssociationsMixin<CoreStore>

  static associations: {
    CoreStoreGroups: Association<CoreStoreGroup, CoreWebsite>
    CoreStores: Association<CoreStore, CoreWebsite>
  }

  static initialize(sequelize: Sequelize) {
    CoreWebsite.init(
      {
        websiteId: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          autoIncrement: false,
        },
        code: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sortOrder: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        defaultGroupId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        isDefault: {
          type: DataTypes.SMALLINT,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CORE_WEBSITE,
        tableName: MAGENTO_TABLE_NAME.CORE_WEBSITE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CoreWebsite.hasMany(CoreStoreGroup, {
      foreignKey: 'websiteId',
    })

    CoreWebsite.hasMany(CoreStore, {
      foreignKey: 'websiteId',
    })
  }
}
