import { EavAttribute } from '@/eav/models/eav-attribute.model'
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
import { CustomerAddressEntity } from './customer-address-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'

export type CustomerAddressEntityIntAttributes =
  InferAttributes<CustomerAddressEntityInt>
export type CustomerAddressEntityIntCreationAttributes =
  InferCreationAttributes<CustomerAddressEntityInt>

export class CustomerAddressEntityInt extends Model<
  CustomerAddressEntityIntAttributes,
  CustomerAddressEntityIntCreationAttributes
> {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare entityId: number
  declare attributeId: number
  declare value: number | null

  declare CustomerAddressEntity: NonAttribute<CustomerAddressEntity>
  declare getCustomerAddressEntity: BelongsToGetAssociationMixin<CustomerAddressEntity>

  static associations: {
    CustomerAddressEntity: Association<
      CustomerAddressEntity,
      CustomerAddressEntityInt
    >
    EavAttribute: Association<EavAttribute, CustomerAddressEntityInt>
  }
  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerAddressEntityInt.init(
      {
        valueId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        entityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        attributeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_INT,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ADDRESS_ENTITY_INT,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CustomerAddressEntityInt.belongsTo(CustomerAddressEntity, {
      foreignKey: 'entityId',
    })
    CustomerAddressEntityInt.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
