import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { SalesFlatQuoteItem } from './sales-flat-quote-item.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'

export type SalesFlatQuoteItemOptionAttributes =
  InferAttributes<SalesFlatQuoteItemOption>
export type SalesFlatQuoteItemOptionCreationAttributes =
  InferCreationAttributes<SalesFlatQuoteItemOption>

export class SalesFlatQuoteItemOption extends Model<
  SalesFlatQuoteItemOptionAttributes,
  SalesFlatQuoteItemOptionCreationAttributes
> {
  declare optionId: CreationOptional<number>
  declare itemId: number
  declare productId: number | null
  declare code: string
  declare value: string

  static initialize(sequelize: Sequelize) {
    SalesFlatQuoteItemOption.init(
      {
        optionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        itemId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        code: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        value: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ITEM_OPTION,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_QUOTE_ITEM_OPTION,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatQuoteItemOption.belongsTo(SalesFlatQuoteItem, {
      foreignKey: 'itemId',
    })
  }
}
