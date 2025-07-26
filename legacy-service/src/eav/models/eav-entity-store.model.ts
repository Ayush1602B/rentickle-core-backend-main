import { CoreStore } from '@/core/store/models/core-store.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { EavEntityType } from './eav-entity-type.model'

export type EavEntityStoreAttributes = InferAttributes<EavEntityStore>
export type EavEntityStoreCreationAttributes =
  InferCreationAttributes<EavEntityStore>
export class EavEntityStore extends Model<
  EavEntityStoreAttributes,
  EavEntityStoreCreationAttributes
> {
  declare entityStoreId: CreationOptional<number>
  declare entityTypeId: number
  declare storeId: number
  declare incrementPrefix: string | null
  declare incrementLastId: string | null

  declare EavEntityType: NonAttribute<EavEntityType>
  declare getEavEntityType: BelongsToGetAssociationMixin<EavEntityType>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: HasOneGetAssociationMixin<CoreStore>

  static associations: {
    EavEntityType: Association<EavEntityType, EavEntityStore>
    CoreStore: Association<CoreStore, EavEntityStore>
  }

  static initialize(sequelize: Sequelize) {
    EavEntityStore.init(
      {
        entityStoreId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        storeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        incrementPrefix: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
        },
        incrementLastId: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ENTITY_STORE,
        tableName: MAGENTO_TABLE_NAME.EAV_ENTITY_STORE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavEntityStore.belongsTo(EavEntityType, {
      foreignKey: 'entityTypeId',
    })

    EavEntityStore.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })
  }
}
