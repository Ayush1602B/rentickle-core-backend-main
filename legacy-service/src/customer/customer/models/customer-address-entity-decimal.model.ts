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

export type CustomerAddressEntityDecimalAttributes =
  InferAttributes<CustomerAddressEntityDecimal>
export type CustomerAddressEntityDecimalCreationAttributes =
  InferCreationAttributes<CustomerAddressEntityDecimal>
export class CustomerAddressEntityDecimal extends Model<
  CustomerAddressEntityDecimalAttributes,
  CustomerAddressEntityDecimalCreationAttributes
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
      CustomerAddressEntityDecimal
    >
    EavAttribute: Association<EavAttribute, CustomerAddressEntityDecimal>
  }
  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerAddressEntityDecimal.init(
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
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_DECIMAL,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ADDRESS_ENTITY_DECIMAL,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CustomerAddressEntityDecimal.belongsTo(CustomerAddressEntity, {
      foreignKey: 'entityId',
    })
    CustomerAddressEntityDecimal.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
