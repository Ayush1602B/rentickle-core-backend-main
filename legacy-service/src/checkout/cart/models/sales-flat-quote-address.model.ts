import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { SalesFlatQuoteShippingRate } from './sales-flat-quote-shipping-rate.model'
import { SalesFlatQuote } from './sales-flat-quote.model'

export type SalesFlatQuoteAddressAttributes =
  InferAttributes<SalesFlatQuoteAddress>
export type SalesFlatQuoteAddressCreationAttributes =
  InferCreationAttributes<SalesFlatQuoteAddress>

export class SalesFlatQuoteAddress extends Model<
  SalesFlatQuoteAddressAttributes,
  SalesFlatQuoteAddressCreationAttributes
> {
  declare addressId: CreationOptional<number>
  declare quoteId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare customerId: number | null
  declare saveInAddressBook: number
  declare customerAddressId: number | null
  declare addressType: ADDRESS_TYPE | null
  declare email: string | null
  declare prefix: string | null
  declare firstname: string | null
  declare middlename: string | null
  declare lastname: string | null
  declare suffix: string | null
  declare company: string | null
  declare street: string | null
  declare city: string | null
  declare region: string | null
  declare regionId: number | null
  declare postcode: string | null
  declare countryId: string | null
  declare telephone: string | null
  declare fax: string | null
  declare cityId: string | null
  declare sameAsBilling: number
  declare freeShipping: number
  declare collectShippingRates: number
  declare shippingMethod: string | null
  declare shippingDescription: string | null
  declare weight: number
  declare subtotal: number
  declare baseSubtotal: number
  declare subtotalWithDiscount: number
  declare baseSubtotalWithDiscount: number
  declare taxAmount: number
  declare baseTaxAmount: number
  declare shippingAmount: number
  declare baseShippingAmount: number
  declare shippingTaxAmount: number | null
  declare baseShippingTaxAmount: number | null
  declare discountAmount: number
  declare baseDiscountAmount: number
  declare grandTotal: number
  declare baseGrandTotal: number
  declare customerNotes: string | null
  declare appliedTaxes: string | null
  declare discountDescription: string | null
  declare shippingDiscountAmount: number | null
  declare baseShippingDiscountAmount: number | null
  declare subtotalInclTax: number | null
  declare baseSubtotalTotalInclTax: number | null
  declare hiddenTaxAmount: number | null
  declare baseHiddenTaxAmount: number | null
  declare shippingHiddenTaxAmount: number | null
  declare baseShippingHiddenTaxAmnt: number | null
  declare shippingInclTax: number | null
  declare baseShippingInclTax: number | null
  declare vatId: string | null
  declare vatIsValid: number | null
  declare vatRequestId: string | null
  declare vatRequestDate: string | null
  declare vatRequestSuccess: number | null
  declare giftMessageId: number | null
  declare creditpointAmount: number
  declare baseCreditpointAmount: number
  declare refundableDeposit: number
  declare baseRefundableDeposit: number
  declare depositDiscount: number
  declare baseDepositDiscount: number

  declare SalesFlatQuote: NonAttribute<SalesFlatQuote>
  declare getSalesFlatQuote: BelongsToGetAssociationMixin<SalesFlatQuote>

  declare SalesFlatQuoteShippingRate: NonAttribute<SalesFlatQuoteShippingRate>
  declare getSalesFlatQuoteShippingRate: HasOneGetAssociationMixin<SalesFlatQuoteShippingRate>

  static associations: {
    SalesFlatQuote: Association<SalesFlatQuote, SalesFlatQuoteAddress>
    SalesFlatQuoteShippingRate: Association<
      SalesFlatQuoteShippingRate,
      SalesFlatQuoteAddress
    >
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatQuoteAddress.init(
      {
        addressId: {
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
        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        saveInAddressBook: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          defaultValue: 0,
        },
        customerAddressId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        addressType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        prefix: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        firstname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        middlename: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        lastname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        suffix: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        company: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        street: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        region: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        regionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        postcode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        countryId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        telephone: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        fax: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        cityId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        sameAsBilling: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        freeShipping: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        collectShippingRates: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        shippingMethod: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        shippingDescription: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        weight: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        subtotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseSubtotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        subtotalWithDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseSubtotalWithDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        taxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        grandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseGrandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        customerNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        appliedTaxes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        discountDescription: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        shippingDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        subtotalInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseSubtotalTotalInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        hiddenTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseHiddenTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        shippingHiddenTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingHiddenTaxAmnt: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        shippingInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        vatId: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        vatIsValid: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
        vatRequestId: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        vatRequestDate: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        vatRequestSuccess: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
        giftMessageId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        creditpointAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        baseCreditpointAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        refundableDeposit: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseRefundableDeposit: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        depositDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseDepositDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ADDRESS,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_QUOTE_ADDRESS,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatQuoteAddress.belongsTo(SalesFlatQuote, {
      foreignKey: 'quoteId',
    })

    SalesFlatQuoteAddress.hasOne(SalesFlatQuoteShippingRate, {
      foreignKey: 'addressId',
    })
  }

  setCart(cart: SalesFlatQuote) {
    this.quoteId = cart.entityId
    this.SalesFlatQuote = cart

    return this
  }

  hasPostcode() {
    return Boolean(this.postcode)
  }
}
