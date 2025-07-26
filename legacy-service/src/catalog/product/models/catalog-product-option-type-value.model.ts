import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CatalogProductOptionTypePrice } from './catalog-product-option-type-price.model'
import { CatalogProductOptionTypeTitle } from './catalog-product-option-type-title.model'
import { CatalogProductOption } from './catalog-product-option.model'
import { AvaCatalogProductEntityDeposit } from './ava-catalog-product-entity-deposit.model'

export class CatalogProductOptionTypeValue extends Model<
  InferAttributes<CatalogProductOptionTypeValue>,
  InferCreationAttributes<CatalogProductOptionTypeValue>
> {
  declare optionTypeId: CreationOptional<number>
  declare optionId: number
  declare sku: string
  declare sortOrder: number

  declare CatalogProductOption: NonAttribute<CatalogProductOption>
  declare getCatalogProductOption: HasManyGetAssociationsMixin<CatalogProductOption>

  declare CatalogProductOptionTypePrices: NonAttribute<
    CatalogProductOptionTypePrice[]
  >
  declare getCatalogProductOptionTypePrices: HasManyGetAssociationsMixin<CatalogProductOptionTypePrice>

  declare CatalogProductOptionTypeTitles: NonAttribute<
    CatalogProductOptionTypeTitle[]
  >
  declare getCatalogProductOptionTypeTitles: HasManyGetAssociationsMixin<CatalogProductOptionTypeTitle>

  declare AvaCatalogProductEntityDeposits: NonAttribute<
    AvaCatalogProductEntityDeposit[]
  >
  declare getAvaCatalogProductEntityDeposits: HasManyGetAssociationsMixin<AvaCatalogProductEntityDeposit>

  static initialize(sequelize: Sequelize) {
    CatalogProductOptionTypeValue.init(
      {
        optionTypeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        sku: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        sortOrder: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_VALUE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_OPTION_TYPE_VALUE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductOptionTypeValue.belongsTo(CatalogProductOption, {
      foreignKey: 'optionId',
    })

    CatalogProductOptionTypeValue.hasMany(CatalogProductOptionTypeTitle, {
      foreignKey: 'optionTypeId',
    })

    CatalogProductOptionTypeValue.hasMany(CatalogProductOptionTypePrice, {
      foreignKey: 'optionTypeId',
    })

    CatalogProductOptionTypeValue.hasMany(AvaCatalogProductEntityDeposit, {
      foreignKey: 'tenureOptionId',
    })
  }
}
