import { CoreStore } from '@/core/store/models/core-store.model'
import { CustomerEntity } from '@/customer/customer/models/customer-entity.model'
import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { ADDRESS_TYPE } from '@/rmp/rmp.types'
import { SalesFlatOrder } from '@/sales/order/models/sales-flat-order.model'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  SaveOptions,
  Sequelize,
} from 'sequelize'
import { CART_CHECKOUT_METHOD } from '../cart.types'
import { SalesFlatQuoteAddress } from './sales-flat-quote-address.model'
import { SalesFlatQuoteItem } from './sales-flat-quote-item.model'
import { SalesFlatQuotePayment } from './sales-flat-quote-payment.model'

export type SalesFlatQuoteAttributes = InferAttributes<SalesFlatQuote>
export type SalesFlatQuoteCreationAttributes =
  InferCreationAttributes<SalesFlatQuote>

export class SalesFlatQuote extends Model<
  SalesFlatQuoteAttributes,
  SalesFlatQuoteCreationAttributes
> {
  declare entityId: CreationOptional<number>
  declare storeId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare convertedAt: Date | null
  declare isActive: number
  declare isVirtual: number
  declare isMultiShipping: number
  declare itemsCount: number
  declare itemsQty: number
  declare origOrderId: number
  declare storeToBaseRate: number
  declare storeToQuoteRate: number
  declare baseCurrencyCode: string | null
  declare storeCurrencyCode: string | null
  declare quoteCurrencyCode: string | null
  declare grandTotal: number
  declare baseGrandTotal: number
  declare checkoutMethod: CART_CHECKOUT_METHOD | null
  declare customerId: number | null
  declare customerTaxClassId: number | null
  declare customerGroupId: number | null
  declare customerEmail: string | null
  declare customerPrefix: string | null
  declare customerFirstname: string | null
  declare customerMiddlename: string | null
  declare customerLastname: string | null
  declare customerSuffix: string | null
  declare customerDob: Date | null
  declare customerNote: string | null
  declare customerNoteNotify: number
  declare customerIsGuest: number
  declare remoteIp: string | null
  declare appliedRuleIds: string | null
  declare reservedOrderId: string | null
  declare passwordHash: string | null
  declare couponCode: string | null
  declare globalCurrencyCode: string | null
  declare baseToGlobalRate: number | null
  declare baseToQuoteRate: number | null
  declare customerTaxvat: string | null
  declare customerGender: string | null
  declare subtotal: number
  declare baseSubtotal: number
  declare subtotalWithDiscount: number | null
  declare baseSubtotalWithDiscount: number | null
  declare isChanged: number | null
  declare triggerRecollect: number
  declare extShippingInfo: string | null
  declare giftMessageId: number | null
  declare isPersistent: number

  declare SalesFlatQuoteItems: NonAttribute<SalesFlatQuoteItem[]>
  declare getSalesFlatQuoteItems: HasManyGetAssociationsMixin<SalesFlatQuoteItem>

  declare SalesFlatQuoteAddresses: NonAttribute<SalesFlatQuoteAddress[]>
  declare getSalesFlatQuoteAddresses: HasManyGetAssociationsMixin<SalesFlatQuoteAddress>

  declare SalesFlatQuotePayment: NonAttribute<SalesFlatQuotePayment>
  declare getSalesFlatQuotePayment: HasOneGetAssociationMixin<SalesFlatQuotePayment>

  declare CoreStore: NonAttribute<CoreStore>
  declare getCoreStore: BelongsToGetAssociationMixin<CoreStore>

  declare CustomerEntity: NonAttribute<CustomerEntity>
  declare getCustomerEntity: BelongsToGetAssociationMixin<CustomerEntity | null>

  declare SalesFlatOrder: NonAttribute<SalesFlatOrder>
  declare getSalesFlatOrder: HasOneGetAssociationMixin<SalesFlatOrder>

  static associations: {
    SalesFlatQuoteItems: Association<SalesFlatQuoteItem, SalesFlatQuote>
    SalesFlatQuoteAddresses: Association<SalesFlatQuoteAddress, SalesFlatQuote>
    SalesFlatQuotePayment: Association<SalesFlatQuotePayment, SalesFlatQuote>
  }

  static initialize(sequelize: Sequelize) {
    SalesFlatQuote.init(
      {
        entityId: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        storeId: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
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
        convertedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 1,
        },
        isVirtual: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        isMultiShipping: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        itemsCount: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        itemsQty: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        origOrderId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        storeToBaseRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        storeToQuoteRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        storeCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        quoteCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        grandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        baseGrandTotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
          defaultValue: 0.0,
        },
        checkoutMethod: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        customerTaxClassId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        customerGroupId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        customerEmail: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerPrefix: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        customerFirstname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerMiddlename: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        customerLastname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerSuffix: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        customerDob: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        customerNote: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerNoteNotify: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 1,
        },
        customerIsGuest: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        remoteIp: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        appliedRuleIds: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        reservedOrderId: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        couponCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        globalCurrencyCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        baseToGlobalRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseToQuoteRate: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        customerTaxvat: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        customerGender: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        subtotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseSubtotal: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        subtotalWithDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        baseSubtotalWithDiscount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        isChanged: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        triggerRecollect: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        extShippingInfo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        giftMessageId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        isPersistent: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE,
        tableName: MAGENTO_TABLE_NAME.SALES_FLAT_QUOTE,
        timestamps: true,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesFlatQuote.hasMany(SalesFlatQuoteItem, {
      foreignKey: 'quoteId',
    })
    SalesFlatQuote.hasMany(SalesFlatQuoteAddress, {
      foreignKey: 'quoteId',
    })
    SalesFlatQuote.hasOne(SalesFlatQuotePayment, {
      foreignKey: 'quoteId',
    })
    SalesFlatQuote.belongsTo(CoreStore, {
      foreignKey: 'storeId',
    })
    SalesFlatQuote.belongsTo(CustomerEntity, {
      foreignKey: 'customerId',
    })
    SalesFlatQuote.hasOne(SalesFlatOrder, {
      foreignKey: 'quoteId',
    })
  }

  public async save(
    options?:
      | SaveOptions<InferAttributes<SalesFlatQuote, { omit: never }>>
      | undefined,
  ): Promise<this> {
    const topLevelTxn = options?.transaction
    const localTxn = await this.sequelize.transaction()
    const txn = topLevelTxn || localTxn

    try {
      // Persist the cart and related entities in a transaction.
      await super.save({ transaction: txn })
      await Promise.all(
        this.SalesFlatQuoteItems.map(async (item) => {
          item.quoteId = this.entityId
          await item.save({ transaction: txn })

          await Promise.all(
            (item.SalesFlatQuoteItemOptions || []).map(async (option) => {
              option.itemId = item.itemId
              await option.save({ transaction: txn })
            }),
          )
        }),
      )

      await Promise.all(
        this.SalesFlatQuoteAddresses.map(async (addr) => {
          addr.quoteId = this.entityId
          await addr.save({ transaction: txn })

          if (addr.SalesFlatQuoteShippingRate) {
            addr.SalesFlatQuoteShippingRate.addressId = addr.addressId
            await addr.SalesFlatQuoteShippingRate?.save({
              transaction: txn,
            })
          }
        }),
      )

      if (this.SalesFlatQuotePayment) {
        this.SalesFlatQuotePayment.setCart(this)
        await this.SalesFlatQuotePayment.save({ transaction: txn })
      }

      if (!topLevelTxn) {
        await txn.commit()
      }
    } catch (error) {
      if (!topLevelTxn) {
        await txn.rollback()
      }

      throw error
    }

    return this
  }

  isEmpty() {
    return this.itemsCount === 0
  }

  getIsActive() {
    return this.isActive === 1
  }

  getIsVirtual() {
    return this.isVirtual === 1
  }

  getIsMultiShipping() {
    return this.isMultiShipping === 1
  }

  getIsPersistent() {
    return this.isPersistent === 1
  }

  isNew() {
    return this.isNewRecord
  }

  setStore(store: CoreStore) {
    this.storeId = store.storeId
    this.CoreStore = store

    return this
  }

  setCustomer(customer: CustomerEntity) {
    this.customerId = customer.entityId
    this.customerIsGuest = 0
    this.customerEmail = customer.email
    this.customerGroupId = customer.groupId
    this.checkoutMethod = CART_CHECKOUT_METHOD.CUSTOMER

    this.CustomerEntity = customer

    return this
  }

  getShippingAddress() {
    return this.SalesFlatQuoteAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.SHIPPING,
    )
  }

  getBillingAddress() {
    return this.SalesFlatQuoteAddresses.find(
      (addr) => addr.addressType === ADDRESS_TYPE.BILLING,
    )
  }

  addItem(item: SalesFlatQuoteItem) {
    this.SalesFlatQuoteItems = [...(this.SalesFlatQuoteItems || []), item]

    this.itemsCount = Number(this.itemsCount) + 1
    this.itemsQty = Number(this.itemsQty) + item.qty

    item.setCart(this)
    return this
  }

  addAddress(address: SalesFlatQuoteAddress) {
    this.SalesFlatQuoteAddresses = [
      ...(this.SalesFlatQuoteAddresses || []),
      address,
    ]

    address.setCart(this)
    return this
  }

  async loadStore(force?: boolean): Promise<NonAttribute<CoreStore>> {
    if (this.CoreStore && !force) {
      return this.CoreStore
    }

    this.CoreStore = await this.getCoreStore()
    return this.CoreStore
  }
}
