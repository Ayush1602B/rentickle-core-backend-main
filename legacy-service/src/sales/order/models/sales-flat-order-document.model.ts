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

export type SalesFlatOrderDocumentAttributes =
  InferAttributes<SalesFlatOrderDocument>
export type SalesFlatOrderDocumentCreationAttributes =
  InferCreationAttributes<SalesFlatOrderDocument>

export class SalesFlatOrderDocument extends Model<
  SalesFlatOrderDocumentAttributes,
  SalesFlatOrderDocumentCreationAttributes
> {
  declare documentId: CreationOptional<number>
  declare orderId: number
  declare typeId: number
  declare customerId: number
  declare name: string | null
  declare title: string | null
  declare password: string | null
  declare url: string | null
  declare isDeleted: number
  declare status: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare visibleOnFront: number

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrderDocument, SalesFlatOrder>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrderDocument.init(
      {
        documentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        typeId: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 1,
        },
        customerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        isDeleted: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 1,
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
        visibleOnFront: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_DOCUMENT,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER_DOCUMENT,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrderDocument.belongsTo(SalesFlatOrder, {
      foreignKey: 'orderId',
    })
  }

  /**
   * Check if the document is visible on the frontend
   */
  isVisibleOnFront() {
    return this.visibleOnFront === 1
  }

  /**
   * Check if the document is deleted
   */
  isDeletedDocument() {
    return this.isDeleted === 1
  }
}
