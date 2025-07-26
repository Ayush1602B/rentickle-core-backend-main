import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { CatalogProductOptionTypeValue } from '@/catalog/product/models/catalog-product-option-type-value.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { SalesFlatOrderItem } from '@/sales/order/models/sales-flat-order-item.model'
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
import { CART_ITEM_OPTION_CODE } from '../cart.types'
import { SalesFlatQuoteItemOption } from './sales-flat-quote-item-option.model'
import { SalesFlatQuote } from './sales-flat-quote.model'

export type SalesFlatQuoteItemAttributes = InferAttributes<SalesFlatQuoteItem>
export type SalesFlatQuoteItemCreationAttributes =
  InferCreationAttributes<SalesFlatQuoteItem>

export class SalesFlatQuoteItem extends Model<
  SalesFlatQuoteItemAttributes,
  SalesFlatQuoteItemCreationAttributes
> {
  declare itemId: CreationOptional<number>
  declare quoteId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare productId: CreationOptional<number | null>
  declare storeId: CreationOptional<number | null>
  declare parentItemId: CreationOptional<number | null>
  declare isVirtual: CreationOptional<number | null>
  declare sku: string | null
  declare name: string | null
  declare description: string | null
  declare appliedRuleIds: string | null
  declare additionalData: string | null
  declare freeShipping: number
  declare isQtyDecimal: CreationOptional<number | null>
  declare noDiscount: number
  declare weight: number
  declare qty: number
  declare price: number
  declare basePrice: number
  declare customPrice: CreationOptional<number | null>
  declare discountPercent: number
  declare discountAmount: number
  declare baseDiscountAmount: number
  declare taxPercent: number
  declare taxAmount: number
  declare baseTaxAmount: number
  declare rowTotal: number
  declare baseRowTotal: number
  declare rowTotalWithDiscount: number
  declare rowWeight: number
  declare productType: string | null
  declare baseTaxBeforeDiscount: CreationOptional<number | null>
  declare taxBeforeDiscount: CreationOptional<number | null>
  declare originalCustomPrice: CreationOptional<number | null>
  declare redirectUrl: string | null
  declare baseCost: CreationOptional<number | null>
  declare priceInclTax: CreationOptional<number | null>
  declare basePriceInclTax: CreationOptional<number | null>
  declare rowTotalInclTax: CreationOptional<number>
  declare baseRowTotalInclTax: CreationOptional<number>
  declare hiddenTaxAmount: CreationOptional<number | null>
  declare baseHiddenTaxAmount: CreationOptional<number | null>
  declare giftMessageId: CreationOptional<number | null>
  declare weeeTaxDisposition: CreationOptional<number | null>
  declare weeeTaxRowDisposition: CreationOptional<number | null>
  declare baseWeeeTaxDisposition: CreationOptional<number | null>
  declare baseWeeeTaxRowDisposition: CreationOptional<number | null>
  declare weeeTaxApplied: string | null
  declare weeeTaxAppliedAmount: CreationOptional<number | null>
  declare weeeTaxAppliedRowAmount: CreationOptional<number | null>
  declare baseWeeeTaxAppliedAmount: CreationOptional<number | null>
  declare baseWeeeTaxAppliedRowAmnt: CreationOptional<number | null>
  declare refundableDeposit: number
  declare baseRefundableDeposit: number
  declare rentalStartDatetime: Date | null
  declare rentalEndDatetime: Date | null
  declare rentalType: string | null
  declare depositDiscount: number
  declare baseDepositDiscount: number
  declare depositDiscountPercent: number

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntity: BelongsToGetAssociationMixin<CatalogProductEntity>

  declare SalesFlatQuoteItemOptions: NonAttribute<SalesFlatQuoteItemOption[]>
  declare getSalesFlatQuoteItemOptions: HasManyGetAssociationsMixin<SalesFlatQuoteItemOption>

  declare SalesFlatQuote: NonAttribute<SalesFlatQuote>
  declare getSalesFlatQuote: BelongsToGetAssociationMixin<SalesFlatQuote>

  declare SalesFlatOrderItem: NonAttribute<SalesFlatOrderItem>
  declare getSalesFlatOrderItem: HasOneGetAssociationMixin<SalesFlatOrderItem>

  static associations: {
    SalesFlatQuoteItemOptions: Association<
      SalesFlatQuoteItemOption,
      SalesFlatQuoteItem
    >
    SalesFlatQuote: Association<SalesFlatQuote, SalesFlatQuoteItem>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatQuoteItem.init(
      {
        itemId: {
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
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        parentItemId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        isVirtual: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        sku: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        appliedRuleIds: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        additionalData: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        freeShipping: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        isQtyDecimal: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        noDiscount: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        weight: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        qty: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        price: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        basePrice: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        customPrice: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        discountPercent: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        baseDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        taxPercent: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        taxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        baseTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        rowTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseRowTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        rowTotalWithDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        rowWeight: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        productType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        baseTaxBeforeDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        taxBeforeDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        originalCustomPrice: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        redirectUrl: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        baseCost: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        priceInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        basePriceInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        rowTotalInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseRowTotalInclTax: {
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
        giftMessageId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        weeeTaxDisposition: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        weeeTaxRowDisposition: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseWeeeTaxDisposition: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseWeeeTaxRowDisposition: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        weeeTaxApplied: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        weeeTaxAppliedAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        weeeTaxAppliedRowAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseWeeeTaxAppliedAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseWeeeTaxAppliedRowAmnt: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
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
        rentalStartDatetime: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        rentalEndDatetime: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        rentalType: {
          type: DataTypes.STRING(20),
          allowNull: true,
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
        depositDiscountPercent: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE_ITEM,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_QUOTE_ITEM,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatQuoteItem.belongsTo(SalesFlatQuote, {
      foreignKey: 'quoteId',
    })

    SalesFlatQuoteItem.hasMany(SalesFlatQuoteItemOption, {
      foreignKey: 'itemId',
    })

    SalesFlatQuoteItem.belongsTo(CatalogProductEntity, {
      foreignKey: 'productId',
      targetKey: 'entityId',
    })

    SalesFlatQuoteItem.hasOne(SalesFlatOrderItem, {
      foreignKey: 'quoteItemId',
    })
  }

  async serializeProductOptions() {
    const itemOptions = await this.getSalesFlatQuoteItemOptions()
    const selectedOptions = itemOptions.find(
      (opt) => opt.code === CART_ITEM_OPTION_CODE.OPTION_IDS,
    )

    if (!selectedOptions) {
      return ''
    }

    const serializedOptions: { [key: string]: any } = {}

    const selectedOptionIds = selectedOptions.value.split(',')
    selectedOptionIds.forEach((optionId) => {
      const selectedOption = itemOptions.find(
        (opt) => opt.code === `option_${optionId}`,
      )

      if (selectedOption) {
        serializedOptions[optionId.toString()] = Number(selectedOption.value)
      }
    })

    // Normalize the object by sorting its keys.
    const sortedSerializedOptions = Object.keys(serializedOptions)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = serializedOptions[key]
          return result
        },
        {} as { [key: string]: any },
      )

    return JSON.stringify(sortedSerializedOptions)
  }

  async getSelectedProductOptions() {
    const itemOptions = await this.getSalesFlatQuoteItemOptions()
    const selectedOptions = itemOptions.find(
      (opt) => opt.code === CART_ITEM_OPTION_CODE.OPTION_IDS,
    )

    if (!selectedOptions) {
      return []
    }

    const itemProduct = await this.getCatalogProductEntity()
    const store = await (await this.getSalesFlatQuote()).getCoreStore()

    const [rentOptions, buyOptions] = await Promise.all([
      itemProduct.getRentalOptions(store),
      itemProduct.getBuyOptions(store),
    ])

    const productOptions = [...rentOptions, ...buyOptions]
    const productItemOptions: CatalogProductOptionTypeValue[] = []

    const selectedOptionIds = selectedOptions.value.split(',')
    selectedOptionIds.forEach((selOptionId) => {
      const selectedOption = productOptions.find(
        (opt) => opt.optionId.toString() === selOptionId.toString(),
      )
      if (selectedOption) {
        const selectedOptionType = itemOptions.find(
          (opt) => opt.code === `option_${selOptionId}`,
        )
        if (selectedOptionType) {
          const selectedOptionTypeIds = selectedOptionType.value.split(',')
          selectedOptionTypeIds.forEach((selOptionTypeId) => {
            const selectedOptionType =
              selectedOption.CatalogProductOptionTypeValues.find(
                (opt) => String(opt.optionTypeId) === String(selOptionTypeId),
              )

            if (selectedOptionType) {
              productItemOptions.push(selectedOptionType)
            }
          })
        }
      }
    })

    return productItemOptions
  }

  setCart(cart: SalesFlatQuote) {
    this.quoteId = cart.entityId
    this.SalesFlatQuote = cart

    return this
  }
}
