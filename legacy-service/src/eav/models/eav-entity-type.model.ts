import { CustomerAddressEntity } from '@/customer/customer/models/customer-address-entity.model'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { EavAttribute } from './eav-attribute.model'
import { EavEntityStore } from './eav-entity-store.model'

export class EavEntityType extends Model {
  declare entityTypeId: CreationOptional<number>
  declare entityTypeCode: string
  declare entityModel: string
  declare attributeModel: string
  declare entityTable: string
  declare valueTablePrefix: string
  declare entityIdField: string
  declare isDataSharing: number
  declare defaultAttributeSetId: number
  declare incrementModel: string
  declare incrementPerStore: number
  declare incrementPadLength: number
  declare incrementPadChar: string
  declare additionalAttributeTable: string
  declare entityAttributeCollection: string

  declare EavAttributes: NonAttribute<EavAttribute[]>
  declare getEavAttributes: HasManyGetAssociationsMixin<EavAttribute>

  declare EavEntityStores: NonAttribute<EavEntityStore[]>
  declare getEavEntityStores: HasManyGetAssociationsMixin<EavEntityStore>

  static associations: {
    EavAttributes: Association<EavAttribute, EavEntityType>
    EavEntityStores: Association<EavEntityStore, EavEntityType>
  }

  static initialize(sequelize: Sequelize) {
    EavEntityType.init(
      {
        entityTypeId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entityModel: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        attributeModel: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entityTable: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        valueTablePrefix: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entityIdField: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isDataSharing: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        defaultAttributeSetId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        incrementModel: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        incrementPerStore: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        incrementPadLength: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        incrementPadChar: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        additionalAttributeTable: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entityAttributeCollection: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ENTITY_TYPE,
        tableName: MAGENTO_TABLE_NAME.EAV_ENTITY_TYPE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavEntityType.hasMany(EavAttribute, {
      foreignKey: 'entityTypeId',
    })

    EavEntityType.hasMany(CustomerAddressEntity, {
      foreignKey: 'entityTypeId',
    })

    EavEntityType.hasMany(EavEntityStore, {
      foreignKey: 'entityTypeId',
    })

    EavEntityType.hasMany(CustomerEntity, {
      foreignKey: 'entityTypeId',
    })
  }
}
