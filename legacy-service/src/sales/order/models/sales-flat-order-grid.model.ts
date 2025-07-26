import { CoreStore } from '@/core/store/models/core-store.model'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { SalesFlatOrder } from './sales-flat-order.model'

export type SalesFlatOrderGridAttributes = InferAttributes<SalesFlatOrderGrid>
export type SalesFlatOrderGridCreationAttributes =
  InferCreationAttributes<SalesFlatOrderGrid>

export class SalesFlatOrderGrid extends Model<
  SalesFlatOrderGridAttributes,
  SalesFlatOrderGridCreationAttributes
> {
  declare entityId: number
  declare status: string | null
  declare storeId: number | null
  declare storeName: string | null
  declare customerId: number | null
  declare baseGrandTotal: number | null
  declare baseTotalPaid: number | null
  declare grandTotal: number | null
  declare totalPaid: number | null
  declare incrementId: string | null
  declare baseCurrencyCode: string | null
  declare orderCurrencyCode: string | null
  declare shippingName: string | null
  declare billingName: string | null
  declare createdAt: Date | null
  declare updatedAt: Date | null
  declare channel: string | null
  declare source: string | null

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  declare CustomerEntity: NonAttribute<CustomerEntity>
  declare getCustomerEntity: BelongsToGetAssociationMixin<CustomerEntity>

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrderGrid, SalesFlatOrder>
    CoreStore: Association<SalesFlatOrderGrid, CoreStore>
    CustomerEntity: Association<SalesFlatOrderGrid, CustomerEntity>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrderGrid.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        status: {
          type: DataTypes.STRING(32),
          allowNull: true,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
        },
        storeName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        baseGrandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseTotalPaid: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        grandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        totalPaid: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        incrementId: {
          type: DataTypes.STRING(50),
          allowNull: true,
          unique: true,
        },
        baseCurrencyCode: {
          type: DataTypes.STRING(3),
          allowNull: true,
        },
        orderCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        shippingName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        billingName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        channel: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        source: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_GRID,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER_GRID,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrderGrid.belongsTo(SalesFlatOrder, {
      foreignKey: 'entityId',
    })
    SalesFlatOrderGrid.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })
    SalesFlatOrderGrid.belongsTo(CustomerEntity, {
      foreignKey: 'customerId',
    })
  }

  /**
   * Check if the order is complete
   */
  isOrderComplete() {
    return this.status === 'complete'
  }

  /**
   * Check if the order was created in a specific channel
   */
  isFromChannel(channel: string) {
    return this.channel === channel
  }
}
