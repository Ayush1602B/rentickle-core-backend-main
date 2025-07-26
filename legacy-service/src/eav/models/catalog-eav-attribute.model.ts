import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  BelongsToGetAssociationMixin,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { EavAttribute } from './eav-attribute.model'

export type CatalogEavAttributeAttributes = InferAttributes<CatalogEavAttribute>
export type CatalogEavAttributeCreationAttributes =
  InferCreationAttributes<CatalogEavAttribute>

export class CatalogEavAttribute extends Model<
  CatalogEavAttributeAttributes,
  CatalogEavAttributeCreationAttributes
> {
  declare attributeId: ForeignKey<number>
  declare frontendInputRenderer: string | null
  declare isGlobal: number
  declare isVisible: number
  declare isSearchable: number
  declare isFilterable: number
  declare isComparable: number
  declare isVisibleOnFront: number
  declare isHtmlAllowedOnFront: number
  declare isUsedForPriceRules: number
  declare isFilterableInSearch: number
  declare usedInProductListing: number
  declare usedForSortBy: number
  declare isConfigurable: number
  declare applyTo: string | null
  declare isVisibleInAdvancedSearch: number
  declare position: number
  declare isWysiwygEnabled: number
  declare isUsedForPromoRules: number

  declare EavAttribute: NonAttribute<EavAttribute>
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static initialize(sequelize: Sequelize) {
    CatalogEavAttribute.init(
      {
        attributeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        frontendInputRenderer: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isGlobal: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1,
        },
        isVisible: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1,
        },
        isSearchable: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isFilterable: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isComparable: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isVisibleOnFront: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isHtmlAllowedOnFront: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isUsedForPriceRules: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isFilterableInSearch: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        usedInProductListing: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        usedForSortBy: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isConfigurable: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1,
        },
        applyTo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isVisibleInAdvancedSearch: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 1,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isWysiwygEnabled: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        isUsedForPromoRules: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_EAV_ATTRIBUTE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_EAV_ATTRIBUTE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogEavAttribute.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
