import { SalesFlatQuote } from '@/checkout/cart/models/sales-flat-quote.model'
import { CoreStore } from '@/core/store/models/core-store.model'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
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
  SaveOptions,
  Sequelize,
} from 'sequelize'
import { MAGENTO_ORDER_STATE, MAGENTO_ORDER_STATUS } from '../order.types'
import { SalesFlatOrderAddress } from './sales-flat-order-address.model'
import { SalesFlatOrderDocument } from './sales-flat-order-document.model'
import { SalesFlatOrderItem } from './sales-flat-order-item.model'
import { SalesFlatOrderPayment } from './sales-flat-order-payment.model'
import { SalesFlatOrderStatusHistory } from './sales-flat-order-status-history.model'
import { SalesPaymentTransaction } from './sales-payment-transaction.model'

export type SalesFlatOrderAttributes = InferAttributes<SalesFlatOrder>
export type SalesFlatOrderCreationAttributes =
  InferCreationAttributes<SalesFlatOrder>

export class SalesFlatOrder extends Model<
  SalesFlatOrderAttributes,
  SalesFlatOrderCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare state: MAGENTO_ORDER_STATE | null
  declare status: MAGENTO_ORDER_STATUS | null
  declare couponCode: string | null
  declare protectCode: string | null
  declare shippingDescription: string | null
  declare isVirtual: number | null
  declare storeId: number | null
  declare customerId: number | null
  declare baseDiscountAmount: number | null
  declare baseDiscountCanceled: number | null
  declare baseDiscountInvoiced: number | null
  declare baseDiscountRefunded: number | null
  declare baseGrandTotal: number | null
  declare baseShippingAmount: number | null
  declare baseShippingCanceled: number | null
  declare baseShippingInvoiced: number | null
  declare baseShippingRefunded: number | null
  declare baseShippingTaxAmount: number | null
  declare baseShippingTaxRefunded: number | null
  declare baseSubtotal: number | null
  declare baseSubtotalCanceled: number | null
  declare baseSubtotalInvoiced: number | null
  declare baseSubtotalRefunded: number | null
  declare baseTaxAmount: number | null
  declare baseTaxCanceled: number | null
  declare baseTaxInvoiced: number | null
  declare baseTaxRefunded: number | null
  declare baseToGlobalRate: number | null
  declare baseToOrderRate: number | null
  declare baseTotalCanceled: number | null
  declare baseTotalInvoiced: number | null
  declare baseTotalInvoicedCost: number | null
  declare baseTotalOfflineRefunded: number | null
  declare baseTotalOnlineRefunded: number | null
  declare baseTotalPaid: number | null
  declare baseTotalQtyOrdered: number | null
  declare baseTotalRefunded: number | null
  declare discountAmount: number | null
  declare discountCanceled: number | null
  declare discountInvoiced: number | null
  declare discountRefunded: number | null
  declare grandTotal: number | null
  declare shippingAmount: number | null
  declare shippingCanceled: number | null
  declare shippingInvoiced: number | null
  declare shippingRefunded: number | null
  declare shippingTaxAmount: number | null
  declare shippingTaxRefunded: number | null
  declare storeToBaseRate: number | null
  declare storeToOrderRate: number | null
  declare subtotal: number | null
  declare subtotalCanceled: number | null
  declare subtotalInvoiced: number | null
  declare subtotalRefunded: number | null
  declare taxAmount: number | null
  declare taxCanceled: number | null
  declare taxInvoiced: number | null
  declare taxRefunded: number | null
  declare totalCanceled: number | null
  declare totalInvoiced: number | null
  declare totalOfflineRefunded: number | null
  declare totalOnlineRefunded: number | null
  declare totalPaid: number | null
  declare totalQtyOrdered: number | null
  declare totalRefunded: number | null
  declare canShipPartially: number | null
  declare canShipPartiallyItem: number | null
  declare customerIsGuest: number | null
  declare customerNoteNotify: number | null
  declare billingAddressId: number | null
  declare customerGroupId: number | null
  declare editIncrement: number | null
  declare emailSent: number | null
  declare forcedShipmentWithInvoice: number | null
  declare paymentAuthExpiration: number | null
  declare quoteAddressId: number | null
  declare quoteId: number | null
  declare shippingAddressId: number | null
  declare adjustmentNegative: number | null
  declare adjustmentPositive: number | null
  declare baseAdjustmentNegative: number | null
  declare baseAdjustmentPositive: number | null
  declare baseShippingDiscountAmount: number | null
  declare baseSubtotalInclTax: number | null
  declare baseTotalDue: number | null
  declare paymentAuthorizationAmount: number | null
  declare shippingDiscountAmount: number | null
  declare subtotalInclTax: number | null
  declare totalDue: number | null
  declare weight: number | null
  declare customerDob: string | null
  declare incrementId: string | null
  declare appliedRuleIds: string | null
  declare baseCurrencyCode: string | null
  declare customerEmail: string | null
  declare customerFirstname: string | null
  declare customerLastname: string | null
  declare customerMiddlename: string | null
  declare customerPrefix: string | null
  declare customerSuffix: string | null
  declare customerTaxvat: string | null
  declare discountDescription: string | null
  declare extCustomerId: string | null
  declare extOrderId: string | null
  declare globalCurrencyCode: string | null
  declare holdBeforeState: string | null
  declare holdBeforeStatus: string | null
  declare orderCurrencyCode: string | null
  declare originalIncrementId: string | null
  declare relationChildId: string | null
  declare relationChildRealId: string | null
  declare relationParentId: string | null
  declare relationParentRealId: string | null
  declare remoteIp: string | null
  declare shippingMethod: string | null
  declare storeCurrencyCode: string | null
  declare storeName: string | null
  declare xForwardedFor: string | null
  declare customerNote: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare totalItemCount: number | null
  declare customerGender: number | null
  declare hiddenTaxAmount: number | null
  declare baseHiddenTaxAmount: number | null
  declare shippingHiddenTaxAmount: number | null
  declare baseShippingHiddenTaxAmnt: number | null
  declare hiddenTaxInvoiced: number | null
  declare baseHiddenTaxInvoiced: number | null
  declare hiddenTaxRefunded: number | null
  declare baseHiddenTaxRefunded: number | null
  declare shippingInclTax: number | null
  declare baseShippingInclTax: number | null
  declare couponRuleName: string | null
  declare paypalIpnCustomerNotified: number | null
  declare giftMessageId: number | null
  declare creditpointAmount: number | null
  declare baseCreditpointAmount: number | null
  declare creditpointAmountInvoiced: number | null
  declare baseCreditpointAmountInvoiced: number | null
  declare creditpointAmountRefunded: number | null
  declare baseCreditpointAmountRefunded: number | null
  declare deliveryDate: string | null
  declare refundableDeposit: number | null
  declare baseRefundableDeposit: number | null
  declare depositDiscount: number | null
  declare baseDepositDiscount: number | null
  declare mailchimpCampaignId: string | null
  declare mailchimpAbandonedcartFlag: string | null
  declare mailchimpLandingPage: string | null
  declare channel: string | null
  declare source: string | null

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  declare CustomerEntity: NonAttribute<CustomerEntity>
  declare getCustomerEntity: BelongsToGetAssociationMixin<CustomerEntity>

  declare SalesFlatOrderItems: NonAttribute<SalesFlatOrderItem[]>
  declare getSalesFlatOrderItems: HasManyGetAssociationsMixin<SalesFlatOrderItem>

  declare SalesFlatOrderPayment: NonAttribute<SalesFlatOrderPayment>
  declare getSalesFlatOrderPayment: HasOneGetAssociationMixin<SalesFlatOrderPayment>

  declare SalesFlatOrderAddresses: NonAttribute<SalesFlatOrderAddress[]>
  declare getSalesFlatOrderAddresses: HasManyGetAssociationsMixin<SalesFlatOrderAddress>

  declare SalesFlatOrderDocuments: NonAttribute<SalesFlatOrderDocument[]>
  declare getSalesFlatOrderDocuments: HasManyGetAssociationsMixin<SalesFlatOrderDocument>

  declare SalesFlatOrderStatusHistories: NonAttribute<
    SalesFlatOrderStatusHistory[]
  >
  declare getSalesFlatOrderStatusHistories: HasManyGetAssociationsMixin<SalesFlatOrderStatusHistory>

  declare SalesFlatQuote: NonAttribute<SalesFlatQuote>
  declare getSalesFlatQuote: BelongsToGetAssociationMixin<SalesFlatQuote>

  declare SalesPaymentTransactions: NonAttribute<SalesPaymentTransaction[]>
  declare getSalesPaymentTransactions: HasManyGetAssociationsMixin<SalesPaymentTransaction>

  static associations: {
    CoreStore: Association<CoreStore, SalesFlatOrder>
    CustomerEntity: Association<CustomerEntity, SalesFlatOrder>
    SalesFlatOrderItems: Association<SalesFlatOrderItem, SalesFlatOrder>
    SalesFlatOrderPayment: Association<SalesFlatOrderPayment, SalesFlatOrder>
    SalesFlatOrderAddresses: Association<SalesFlatOrderAddress, SalesFlatOrder>
    SalesFlatOrderDocuments: Association<SalesFlatOrderDocument, SalesFlatOrder>
    SalesFlatOrderStatusHistories: Association<
      SalesFlatOrderStatusHistory,
      SalesFlatOrder
    >
    SalesFlatQuote: Association<SalesFlatQuote, SalesFlatOrder>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrder.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        state: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        couponCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        protectCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        shippingDescription: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        isVirtual: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        baseDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseDiscountCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseDiscountInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseDiscountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseGrandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseShippingTaxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseSubtotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseSubtotalCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseSubtotalInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseSubtotalRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTaxCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTaxInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTaxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseToGlobalRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseToOrderRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalInvoicedCost: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalOfflineRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalOnlineRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalPaid: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalQtyOrdered: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        baseTotalRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        discountCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        discountInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        discountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        grandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingTaxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        shippingTaxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        storeToBaseRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        storeToOrderRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        subtotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        subtotalCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        subtotalInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        subtotalRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        taxAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        taxCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        taxInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        taxRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalOfflineRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalOnlineRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalPaid: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalQtyOrdered: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },
        totalRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          defaultValue: 0.0,
        },

        canShipPartially: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        canShipPartiallyItem: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        customerIsGuest: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        customerNoteNotify: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        billingAddressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        customerGroupId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        editIncrement: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        emailSent: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        forcedShipmentWithInvoice: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        paymentAuthExpiration: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        quoteAddressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        quoteId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        shippingAddressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        adjustmentNegative: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        adjustmentPositive: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAdjustmentNegative: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAdjustmentPositive: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseSubtotalInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseTotalDue: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        paymentAuthorizationAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        shippingDiscountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        subtotalInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        totalDue: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        weight: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        customerDob: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        incrementId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },

        appliedRuleIds: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        baseCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerEmail: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerFirstname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerLastname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerMiddlename: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerPrefix: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerSuffix: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerTaxvat: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        discountDescription: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        extCustomerId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        extOrderId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        globalCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        holdBeforeState: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        holdBeforeStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        orderCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        originalIncrementId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        relationChildId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        relationChildRealId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        relationParentId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        relationParentRealId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        remoteIp: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        shippingMethod: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        storeCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        storeName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        xForwardedFor: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerNote: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        totalItemCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        customerGender: {
          type: DataTypes.INTEGER,
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
        shippingInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingInclTax: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        couponRuleName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        paypalIpnCustomerNotified: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        giftMessageId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        creditpointAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseCreditpointAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        creditpointAmountInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseCreditpointAmountInvoiced: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        creditpointAmountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseCreditpointAmountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        deliveryDate: {
          type: DataTypes.DATEONLY,
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
        depositDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseDepositDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        mailchimpCampaignId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        mailchimpAbandonedcartFlag: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        mailchimpLandingPage: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        channel: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        source: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrder.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })
    SalesFlatOrder.belongsTo(CustomerEntity, {
      foreignKey: 'customerId',
    })
    SalesFlatOrder.hasMany(SalesFlatOrderItem, {
      foreignKey: 'orderId',
    })
    SalesFlatOrder.hasMany(SalesFlatOrderAddress, {
      foreignKey: 'parentId',
    })
    SalesFlatOrder.hasMany(SalesFlatOrderDocument, {
      foreignKey: 'orderId',
    })
    SalesFlatOrder.hasOne(SalesFlatOrderPayment, {
      foreignKey: 'parentId',
    })
    SalesFlatOrder.hasMany(SalesFlatOrderStatusHistory, {
      foreignKey: 'parentId',
    })
    SalesFlatOrder.belongsTo(SalesFlatQuote, {
      foreignKey: 'quoteId',
    })
    SalesFlatOrder.hasMany(SalesPaymentTransaction, {
      foreignKey: 'orderId',
    })
  }

  public async save(
    options?:
      | SaveOptions<InferAttributes<SalesFlatOrder, { omit: never }>>
      | undefined,
  ): Promise<this> {
    const topLevelTxn = options?.transaction
    const localTxn = await this.sequelize.transaction()
    const txn = topLevelTxn || localTxn

    await super.save({ transaction: txn })
    await Promise.all(
      (this.SalesFlatOrderItems || []).map(async (item) => {
        item.orderId = this.entityId
        await item.save({ transaction: txn })
      }),
    )

    await Promise.all(
      (this.SalesFlatOrderAddresses || []).map(async (addr) => {
        addr.parentId = this.entityId
        await addr.save({ transaction: txn })
      }),
    )

    if (this.SalesFlatOrderPayment) {
      this.SalesFlatOrderPayment.setOrder(this)
      await this.SalesFlatOrderPayment.save({ transaction: txn })

      await Promise.all(
        (this.SalesFlatOrderPayment.SalesPaymentTransactions || []).map(
          async (transaction) => {
            transaction.setOrder(this)
            transaction.setOrderPayment(this.SalesFlatOrderPayment)

            await transaction.save({ transaction: txn })
          },
        ),
      )
    }

    await Promise.all(
      (this.SalesFlatOrderStatusHistories || []).map(async (status) => {
        status.parentId = this.entityId
        await status.save({ transaction: txn })
      }),
    )

    if (!topLevelTxn) {
      await txn.commit()
    }

    return this
  }

  addAddress(address: SalesFlatOrderAddress) {
    this.SalesFlatOrderAddresses = [
      ...(this.SalesFlatOrderAddresses || []),
      address,
    ]

    address.setOrder(this)
    return this
  }

  addItem(item: SalesFlatOrderItem) {
    this.SalesFlatOrderItems = [...(this.SalesFlatOrderItems || []), item]

    item.setOrder(this)
    return this
  }

  addStatusHistory(status: SalesFlatOrderStatusHistory) {
    this.SalesFlatOrderStatusHistories = [
      ...(this.SalesFlatOrderStatusHistories || []),
      status,
    ]

    status.setOrder(this)
    return this
  }

  setPayment(payment: SalesFlatOrderPayment) {
    this.SalesFlatOrderPayment = payment
    payment.setOrder(this)
    return this
  }

  addPaymentTransaction(transaction: SalesPaymentTransaction): SalesFlatOrder {
    this.SalesPaymentTransactions = [
      ...(this.SalesPaymentTransactions || []),
      transaction,
    ]

    transaction.setOrder(this)
    return this
  }

  getBillingAddress() {
    return this.SalesFlatOrderAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.BILLING,
    )
  }

  getShippingAddress() {
    return this.SalesFlatOrderAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.SHIPPING,
    )
  }

  async loadSalesOrderPayment(): Promise<SalesFlatOrderPayment> {
    if (!this.SalesFlatOrderPayment) {
      this.SalesFlatOrderPayment = await this.getSalesFlatOrderPayment()
    }

    return this.SalesFlatOrderPayment
  }
}
