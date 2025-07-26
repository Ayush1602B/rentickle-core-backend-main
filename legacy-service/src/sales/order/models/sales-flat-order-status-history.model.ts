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

export type SalesFlatOrderStatusHistoryAttributes =
  InferAttributes<SalesFlatOrderStatusHistory>
export type SalesFlatOrderStatusHistoryCreationAttributes =
  InferCreationAttributes<SalesFlatOrderStatusHistory>

export class SalesFlatOrderStatusHistory extends Model<
  SalesFlatOrderStatusHistoryAttributes,
  SalesFlatOrderStatusHistoryCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare parentId: number
  declare isCustomerNotified: number | null
  declare isVisibleOnFront: number
  declare comment: string | null
  declare status: string | null
  declare createdAt: Date | null
  declare entityName: string | null

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrderStatusHistory, SalesFlatOrder>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrderStatusHistory.init(
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
        isCustomerNotified: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        isVisibleOnFront: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(32),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        entityName: {
          type: DataTypes.STRING(32),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_STATUS_HISTORY,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER_STATUS_HISTORY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrderStatusHistory.belongsTo(SalesFlatOrder, {
      foreignKey: 'parentId',
    })
  }

  /**
   * Check if the status is visible on the frontend
   */
  isVisibleOnFrontEnd() {
    return this.isVisibleOnFront === 1
  }

  /**
   * Check if the customer was notified
   */
  wasCustomerNotified() {
    return this.isCustomerNotified === 1
  }

  /**
   * Get a formatted comment
   */
  getFormattedComment() {
    return this.comment ? this.comment.replace(/\n/g, '<br/>') : null
  }

  setOrder(order: SalesFlatOrder) {
    this.parentId = order.entityId
    this.SalesFlatOrder = order
  }
}
