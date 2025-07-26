import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { SalesFlatQuote } from './sales-flat-quote.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'

export type SalesFlatQuotePaymentAttributes =
  InferAttributes<SalesFlatQuotePayment>
export type SalesFlatQuotePaymentCreationAttributes =
  InferCreationAttributes<SalesFlatQuotePayment>

export class SalesFlatQuotePayment extends Model<
  SalesFlatQuotePaymentAttributes,
  SalesFlatQuotePaymentCreationAttributes
> {
  declare paymentId: CreationOptional<number>
  declare quoteId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare method: CreationOptional<string | null>
  declare ccType: CreationOptional<string | null>
  declare ccNumberEnc: CreationOptional<string | null>
  declare ccLast4: CreationOptional<string | null>
  declare ccCidEnc: CreationOptional<string | null>
  declare ccOwner: CreationOptional<string | null>
  declare ccExpMonth: CreationOptional<number | null>
  declare ccExpYear: CreationOptional<number | null>
  declare ccSsOwner: CreationOptional<string | null>
  declare ccSsStartMonth: CreationOptional<number>
  declare ccSsStartYear: CreationOptional<number>
  declare poNumber: CreationOptional<string | null>
  declare additionalData: CreationOptional<string | null>
  declare ccSsIssue: CreationOptional<string | null>
  declare additionalInformation: CreationOptional<string | null>
  declare paypalPayerId: CreationOptional<string | null>
  declare paypalPayerStatus: CreationOptional<string | null>
  declare paypalCorrelationId: CreationOptional<string | null>

  declare SalesFlatQuote: NonAttribute<SalesFlatQuote>
  declare getSalesFlatQuote: BelongsToGetAssociationMixin<SalesFlatQuote>

  static initialize(sequelize: Sequelize) {
    SalesFlatQuotePayment.init(
      {
        paymentId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        quoteId: {
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
        method: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccNumberEnc: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccLast4: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccCidEnc: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccOwner: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccExpMonth: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        ccExpYear: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        ccSsOwner: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccSsStartMonth: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        ccSsStartYear: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        poNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        additionalData: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        ccSsIssue: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        additionalInformation: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        paypalPayerId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        paypalPayerStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        paypalCorrelationId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_PAYMENT,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_QUOTE_PAYMENT,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatQuotePayment.belongsTo(SalesFlatQuote, {
      foreignKey: 'quoteId',
    })
  }

  setCart(cart: SalesFlatQuote) {
    this.quoteId = cart.entityId
    this.SalesFlatQuote = cart

    return this
  }
}
