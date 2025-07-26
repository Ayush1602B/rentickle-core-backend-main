import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { CatalogProductOption } from './catalog-product-option.model'

export class CatalogProductOptionPrice extends Model<
  InferAttributes<CatalogProductOptionPrice>,
  InferCreationAttributes<CatalogProductOptionPrice>
> {
  declare optionPriceId: CreationOptional<number>
  declare optionId: number
  declare storeId: number
  declare price: number
  declare priceType: string

  static initialize(sequelize: Sequelize) {
    CatalogProductOptionPrice.init(
      {
        optionPriceId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        price: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        priceType: {
          type: DataTypes.STRING(7),
          allowNull: false,
          defaultValue: 'fixed',
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOG_PRODUCT_OPTION_PRICE,
        tableName: MAGENTO_TABLE_NAME.CATALOG_PRODUCT_OPTION_PRICE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CatalogProductOptionPrice.belongsTo(CatalogProductOption, {
      foreignKey: 'optionId',
    })
  }
}
