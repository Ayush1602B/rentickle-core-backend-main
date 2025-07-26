import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { EavEntityType } from '@/eav/models/eav-entity-type.model'
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
  SaveOptions,
  Sequelize,
} from 'sequelize'
import {
  MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE,
  MagentoCustomerAddressAttributes,
  MagentoCustomerAddressAttributeValueClass,
} from '../customer.types'
import { CustomerAddressEntityDecimal } from './customer-address-entity-decimal.model'
import { CustomerAddressEntityInt } from './customer-address-entity-int.model'
import { CustomerAddressEntityText } from './customer-address-entity-text.model'
import { CustomerAddressEntityVarchar } from './customer-address-entity-varchar.model'
import { CustomerEntity } from './customer-entity.model'

export type CustomerAddressEntityAttributes =
  InferAttributes<CustomerAddressEntity>
export type CustomerAddressEntityCreationAttributes =
  InferCreationAttributes<CustomerAddressEntity>
export class CustomerAddressEntity extends Model<
  CustomerAddressEntityAttributes,
  CustomerAddressEntityCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeSetId: CreationOptional<number>
  declare incrementId: string | null
  declare parentId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare isActive: CreationOptional<number>

  declare EavEntityType: NonAttribute<EavEntityType>
  declare getEavEntityType: BelongsToGetAssociationMixin<EavEntityType>

  declare CustomerEntity: NonAttribute<CustomerEntity>
  declare getCustomerEntity: BelongsToGetAssociationMixin<CustomerEntity>

  declare CustomerAddressEntityVarchars: NonAttribute<
    CustomerAddressEntityVarchar[]
  >
  declare getCustomerAddressEntityVarchars: HasManyGetAssociationsMixin<CustomerAddressEntityVarchar>

  declare CustomerAddressEntityTexts: NonAttribute<CustomerAddressEntityText[]>
  declare getCustomerAddressEntityTexts: HasManyGetAssociationsMixin<CustomerAddressEntityText>

  declare CustomerAddressEntityInts: NonAttribute<CustomerAddressEntityInt[]>
  declare getCustomerAddressEntityInts: HasManyGetAssociationsMixin<CustomerAddressEntityInt>

  declare CustomerAddressEntityDecimals: NonAttribute<
    CustomerAddressEntityDecimal[]
  >
  declare getCustomerAddressEntityDecimals: HasManyGetAssociationsMixin<CustomerAddressEntityDecimal>

  static associations: {
    CustomerEntity: Association<CustomerEntity, CustomerAddressEntity>
    CustomerAddressEntityVarchars: Association<
      CustomerAddressEntityVarchar,
      CustomerAddressEntity
    >
    CustomerAddressEntityTexts: Association<
      CustomerAddressEntityText,
      CustomerAddressEntity
    >
    CustomerAddressEntityInts: Association<
      CustomerAddressEntityInt,
      CustomerAddressEntity
    >

    CustomerAddressEntityDecimals: Association<
      CustomerAddressEntityDecimal,
      CustomerAddressEntity
    >
  }

  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerAddressEntity.init(
      {
        entityId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        entityTypeId: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        attributeSetId: {
          type: DataTypes.SMALLINT,
          defaultValue: 0,
          allowNull: false,
        },
        incrementId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ADDRESS_ENTITY,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    CustomerAddressEntity.belongsTo(EavEntityType, {
      foreignKey: 'entityTypeId',
    })

    CustomerAddressEntity.belongsTo(CustomerEntity, {
      foreignKey: 'entityId',
    })

    CustomerAddressEntity.hasMany(CustomerAddressEntityVarchar, {
      foreignKey: 'entityId',
    })

    CustomerAddressEntity.hasMany(CustomerAddressEntityText, {
      foreignKey: 'entityId',
    })

    CustomerAddressEntity.hasMany(CustomerAddressEntityInt, {
      foreignKey: 'entityId',
    })

    CustomerAddressEntity.hasMany(CustomerAddressEntityDecimal, {
      foreignKey: 'entityId',
    })
  }

  /**
   *  Get product attributes map
   * @param productAttributes
   * @param magentoProduct
   * @returns
   */

  async getAttributesMap(): Promise<MagentoCustomerAddressAttributes> {
    const entityType = await this.getEavEntityType()
    const addressAttributes = await entityType.getEavAttributes()

    const addressAttributeMap: MagentoCustomerAddressAttributes = {}

    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
    ] = await Promise.all([
      this.getCustomerAddressEntityVarchars(),
      this.getCustomerAddressEntityInts(),
      this.getCustomerAddressEntityDecimals(),
      this.getCustomerAddressEntityTexts(),
    ])

    const allAttributes = [
      ...varcharAttributeValues,
      ...intAttributeValues,
      ...decimalAttributeValues,
      ...textAttributeValues,
    ]

    Object.values(MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE).forEach((key) => {
      const attributeCode = key as MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE
      addressAttributeMap[attributeCode] = null
    })

    allAttributes.forEach((attrValue) => {
      const attributeCode = addressAttributes.find(
        (attr) => attr.attributeId === attrValue.attributeId,
      )?.attributeCode as MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE

      if (attributeCode) {
        addressAttributeMap[attributeCode] = attrValue.value || null
      }
    })

    return addressAttributeMap
  }

  async loadAttributeValues(): Promise<void> {
    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
    ] = await Promise.all([
      this.getCustomerAddressEntityVarchars(),
      this.getCustomerAddressEntityInts(),
      this.getCustomerAddressEntityDecimals(),
      this.getCustomerAddressEntityTexts(),
    ])

    this.CustomerAddressEntityVarchars = varcharAttributeValues
    this.CustomerAddressEntityInts = intAttributeValues
    this.CustomerAddressEntityDecimals = decimalAttributeValues
    this.CustomerAddressEntityTexts = textAttributeValues
  }

  setCustomer(customer: CustomerEntity): void {
    this.parentId = customer.entityId
  }

  getAttributeValue(
    attribute: EavAttribute,
  ): MagentoCustomerAddressAttributeValueClass {
    const valuesToCheck = [
      ...(this.CustomerAddressEntityVarchars || []),
      ...(this.CustomerAddressEntityInts || []),
      ...(this.CustomerAddressEntityDecimals || []),
      ...(this.CustomerAddressEntityTexts || []),
    ]

    const attributeValue = valuesToCheck.find(
      (attr) => attr.attributeId === attribute.attributeId,
    )

    return attributeValue || null
  }

  getAttributeValueById(
    attributeId: number,
  ): MagentoCustomerAddressAttributeValueClass {
    const valuesToCheck = [
      ...(this.CustomerAddressEntityVarchars || []),
      ...(this.CustomerAddressEntityInts || []),
      ...(this.CustomerAddressEntityDecimals || []),
      ...(this.CustomerAddressEntityTexts || []),
    ]

    const attributeValue = valuesToCheck.find(
      (attr) => attr.attributeId === attributeId,
    )

    return attributeValue || null
  }

  public async save(
    options?:
      | SaveOptions<InferAttributes<CustomerAddressEntity, { omit: never }>>
      | undefined,
  ): Promise<this> {
    const topLevelTxn = options?.transaction
    const localTxn = await this.sequelize.transaction()
    const txn = topLevelTxn || localTxn

    await super.save({ ...options, transaction: txn })

    await Promise.all([
      ...(this.CustomerAddressEntityVarchars || []).map(async (attr) => {
        attr.entityId = this.entityId
        await attr.save({ ...options, transaction: txn })
      }),
      ...(this.CustomerAddressEntityInts || []).map(async (attr) => {
        attr.entityId = this.entityId
        await attr.save({ transaction: txn })
      }),
      ...(this.CustomerAddressEntityDecimals || []).map(async (attr) => {
        attr.entityId = this.entityId
        await attr.save({ transaction: txn })
      }),
      ...(this.CustomerAddressEntityTexts || []).map(async (attr) => {
        attr.entityId = this.entityId
        await attr.save({ transaction: txn })
      }),
    ])

    if (!topLevelTxn) {
      await txn.commit()
    }

    return this
  }

  async getAttributes(): Promise<EavAttribute[]> {
    const entityType = await this.getEavEntityType()
    const customerAddressAttributes = await entityType.getEavAttributes()

    return customerAddressAttributes
  }

  /**
   *  Get customer address attributes map
   * @returns
   */

  async toAttributeMap(): Promise<MagentoCustomerAddressAttributes> {
    const productAttributeMap: MagentoCustomerAddressAttributes = {}
    const productAttributes = await this.getAttributes()

    const [
      varcharAttributeValues,
      intAttributeValues,
      decimalAttributeValues,
      textAttributeValues,
    ] = await Promise.all([
      this.CustomerAddressEntityVarchars ?? [],
      this.CustomerAddressEntityInts ?? [],
      this.CustomerAddressEntityDecimals ?? [],
      this.CustomerAddressEntityTexts ?? [],
    ])

    const attributesValues = [
      ...varcharAttributeValues,
      ...intAttributeValues,
      ...decimalAttributeValues,
      ...textAttributeValues,
    ]

    attributesValues.forEach((attrValue) => {
      const attributeCode = productAttributes.find(
        (attr) => attr.attributeId === attrValue.attributeId,
      )?.attributeCode as MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE

      if (attributeCode) {
        productAttributeMap[attributeCode] = attrValue.value || null
      }
    })

    return productAttributeMap
  }
}

export class CustomerAddressEntityWithAttributeValues extends CustomerAddressEntity {
  declare CustomerAddressEntityVarchars: CustomerAddressEntityVarchar[]
  declare CustomerAddressEntityInts: CustomerAddressEntityInt[]
  declare CustomerAddressEntityDecimals: CustomerAddressEntityDecimal[]
  declare CustomerAddressEntityTexts: CustomerAddressEntityText[]
}
