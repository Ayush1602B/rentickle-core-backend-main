import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CustomerEntity } from './customer-entity.model'

export type CustomerEntityVarcharAttributes =
  InferAttributes<CustomerEntityVarchar>
export type CustomerEntityVarcharCreationAttributes =
  InferCreationAttributes<CustomerEntityVarchar>
export class CustomerEntityVarchar extends Model<
  CustomerEntityVarcharAttributes,
  CustomerEntityVarcharCreationAttributes
> {
  declare valueId: CreationOptional<number>
  declare entityTypeId: number
  declare entityId: ForeignKey<number>
  declare attributeId: number
  declare value: string | null

  // Relationships
  declare CustomerEntity: NonAttribute<CustomerEntity>
  declare getCustomerEntity: BelongsToGetAssociationMixin<CustomerEntity>

  declare EavAttribute: NonAttribute<EavAttribute> // Reference for EAV association
  declare getEavAttribute: BelongsToGetAssociationMixin<EavAttribute>

  static associations: {
    CustomerEntity: Association<CustomerEntity, CustomerEntityVarchar>
    EavAttribute: Association<EavAttribute, CustomerEntityVarchar>
  }

  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerEntityVarchar.init(
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
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ENTITY_VARCHAR,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ENTITY_VARCHAR,
        timestamps: false,
        underscored: true,
      },
    )
  }

  // Define associations
  static associate() {
    CustomerEntityVarchar.belongsTo(CustomerEntity, {
      foreignKey: 'entityId',
    })

    CustomerEntityVarchar.belongsTo(EavAttribute, {
      foreignKey: 'attributeId',
    })
  }
}
