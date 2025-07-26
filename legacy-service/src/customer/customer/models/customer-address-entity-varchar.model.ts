import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
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

export type CustomerAddressEntityVarcharAttributes =
  InferAttributes<CustomerAddressEntityVarchar>
export type CustomerAddressEntityVarcharCreationAttributes =
  InferCreationAttributes<CustomerAddressEntityVarchar>
export class CustomerAddressEntityVarchar extends Model {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare entityId: number
  declare attributeId: number
  declare value: string | null
  declare CustomerAddressEntity: NonAttribute<CustomerAddressEntity>
  declare getCustomerAddressEntity: BelongsToGetAssociationMixin<CustomerAddressEntity>

  static associations: {
    CustomerAddressEntity: Association<
      CustomerAddressEntity,
      CustomerAddressEntityVarchar
    >
    EavAttribute: Association<EavAttribute, CustomerAddressEntityVarchar>
  }
  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerAddressEntityVarchar.init(
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
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_VARCHAR,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ADDRESS_ENTITY_VARCHAR,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    CustomerAddressEntityVarchar.belongsTo(CustomerAddressEntity, {
      foreignKey: 'entityId',
    })
    CustomerAddressEntityVarchar.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
