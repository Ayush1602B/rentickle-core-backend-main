import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import {
  MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS,
  MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE,
} from '../order.types'
import { SalesFlatOrderPayment } from './sales-flat-order-payment.model'
import { SalesFlatOrder } from './sales-flat-order.model'

export type SalesPaymentTransactionAttributes =
  InferAttributes<SalesPaymentTransaction>
export type SalesPaymentTransactionCreationAttributes =
  InferCreationAttributes<SalesPaymentTransaction>

export class SalesPaymentTransaction extends Model<
  SalesPaymentTransactionAttributes,
  SalesPaymentTransactionCreationAttributes
> {
  declare transactionId: CreationOptional<number>
  declare parentId: number | null
  declare orderId: number
  declare paymentId: number
  declare txnId: CreationOptional<string | null>
  declare txnAmount: CreationOptional<number | null>
  declare parentTxnId: CreationOptional<string | null>
  declare txnType: MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE
  declare isClosed: CreationOptional<number>
  declare additionalInformation: CreationOptional<string | null>
  declare createdAt: CreationOptional<Date>
  declare requestDto: CreationOptional<string | null>
  declare responseDto: CreationOptional<string | null>
  declare status: MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  declare ParentTransaction: NonAttribute<SalesPaymentTransaction>
  declare getParentTransaction: BelongsToGetAssociationMixin<SalesPaymentTransaction>

  declare ChildTransactions: NonAttribute<SalesPaymentTransaction[]>
  declare getChildTransactions: HasManyGetAssociationsMixin<SalesPaymentTransaction>

  declare SalesFlatOrderPayment: NonAttribute<SalesFlatOrderPayment>
  declare getSalesFlatOrderPayment: BelongsToGetAssociationMixin<SalesFlatOrderPayment>

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrder, SalesPaymentTransaction>
    ParentTransaction: Association<
      SalesPaymentTransaction,
      SalesPaymentTransaction
    >
    ChildTransactions: Association<
      SalesPaymentTransaction,
      SalesPaymentTransaction
    >
    SalesFlatOrderPayment: Association<
      SalesFlatOrderPayment,
      SalesPaymentTransaction
    >
  }

  static initialize(sequelize: Sequelize) {
    SalesPaymentTransaction.init(
      {
        transactionId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        parentId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: null,
        },
        orderId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        paymentId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        txnId: {
          type: DataTypes.CHAR(100),
          unique: true,
          allowNull: true,
        },
        parentTxnId: {
          type: DataTypes.CHAR(100),
          allowNull: true,
        },
        txnType: {
          type: DataTypes.CHAR(15),
          allowNull: true,
        },
        txnAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        isClosed: {
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: false,
          defaultValue: 1,
        },
        additionalInformation: {
          type: DataTypes.BLOB,
          allowNull: true,
        },
        requestDto: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        responseDto: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_PAYMENT_TRANSACTION,
        tableName: MAGENTO_TABLE_NAME.SALES_PAYMENT_TRANSACTION,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesPaymentTransaction.hasMany(SalesPaymentTransaction, {
      foreignKey: 'parentId',
      sourceKey: 'transactionId',
    })

    SalesPaymentTransaction.belongsTo(SalesPaymentTransaction, {
      foreignKey: 'parentId',
      targetKey: 'transactionId',
    })

    SalesPaymentTransaction.belongsTo(SalesFlatOrder, {
      foreignKey: 'orderId',
    })

    SalesPaymentTransaction.belongsTo(SalesFlatOrderPayment, {
      foreignKey: 'paymentId',
    })
  }

  setOrder(order: SalesFlatOrder) {
    this.orderId = order.entityId
    this.SalesFlatOrder = order

    return this
  }

  setOrderPayment(payment: SalesFlatOrderPayment) {
    this.paymentId = payment.entityId
    this.SalesFlatOrderPayment = payment

    return this
  }

  isSuccess(): boolean {
    return this.status === MAGENTO_SALES_PAYMENT_TRANSACTION_STATUS.SUCCESS
  }

  isSaleSuccess(): boolean {
    return (
      this.txnType === MAGENTO_SALES_PAYMENT_TRANSACTION_TYPE.SALE &&
      this.isSuccess()
    )
  }
}
