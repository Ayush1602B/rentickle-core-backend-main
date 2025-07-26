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
import { SalesFlatOrder } from './sales-flat-order.model'
import { SalesPaymentTransaction } from './sales-payment-transaction.model'

export type SalesFlatOrderPaymentAttributes =
  InferAttributes<SalesFlatOrderPayment>
export type SalesFlatOrderPaymentCreationAttributes =
  InferCreationAttributes<SalesFlatOrderPayment>

export class SalesFlatOrderPayment extends Model<
  SalesFlatOrderPaymentAttributes,
  SalesFlatOrderPaymentCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare parentId: number
  declare baseShippingCaptured: CreationOptional<number | null>
  declare shippingCaptured: CreationOptional<number | null>
  declare amountRefunded: CreationOptional<number | null>
  declare baseAmountPaid: CreationOptional<number | null>
  declare amountCanceled: CreationOptional<number | null>
  declare baseAmountAuthorized: CreationOptional<number | null>
  declare baseAmountPaidOnline: CreationOptional<number | null>
  declare baseAmountRefundedOnline: CreationOptional<number | null>
  declare baseShippingAmount: CreationOptional<number | null>
  declare shippingAmount: CreationOptional<number | null>
  declare amountPaid: CreationOptional<number | null>
  declare amountAuthorized: CreationOptional<number | null>
  declare baseAmountOrdered: CreationOptional<number | null>
  declare baseShippingRefunded: CreationOptional<number | null>
  declare shippingRefunded: CreationOptional<number | null>
  declare baseAmountRefunded: CreationOptional<number | null>
  declare amountOrdered: CreationOptional<number | null>
  declare baseAmountCanceled: CreationOptional<number | null>
  declare quotePaymentId: CreationOptional<number | null>
  declare additionalData: CreationOptional<string | null>
  declare ccExpMonth: CreationOptional<number | null>
  declare ccSsStartYear: CreationOptional<number | null>
  declare echeckBankName: CreationOptional<string | null>
  declare method: CreationOptional<string | null>
  declare ccDebugRequestBody: CreationOptional<string | null>
  declare ccSecureVerify: CreationOptional<string | null>
  declare protectionEligibility: CreationOptional<string | null>
  declare ccApproval: CreationOptional<string | null>
  declare ccLast4: CreationOptional<string | null>
  declare ccStatusDescription: CreationOptional<string | null>
  declare echeckType: CreationOptional<string | null>
  declare ccDebugResponseSerialized: CreationOptional<string | null>
  declare ccSsStartMonth: CreationOptional<number | null>
  declare echeckAccountType: CreationOptional<string | null>
  declare lastTransId: CreationOptional<string | null>
  declare ccCidStatus: CreationOptional<string | null>
  declare ccOwner: CreationOptional<string | null>
  declare ccType: CreationOptional<string | null>
  declare poNumber: CreationOptional<string | null>
  declare ccExpYear: CreationOptional<number | null>
  declare ccStatus: CreationOptional<string | null>
  declare echeckRoutingNumber: CreationOptional<string | null>
  declare accountStatus: CreationOptional<string | null>
  declare anetTransMethod: CreationOptional<string | null>
  declare ccDebugResponseBody: CreationOptional<string | null>
  declare ccSsIssue: CreationOptional<string | null>
  declare echeckAccountName: CreationOptional<string | null>
  declare ccAvsStatus: CreationOptional<string | null>
  declare ccNumberEnc: CreationOptional<string | null>
  declare ccTransId: CreationOptional<string | null>
  declare payboxRequestNumber: CreationOptional<string | null>
  declare addressStatus: CreationOptional<string | null>
  declare additionalInformation: CreationOptional<string | null>

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  declare SalesPaymentTransactions: NonAttribute<SalesPaymentTransaction[]>
  declare getSalesPaymentTransactions: BelongsToGetAssociationMixin<
    SalesPaymentTransaction[]
  >

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrder, SalesFlatOrderPayment>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrderPayment.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        parentId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        baseShippingCaptured: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        shippingCaptured: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        amountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountPaid: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        amountCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountAuthorized: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountPaidOnline: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountRefundedOnline: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        shippingAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        amountPaid: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        amountAuthorized: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountOrdered: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseShippingRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        shippingRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountRefunded: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        amountOrdered: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseAmountCanceled: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        quotePaymentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        additionalData: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        ccExpMonth: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccSsStartYear: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        echeckBankName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        method: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccDebugRequestBody: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccSecureVerify: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        protectionEligibility: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccApproval: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccLast4: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccStatusDescription: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        echeckType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccDebugResponseSerialized: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccSsStartMonth: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        echeckAccountType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        lastTransId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccCidStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccOwner: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        poNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccExpYear: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        echeckRoutingNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        accountStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        anetTransMethod: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccDebugResponseBody: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccSsIssue: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        echeckAccountName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccAvsStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccNumberEnc: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ccTransId: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        payboxRequestNumber: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        addressStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        additionalInformation: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_PAYMENT,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER_PAYMENT,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrderPayment.belongsTo(SalesFlatOrder, {
      foreignKey: 'parentId',
    })

    SalesFlatOrderPayment.hasMany(SalesPaymentTransaction, {
      foreignKey: 'paymentId',
    })
  }

  setOrder(order: SalesFlatOrder) {
    this.parentId = order.entityId
    this.SalesFlatOrder = order

    return this
  }

  addTransaction(transaction: SalesPaymentTransaction): SalesFlatOrderPayment {
    this.SalesPaymentTransactions = [
      ...(this.SalesPaymentTransactions || []),
      transaction,
    ]

    return this
  }
}
