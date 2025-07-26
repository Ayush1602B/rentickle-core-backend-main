import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { SalesFlatQuoteAddress } from './sales-flat-quote-address.model'

export type SalesFlatQuoteShippingRateAttributes =
  InferAttributes<SalesFlatQuoteShippingRate>
export type SalesFlatQuoteShippingRateCreationAttributes =
  InferCreationAttributes<SalesFlatQuoteShippingRate>

export class SalesFlatQuoteShippingRate extends Model<
  SalesFlatQuoteShippingRateAttributes,
  SalesFlatQuoteShippingRateCreationAttributes
> {
  declare rateId: CreationOptional<number>
  declare addressId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare carrier: CreationOptional<string | null>
  declare carrierTitle: CreationOptional<string | null>
  declare code: CreationOptional<string | null>
  declare method: CreationOptional<string | null>
  declare methodDescription: CreationOptional<string | null>
  declare price: number
  declare errorMessage: CreationOptional<string | null>
  declare methodTitle: CreationOptional<string | null>

  declare SalesFlatQuoteAddress: NonAttribute<SalesFlatQuoteAddress>
  declare getSalesFlatQuoteAddress: BelongsToGetAssociationMixin<SalesFlatQuoteAddress>

  static associations: {
    SalesFlatQuoteAddress: Association<
      SalesFlatQuoteAddress,
      SalesFlatQuoteShippingRate
    >
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatQuoteShippingRate.init(
      {
        rateId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        addressId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        carrier: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        carrierTitle: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        code: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        method: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        methodDescription: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        errorMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        methodTitle: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_SHIPPING_RATE,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_QUOTE_SHIPPING_RATE,
        timestamps: true,
        underscored: true,
      },
    )
  }
  static associate() {
    SalesFlatQuoteShippingRate.belongsTo(SalesFlatQuoteAddress, {
      foreignKey: 'addressId',
    })
  }

  isShippingApplied(): boolean {
    return this.method !== null && this.method !== ''
  }
}
