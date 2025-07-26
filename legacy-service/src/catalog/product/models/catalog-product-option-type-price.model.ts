import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize'
import { MAGENTO_TABLE_NAME, MAGENTO_MODEL_NAME } from '@/database/db.types'
import { CatalogProductOptionTypeValue } from './catalog-product-option-type-value.model'

export class CatalogProductOptionTypePrice extends Model<
  InferAttributes<CatalogProductOptionTypePrice>,
  InferCreationAttributes<CatalogProductOptionTypePrice>
> {
  declare optionTypePriceId: CreationOptional<number>
  declare optionTypeId: number
  declare storeId: number
  declare price: number
  declare priceType: string

  static initialize(sequelize: Sequelize) {
    CatalogProductOptionTypePrice.init(
      {
        optionTypePriceId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        optionTypeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        price: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        priceType: {
          type: DataTypes.ENUM('fixed', 'percentage'),
          allowNull: false,
          defaultValue: 'fixed',
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_TYPE_PRICE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_OPTION_TYPE_PRICE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductOptionTypePrice.belongsTo(CatalogProductOptionTypeValue, {
      foreignKey: 'optionTypeId',
    })
  }
}
