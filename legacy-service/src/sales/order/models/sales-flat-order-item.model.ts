import { CoreStore } from '@/core/store/models/core-store.model'
import { SalesFlatOrder } from './sales-flat-order.model'
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
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { SalesFlatQuoteItem } from '@/checkout/cart/models/sales-flat-quote-item.model'

export type SalesFlatOrderItemAttributes = InferAttributes<SalesFlatOrderItem>
export type SalesFlatOrderItemCreationAttributes =
  InferCreationAttributes<SalesFlatOrderItem>

export class SalesFlatOrderItem extends Model<
  SalesFlatOrderItemAttributes,
  SalesFlatOrderItemCreationAttributes
> {
  declare itemId: CreationOptional<number>
  declare orderId: number
  declare parentItemId: number | null
  declare quoteItemId: number | null
  declare storeId: number | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare productId: number | null
  declare productType: string | null
  declare productOptions: string | null
  declare weight: number | null
  declare isVirtual: number | null
  declare sku: string | null
  declare name: string | null
  declare description: string | null
  declare appliedRuleIds: string | null
  declare additionalData: string | null
  declare freeShipping: number
  declare isQtyDecimal: number | null
  declare noDiscount: number
  declare qtyBackordered: number
  declare qtyCanceled: number
  declare qtyInvoiced: number
  declare qtyOrdered: number
  declare qtyRefunded: number
  declare qtyShipped: number
  declare baseCost: CreationOptional<number | null>
  declare price: number
  declare basePrice: number
  declare originalPrice: number | null
  declare baseOriginalPrice: number | null
  declare taxPercent: number
  declare taxAmount: number
  declare baseTaxAmount: number
  declare taxInvoiced: number
  declare baseTaxInvoiced: number
  declare discountPercent: number
  declare discountAmount: number
  declare baseDiscountAmount: number
  declare discountInvoiced: number
  declare baseDiscountInvoiced: number
  declare amountRefunded: number
  declare baseAmountRefunded: number
  declare rowTotal: number
  declare baseRowTotal: number
  declare rowInvoiced: number
  declare baseRowInvoiced: number
  declare rowWeight: number
  declare baseTaxBeforeDiscount: number | null
  declare taxBeforeDiscount: number | null
  declare extOrderItemId: string | null
  declare lockedDoInvoice: number | null
  declare lockedDoShip: number | null
  declare priceInclTax: number | null
  declare basePriceInclTax: number | null
  declare rowTotalInclTax: number | null
  declare baseRowTotalInclTax: number | null
  declare hiddenTaxAmount: number | null
  declare baseHiddenTaxAmount: number | null
  declare hiddenTaxInvoiced: number | null
  declare baseHiddenTaxInvoiced: number | null
  declare hiddenTaxRefunded: number | null
  declare baseHiddenTaxRefunded: number | null
  declare isNominal: number
  declare taxCanceled: number | null
  declare hiddenTaxCanceled: number | null
  declare taxRefunded: number | null
  declare baseTaxRefunded: number | null
  declare discountRefunded: number | null
  declare baseDiscountRefunded: number | null
  declare giftMessageId: number | null
  declare giftMessageAvailable: number | null
  declare baseWeeeTaxAppliedAmount: number | null
  declare baseWeeeTaxAppliedRowAmnt: number | null
  declare weeeTaxAppliedAmount: number | null
  declare weeeTaxAppliedRowAmount: number | null
  declare weeeTaxApplied: string | null
  declare weeeTaxDisposition: number | null
  declare weeeTaxRowDisposition: number | null
  declare baseWeeeTaxDisposition: number | null
  declare baseWeeeTaxRowDisposition: number | null
  declare refundableDeposit: number
  declare baseRefundableDeposit: number
  declare rentalStartDatetime: Date | null
  declare rentalEndDatetime: Date | null
  declare rentalType: string | null
  declare depositDiscount: number
  declare baseDepositDiscount: number
  declare depositDiscountPercent: number

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  declare SalesFlatOrderItem: NonAttribute<SalesFlatOrderItem>
  declare getSalesFlatOrderItem: BelongsToGetAssociationMixin<SalesFlatOrderItem>

  declare SalesFlatQuoteItem: NonAttribute<SalesFlatQuoteItem>
  declare getSalesFlatQuoteItem: BelongsToGetAssociationMixin<SalesFlatQuoteItem>

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrder, SalesFlatOrderItem>
    CoreStore: Association<CoreStore, SalesFlatOrderItem>

    SalesFlatOrderItem: Association<SalesFlatOrderItem, SalesFlatOrderItem>
    SalesFlatQuoteItem: Association<SalesFlatQuoteItem, SalesFlatOrderItem>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrderItem.init(
      {
        itemId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        parentItemId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        quoteItemId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        storeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        productType: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        productOptions: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        weight: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        isVirtual: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sku: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        appliedRuleIds: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        additionalData: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        freeShipping: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isQtyDecimal: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        noDiscount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        qtyBackordered: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        qtyCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        qtyInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        qtyOrdered: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        qtyRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        qtyShipped: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseCost: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        basePrice: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        originalPrice: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseOriginalPrice: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        taxPercent: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        taxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        taxInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseTaxInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        discountPercent: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        discountInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseDiscountInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        amountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseAmountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        rowTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseRowTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        rowInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseRowInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        rowWeight: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseTaxBeforeDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        taxBeforeDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        extOrderItemId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lockedDoInvoice: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        lockedDoShip: {
          type: DataTypes.INTEGER,
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
        hiddenTaxInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseHiddenTaxInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        hiddenTaxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseHiddenTaxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        isNominal: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        taxCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        hiddenTaxCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        taxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseTaxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        discountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseDiscountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        giftMessageId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        giftMessageAvailable: {
          type: DataTypes.INTEGER,
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
        weeeTaxAppliedAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        weeeTaxAppliedRowAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        weeeTaxApplied: {
          type: DataTypes.TEXT,
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
        refundableDeposit: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseRefundableDeposit: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
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
          type: DataTypes.STRING,
          allowNull: true,
        },
        depositDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        baseDepositDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        depositDiscountPercent: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_ITEM,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER_ITEM,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrderItem.belongsTo(SalesFlatOrder, {
      foreignKey: 'entityId',
    })

    SalesFlatOrderItem.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })

    SalesFlatOrderItem.belongsTo(SalesFlatOrderItem, {
      foreignKey: 'parentItemId',
    })

    SalesFlatOrderItem.belongsTo(SalesFlatQuoteItem, {
      foreignKey: 'quoteItemId',
    })
  }

  isVirtualItem() {
    return this.isVirtual === 1
  }

  hasFreeShipping() {
    return this.freeShipping === 1
  }

  setOrder(order: SalesFlatOrder) {
    this.orderId = order.entityId
    this.SalesFlatOrder = order

    return this
  }

  setStore(store: CoreStore) {
    this.storeId = store.storeId
    this.CoreStore = store
    return this
  }
}
