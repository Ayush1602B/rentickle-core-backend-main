import { SalesFlatQuote } from '@/checkout/cart/models/sales-flat-quote.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
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
  MAGENTO_CUSTOMER_ATTRIBUTE_CODE,
  MagentoCustomerAttributes,
} from '../customer.types'
import { CustomerAddressEntity } from './customer-address-entity.model'
import { CustomerEntityVarchar } from './customer-entity-varchar.model'

export type CustomerEntityAttributes = InferAttributes<CustomerEntity>
export type CustomerEntityCreationAttributes =
  InferCreationAttributes<CustomerEntity>

export class CustomerEntity extends Model<
  CustomerEntityAttributes,
  CustomerEntityCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare entityTypeId: number
  declare attributeSetId: CreationOptional<number>
  declare websiteId: number | null
  declare email: string | null
  declare phone: string | null
  declare groupId: CreationOptional<number>
  declare incrementId: string | null
  declare storeId: CreationOptional<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare isActive: CreationOptional<number>
  declare disableAutoGroupChange: CreationOptional<number>

  // Relationships
  declare CustomerEntityVarchars: NonAttribute<CustomerEntityVarchar[]>
  declare getCustomerEntityVarchars: HasManyGetAssociationsMixin<CustomerEntityVarchar>

  declare CustomerAddressEntities: NonAttribute<CustomerAddressEntity[]>
  declare getCustomerAddressEntities: HasManyGetAssociationsMixin<CustomerAddressEntity>

  declare EavEntityType: NonAttribute<EavEntityType>
  declare getEavEntityType: BelongsToGetAssociationMixin<EavEntityType>

  static associations: {
    CustomerEntityVarchars: Association<CustomerEntityVarchar, CustomerEntity>
    CustomerAddressEntities: Association<CustomerAddressEntity, CustomerEntity>
    EavEntityType: Association<EavEntityType, CustomerEntity>
  }

  // Initialize the model
  static initialize(sequelize: Sequelize) {
    CustomerEntity.init(
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
        websiteId: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          defaultValue: 1,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
        },
        groupId: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          defaultValue: 0,
        },
        incrementId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        storeId: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          defaultValue: 0,
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
        disableAutoGroupChange: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CUSTOMER_ENTITY,
        tableName: MAGENTO_TABLE_NAME.CUSTOMER_ENTITY,
        timestamps: true,
        underscored: true,
      },
    )
  }

  // Define associations
  static associate() {
    CustomerEntity.hasMany(CustomerEntityVarchar, {
      foreignKey: 'entityId',
    })

    CustomerEntity.hasMany(CustomerAddressEntity, {
      foreignKey: 'parentId',
    })

    CustomerEntity.hasMany(SalesFlatQuote, {
      foreignKey: 'customerId',
    })

    CustomerEntity.belongsTo(EavEntityType, {
      foreignKey: 'entityTypeId',
    })
  }

  /**
   *  Get product attributes map
   * @param productAttributes
   * @param magentoProduct
   * @returns
   */

  async getAttributesMap(): Promise<MagentoCustomerAttributes> {
    const entityType = await this.getEavEntityType()
    const customerAttributes = await entityType.getEavAttributes()

    const customerAttributeMap: MagentoCustomerAttributes = {}

    const [varcharAttributeValues] = await Promise.all([
      this.getCustomerEntityVarchars(),
    ])

    const attributesMap = [...varcharAttributeValues]

    attributesMap.forEach((attrValue) => {
      const attributeCode = customerAttributes.find(
        (attr) => attr.attributeId === attrValue.attributeId,
      )?.attributeCode as MAGENTO_CUSTOMER_ATTRIBUTE_CODE

      if (attributeCode) {
        customerAttributeMap[attributeCode] = attrValue.value || null
      }
    })

    return customerAttributeMap
  }

  isRegistered(): boolean {
    return Boolean(this.entityId)
  }

  async save(
    options?:
      | SaveOptions<InferAttributes<CustomerEntity, { omit: never }>>
      | undefined,
  ): Promise<this> {
    const topLevelTxn = options?.transaction
    const localTxn = await this.sequelize.transaction()
    const txn = topLevelTxn || localTxn

    // Persist the cart and related entities in a transaction.
    await super.save({ ...options, transaction: txn })
    await Promise.all(
      (this.CustomerEntityVarchars || []).map(async (item) => {
        item.entityId = this.entityId
        await item.save({ transaction: txn })
      }),
    )

    await Promise.all(
      (this.CustomerAddressEntities || []).map(async (addr) => {
        addr.parentId = this.entityId
        await addr.save({ transaction: txn })
      }),
    )

    await Promise.all(
      (this.CustomerAddressEntities || []).map((item) =>
        item.save({
          transaction: txn,
        }),
      ),
    )

    if (!topLevelTxn) {
      await txn.commit()
    }

    return this
  }

  async getFullName(): Promise<string> {
    const attributeMap = await this.getAttributesMap()
    const firstName = attributeMap[MAGENTO_CUSTOMER_ATTRIBUTE_CODE.FIRSTNAME]
    const lastName = attributeMap[MAGENTO_CUSTOMER_ATTRIBUTE_CODE.LASTNAME]

    return Promise.resolve(`${firstName} ${lastName}`)
  }

  addAddress(address: CustomerAddressEntity): this {
    address.parentId = this.entityId
    address.setCustomer(this)

    this.CustomerAddressEntities = [
      ...(this.CustomerAddressEntities || []),
      address,
    ]

    return this
  }
}

export class CustomerEntityWithAddress extends CustomerEntity {
  declare CustomerAddressEntities: CustomerAddressEntity[]
}

export class CustomerEntityWithAttributes extends CustomerEntity {
  declare CustomerEntityVarchars: CustomerEntityVarchar[]
}

export class CustomerEntityWithAddressAndAttributes extends CustomerEntity {
  declare CustomerAddressEntities: CustomerAddressEntity[]
  declare CustomerEntityVarchars: CustomerEntityVarchar[]
}
