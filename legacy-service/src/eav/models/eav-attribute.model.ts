import { CatalogCategoryEntityDatetime } from '@/catalog/category/models/catalog-category-entity-datetime.model'
import { CatalogCategoryEntityDecimal } from '@/catalog/category/models/catalog-category-entity-decimal.model'
import { CatalogCategoryEntityInt } from '@/catalog/category/models/catalog-category-entity-int.model'
import { CatalogCategoryEntityText } from '@/catalog/category/models/catalog-category-entity-text.model'
import { CatalogCategoryEntityVarchar } from '@/catalog/category/models/catalog-category-entity-varchar.model'
import { CustomerAddressEntityDecimal } from '@/customer/customer/models/customer-address-entity-decimal.model'
import { CustomerAddressEntityInt } from '@/customer/customer/models/customer-address-entity-int.model'
import { CustomerAddressEntityText } from '@/customer/customer/models/customer-address-entity-text.model'
import { CustomerAddressEntityVarchar } from '@/customer/customer/models/customer-address-entity-varchar.model'
import { CustomerEntityVarchar } from '@/customer/customer/models/customer-entity-varchar.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { MAGENTO_ATTRIBUTE_BACKEND_TYPE } from '../eav.types'
import { CatalogEavAttribute } from './catalog-eav-attribute.model'
import { EavAttributeOption } from './eav-attribute-option.model'
import { EavEntityType } from './eav-entity-type.model'

export type EavAttributeAttributes = InferAttributes<EavAttribute>
export type EavAttributeCreationAttributes =
  InferCreationAttributes<EavAttribute>
export class EavAttribute extends Model<
  EavAttributeAttributes,
  EavAttributeCreationAttributes
> {
  declare attributeId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeCode: string
  declare attributeModel: string
  declare backendModel: string
  declare backendType: MAGENTO_ATTRIBUTE_BACKEND_TYPE
  declare backendTable: string
  declare frontendModel: string
  declare frontendInput: string
  declare frontendLabel: string
  declare frontendClass: string
  declare sourceModel: string
  declare isRequired: number
  declare isUserDefined: number
  declare defaultValue: string
  declare isUnique: number
  declare note: string

  declare EavEntityType: NonAttribute<EavEntityType>
  declare getEavEntityType: BelongsToGetAssociationMixin<EavEntityType>

  declare CatalogEavAttribute: NonAttribute<CatalogEavAttribute>
  declare getCatalogEavAttribute: HasOneGetAssociationMixin<CatalogEavAttribute>

  declare EavAttributeOptions: NonAttribute<EavAttributeOption[]>
  declare getEavAttributeOptions: HasManyGetAssociationsMixin<EavAttributeOption>

  static associations: {
    EavEntityType: Association<EavEntityType, EavAttribute>
    CatalogCategoryDatetimes: Association<
      CatalogCategoryEntityDatetime,
      EavAttribute
    >
    CatalogCategoryDecimals: Association<
      CatalogCategoryEntityDecimal,
      EavAttribute
    >
    CatalogCategoryInts: Association<CatalogCategoryEntityInt, EavAttribute>
    CatalogCategoryTexts: Association<CatalogCategoryEntityText, EavAttribute>
    CatalogCategoryVarchars: Association<
      CatalogCategoryEntityVarchar,
      EavAttribute
    >
    CatalogEavAttribute: Association<CatalogEavAttribute, EavAttribute>
    EavAttributeOptions: Association<EavAttributeOption, EavAttribute>

    CustomerAddressEntityInts: Association<
      CustomerAddressEntityInt,
      EavAttribute
    >
    CustomerAddressEntityTexts: Association<
      CustomerAddressEntityText,
      EavAttribute
    >

    CustomerEntityVarchars: Association<CustomerEntityVarchar, EavAttribute>

    CustomerAddressEntityVarchars: Association<
      CustomerAddressEntityVarchar,
      EavAttribute
    >

    CustomerAddressEntityDecimals: Association<
      CustomerAddressEntityDecimal,
      EavAttribute
    >
  }

  static initialize(sequelize: Sequelize) {
    EavAttribute.init(
      {
        attributeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        attributeCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        attributeModel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        backendModel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        backendType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        backendTable: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        frontendModel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        frontendInput: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        frontendLabel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        frontendClass: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sourceModel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isRequired: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        isUserDefined: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        defaultValue: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isUnique: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        note: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.EAV_ATTRIBUTE,
        tableName: MAGENTO_TABLE_NAME.EAV_ATTRIBUTE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    EavAttribute.belongsTo(CustomerEntityVarchar, {
      foreignKey: 'attributeId',
    })

    EavAttribute.belongsTo(CustomerAddressEntityVarchar, {
      foreignKey: 'attributeId',
    })

    EavAttribute.belongsTo(CustomerAddressEntityInt, {
      foreignKey: 'attributeId',
    })

    EavAttribute.belongsTo(CustomerAddressEntityText, {
      foreignKey: 'attributeId',
    })

    EavAttribute.hasMany(CatalogCategoryEntityDatetime, {
      foreignKey: 'attributeId',
    })
    EavAttribute.hasMany(CatalogCategoryEntityDecimal, {
      foreignKey: 'attributeId',
    })
    EavAttribute.hasMany(CatalogCategoryEntityInt, {
      foreignKey: 'attributeId',
    })
    EavAttribute.hasMany(CatalogCategoryEntityText, {
      foreignKey: 'attributeId',
    })
    EavAttribute.hasMany(CatalogCategoryEntityVarchar, {
      foreignKey: 'attributeId',
    })
    EavAttribute.belongsTo(CustomerAddressEntityDecimal, {
      foreignKey: 'attributeId',
    })

    EavAttribute.hasMany(EavAttributeOption, {
      foreignKey: 'attributeId',
    })

    EavAttribute.hasOne(CatalogEavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
