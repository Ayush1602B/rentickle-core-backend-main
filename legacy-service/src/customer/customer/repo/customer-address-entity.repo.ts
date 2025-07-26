import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { FindOptions, Sequelize } from 'sequelize'
import { CustomerAddressEntityDecimal } from '../models/customer-address-entity-decimal.model'
import { CustomerAddressEntityInt } from '../models/customer-address-entity-int.model'
import { CustomerAddressEntityText } from '../models/customer-address-entity-text.model'
import { CustomerAddressEntityVarchar } from '../models/customer-address-entity-varchar.model'
import {
  CustomerAddressEntity,
  CustomerAddressEntityWithAttributeValues,
} from '../models/customer-address-entity.model'

@Injectable()
export class CustomerAddressEntityRepo extends BaseSequelizeRepo<CustomerAddressEntity> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.CUSTOMER_ADDRESS_ENTITY)
    private readonly customerEntityAddressModel: typeof CustomerAddressEntity,
  ) {
    super(sequelize, customerEntityAddressModel)
  }

  async findOneWithAttributeValues(
    opts?: FindOptions<CustomerAddressEntityWithAttributeValues> | undefined,
  ): Promise<CustomerAddressEntityWithAttributeValues | null> {
    const record = (await this.customerEntityAddressModel.findOne({
      ...opts,
      include: [
        {
          model: CustomerAddressEntityVarchar,
        },
        {
          model: CustomerAddressEntityText,
        },
        {
          model: CustomerAddressEntityInt,
        },
        {
          model: CustomerAddressEntityDecimal,
        },
      ],
    })) as CustomerAddressEntityWithAttributeValues

    return record
  }

  async findAllWithAttributeValues(
    opts?: FindOptions<CustomerAddressEntity> | undefined,
  ): Promise<CustomerAddressEntityWithAttributeValues[]> {
    const records = (await this.findAll({
      include: [
        {
          model: CustomerAddressEntityVarchar,
        },
        {
          model: CustomerAddressEntityText,
        },
        {
          model: CustomerAddressEntityInt,
        },
        {
          model: CustomerAddressEntityDecimal,
        },
      ],
      ...opts,
    })) as CustomerAddressEntityWithAttributeValues[]

    return records
  }
}
