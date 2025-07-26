import { CustomerAddressEntity } from '@/customer/customer/models/customer-address-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
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

export type SalesFlatOrderAddressAttributes =
  InferAttributes<SalesFlatOrderAddress>
export type SalesFlatOrderAddressCreationAttributes =
  InferCreationAttributes<SalesFlatOrderAddress>

export class SalesFlatOrderAddress extends Model<
  SalesFlatOrderAddressAttributes,
  SalesFlatOrderAddressCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare parentId: number | null
  declare customerAddressId: number | null
  declare quoteAddressId: number | null
  declare regionId: number | null
  declare customerId: number | null
  declare fax: string | null
  declare cityId: string | null
  declare region: string | null
  declare postcode: string | null
  declare lastname: string | null
  declare street: string | null
  declare city: string | null
  declare email: string | null
  declare telephone: string | null
  declare countryId: string | null
  declare firstname: string | null
  declare addressType: ADDRESS_TYPE | null
  declare prefix: string | null
  declare middlename: string | null
  declare suffix: string | null
  declare company: string | null
  declare vatId: string | null
  declare vatIsValid: number | null
  declare vatRequestId: string | null
  declare vatRequestDate: string | null
  declare vatRequestSuccess: number | null

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: BelongsToGetAssociationMixin<SalesFlatOrder>

  static associations: {
    SalesFlatOrder: Association<SalesFlatOrderAddress, SalesFlatOrder>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatOrderAddress.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        parentId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        customerAddressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        quoteAddressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        regionId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        customerId: {
          type: DataTypes.INTEGER,
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
        region: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        postcode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        lastname: {
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
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        telephone: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        countryId: {
          type: DataTypes.STRING(2),
          allowNull: true,
        },
        firstname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        addressType: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        prefix: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        middlename: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        suffix: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        company: {
          type: DataTypes.STRING(255),
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
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_ORDER_ADDRESS,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_ORDER_ADDRESS,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatOrderAddress.belongsTo(SalesFlatOrder, {
      foreignKey: 'parentId',
    })
  }

  /**
   * Check if the address is a billing address
   */
  isBillingAddress() {
    return this.addressType === 'billing'
  }

  /**
   * Check if the address is a shipping address
   */
  isShippingAddress() {
    return this.addressType === 'shipping'
  }

  setOrder(order: SalesFlatOrder) {
    this.parentId = order.entityId
    this.SalesFlatOrder = order
  }

  setCustomerAddress(customerAddress: CustomerAddressEntity) {
    this.customerAddressId = customerAddress.entityId
    this.customerId = customerAddress.parentId
  }
}
