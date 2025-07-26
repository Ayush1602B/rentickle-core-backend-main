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
import { CoreStore } from './core-store.model'
import { CoreWebsite } from './core-website.model'
import {
  MAGENTO_MODEL_NAME,
  MAGENTO_TABLE_NAME,
  MAX_CHAR_COLUMN_LENGTH,
} from '@/database/db.types'

export type CoreStoreGroupAttributes = InferAttributes<CoreStoreGroup>
export type CoreStoreGroupCreationAttributes =
  InferCreationAttributes<CoreStoreGroup>

export class CoreStoreGroup extends Model<
  CoreStoreGroupAttributes,
  CoreStoreGroupCreationAttributes
> {
  declare groupId: CreationOptional<number>
  declare websiteId: number
  declare name: string
  declare rootCategoryId: number
  declare defaultStoreId: number

  declare CoreStores: NonAttribute<CoreStore[]>
  declare getCoreStores: HasManyGetAssociationsMixin<CoreStore>

  declare CoreWebsite: NonAttribute<CoreWebsite>
  declare getCoreWebsite: BelongsToGetAssociationMixin<CoreWebsite>

  static associations: {
    CoreStores: Association<CoreStore, CoreStoreGroup>
    CoreWebsite: Association<CoreWebsite, CoreStoreGroup>
  }

  static initialize(sequelize: Sequelize) {
    CoreStoreGroup.init(
      {
        groupId: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          autoIncrement: false,
        },
        websiteId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        name: {
          type: DataTypes.CHAR(MAX_CHAR_COLUMN_LENGTH.CHAR_255),
          allowNull: false,
        },
        rootCategoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        defaultStoreId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CORE_STORE_GROUP,
        tableName: MAGENTO_TABLE_NAME.CORE_STORE_GROUP,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CoreStoreGroup.belongsTo(CoreWebsite, {
      foreignKey: 'websiteId',
    })

    CoreStoreGroup.hasMany(CoreStore, {
      foreignKey: 'groupId',
    })
  }
}
