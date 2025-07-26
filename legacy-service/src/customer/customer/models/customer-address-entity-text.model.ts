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

export type CustomerAddressEntityTextAttributes =
  InferAttributes<CustomerAddressEntityText>
export type CustomerAddressEntityTextCreationAttributes =
  InferCreationAttributes<CustomerAddressEntityText>

export class CustomerAddressEntityText extends Model<
  CustomerAddressEntityTextAttributes,
  CustomerAddressEntityTextCreationAttributes
> {
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
      CustomerAddressEntityText
    >
    EavAttribute: Association<EavAttribute, CustomerAddressEntityText>
  }
  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerAddressEntityText.init(
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
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY_TEXT,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ADDRESS_ENTITY_TEXT,
        timestamps: false,
        underscored: true,
      },
    )
  }
  static associate() {
    CustomerAddressEntityText.belongsTo(CustomerAddressEntity, {
      foreignKey: 'entityId',
    })

    CustomerAddressEntityText.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
