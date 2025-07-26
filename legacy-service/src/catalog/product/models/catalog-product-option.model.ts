import {
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
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { CatalogProductEntity } from './catalog-product-entity.model'
import { CatalogProductOptionPrice } from './catalog-product-option-price.model'
import { CatalogProductOptionTitle } from './catalog-product-option-title.model'
import { CatalogProductOptionTypeValue } from './catalog-product-option-type-value.model'
import { CatalogProductOptionTypePrice } from './catalog-product-option-type-price.model'

export class CatalogProductOption extends Model<
  InferAttributes<CatalogProductOption>,
  InferCreationAttributes<CatalogProductOption>
> {
  declare optionId: CreationOptional<number>
  declare productId: number
  declare type: string | null
  declare isRequire: number
  declare sku: string | null
  declare maxCharacters: number | null
  declare fileExtension: string | null
  declare imageSizeX: number | null
  declare imageSizeY: number | null
  declare sortOrder: number

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntity: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare CatalogProductOptionTitles: NonAttribute<CatalogProductOptionTitle[]>
  declare getCatalogProductOptionTitles: HasManyGetAssociationsMixin<CatalogProductOptionTitle>

  declare CatalogProductOptionPrices: NonAttribute<CatalogProductOptionPrice[]>
  declare getCatalogProductOptionPrices: HasManyGetAssociationsMixin<CatalogProductOptionPrice>

  declare CatalogProductOptionTypePrices: NonAttribute<
    CatalogProductOptionTypePrice[]
  >
  declare getCatalogProductOptionTypePrices: HasManyGetAssociationsMixin<CatalogProductOptionTypePrice>

  declare CatalogProductOptionTypeValues: NonAttribute<
    CatalogProductOptionTypeValue[]
  >
  declare getCatalogProductOptionTypeValues: HasManyGetAssociationsMixin<CatalogProductOptionTypeValue>

  static initialize(sequelize: Sequelize) {
    CatalogProductOption.init(
      {
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        type: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        isRequire: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1,
        },
        sku: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        maxCharacters: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        fileExtension: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        imageSizeX: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        imageSizeY: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        sortOrder: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_OPTION,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductOption.belongsTo(CatalogProductEntity, {
      foreignKey: 'productId',
    })
    CatalogProductOption.hasMany(CatalogProductOptionPrice, {
      foreignKey: 'optionId',
    })
    CatalogProductOption.hasMany(CatalogProductOptionTitle, {
      foreignKey: 'optionId',
    })
    CatalogProductOption.hasMany(CatalogProductOptionTypeValue, {
      foreignKey: 'optionId',
    })
  }
}
