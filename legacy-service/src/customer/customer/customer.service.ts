import { StoreService } from '@/core/store/store.service'
import { MAGNETO_DB_PROVIDER } from '@/database/db.types'
import { EavService } from '@/eav/eav.service'
import {
  MAGENTO_ATTRIBUTE_BACKEND_TYPE,
  MAGENTO_ENTITY_TYPE_ID,
} from '@/eav/eav.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { OtpService } from '@/iam/otp/otp.service'
import { Inject, Injectable } from '@nestjs/common'
import { createHash, randomBytes } from 'crypto'
import { Op, Sequelize } from 'sequelize'
import {
  CustomerInvalidPasswordException,
  CustomerNotFoundException,
} from './customer.errors'
import {
  MAGENTO_CUSTOMER_ATTRIBUTE_CODE,
  MagentoCustomerAttributes,
} from './customer.types'
import { CustomerAddressEntity } from './models/customer-address-entity.model'
import { CustomerEntityVarchar } from './models/customer-entity-varchar.model'
import {
  CustomerEntity,
  CustomerEntityWithAddress,
  CustomerEntityWithAttributes,
} from './models/customer-entity.model'
import { CustomerEntityRepo } from './repo/customer-entity.repo'
import { SalesFlatQuote } from '@/checkout/cart/models/sales-flat-quote.model'
import { SalesFlatQuoteRepo } from '@/checkout/cart/repo/sales-flat-quote.repo'

interface ICustomerService {
  getCustomerByLoginId(loginId: string): Promise<CustomerEntity | null>

  getCustomerById(customerId: number): Promise<CustomerEntity | null>
  validateAndGetCustomerById(customerId: number): Promise<CustomerEntity>

  getCustomerByIdWithAttributes(
    customerId: number,
  ): Promise<CustomerEntityWithAttributes | null>

  getCustomerByIdWithAddress(
    customerId: number,
  ): Promise<CustomerEntityWithAddress | null>

  getCustomerByLoginIdWithAttributes(
    loginId: string,
  ): Promise<CustomerEntityWithAttributes | null>

  getCustomerByLoginIdWithAddress(
    loginId: string,
  ): Promise<CustomerEntityWithAddress | null>

  validateCustomerPassword(
    customer: CustomerEntity,
    password: string,
  ): Promise<void>

  initiateRegistrationWithEmail(
    email: string,
    attributeMap?: MagentoCustomerAttributes,
  ): Promise<CustomerEntity>

  getActiveCart(
    customerId: number,
    storeId: number,
  ): Promise<SalesFlatQuote | null>
}

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    private readonly magentoDbProvider: Sequelize,
    private readonly customerEntityRepo: CustomerEntityRepo,
    private readonly otpService: OtpService,
    private readonly eavService: EavService,
    private readonly storeService: StoreService,
    private readonly salesFlatQuoteRepo: SalesFlatQuoteRepo,
  ) {}

  getCustomerById(customerId: number): Promise<CustomerEntity | null> {
    return this.customerEntityRepo.findOneByPk(customerId.toString())
  }

  async getActiveCart(
    customerId: number,
    storeId: number,
  ): Promise<SalesFlatQuote | null> {
    const activeCart = await this.salesFlatQuoteRepo.findOne({
      where: {
        customerId: customerId.toString(),
        storeId: storeId.toString(),
        isActive: true,
      },
    })

    return activeCart
  }

  async validateAndGetCustomerById(
    customerId: number,
  ): Promise<CustomerEntity> {
    const customer = await this.customerEntityRepo.findOneByPk(
      customerId.toString(),
    )

    if (!customer) {
      throw new CustomerNotFoundException(
        `Customer with ID ${customerId} not found!`,
      )
    }

    return customer
  }

  getCustomerByIdWithAddress(
    customerId: number,
  ): Promise<CustomerEntityWithAddress | null> {
    return this.customerEntityRepo.findOne({
      where: {
        entityId: customerId,
      },
      include: [
        {
          model: CustomerAddressEntity,
        },
      ],
    })
  }

  getCustomerByIdWithAttributes(
    customerId: number,
  ): Promise<CustomerEntityWithAttributes | null> {
    return this.customerEntityRepo.findOne({
      where: {
        entityId: customerId,
      },
      include: [
        {
          model: CustomerEntityVarchar,
        },
      ],
    })
  }

  getCustomerByLoginIdWithAddress(
    loginId: string,
  ): Promise<CustomerEntityWithAddress | null> {
    return this.customerEntityRepo.findOne({
      where: {
        [Op.or]: [{ email: loginId }, { phone: loginId }],
      },
      include: [
        {
          model: CustomerAddressEntity,
        },
      ],
    })
  }

  getCustomerByLoginIdWithAttributes(
    loginId: string,
  ): Promise<CustomerEntityWithAttributes | null> {
    return this.customerEntityRepo.findOne({
      where: {
        [Op.or]: [{ email: loginId }, { phone: loginId }],
      },
      include: [
        {
          model: CustomerEntityVarchar,
        },
      ],
    })
  }

  private getVarcharAttributeValue(
    attributeId: number,
    varcharValues: CustomerEntityVarchar[],
  ): any {
    const attributeValue = varcharValues.find(
      (varcharValue) => varcharValue.attributeId === attributeId,
    )

    return attributeValue ? attributeValue.value : null
  }

  private async getCustomerAttributesMap(
    customerAttributes: EavAttribute[],
    magentoCustomer: CustomerEntity,
  ): Promise<MagentoCustomerAttributes> {
    const customerAttributeMap: MagentoCustomerAttributes = {}
    const varcharAttributeValues =
      await magentoCustomer.getCustomerEntityVarchars()

    customerAttributes.forEach(({ attributeId, attributeCode }) => {
      const attributeValue = this.getVarcharAttributeValue(
        attributeId,
        varcharAttributeValues,
      )

      customerAttributeMap[attributeCode as MAGENTO_CUSTOMER_ATTRIBUTE_CODE] =
        attributeValue
    })

    return customerAttributeMap
  }

  private buildCustomerVarcharAttributes(
    customerVarcharAttributes: EavAttribute[],
    attrs: MagentoCustomerAttributes,
  ): CustomerEntityVarchar[] {
    return customerVarcharAttributes.map((varcharAttribute) => {
      const { attributeId, attributeCode } = varcharAttribute

      const cev = new CustomerEntityVarchar()
      cev.entityTypeId = MAGENTO_ENTITY_TYPE_ID.CUSTOMER
      cev.attributeId = attributeId
      cev.value =
        attrs[attributeCode as MAGENTO_CUSTOMER_ATTRIBUTE_CODE] || null

      return cev
    })
  }

  getCustomerByLoginId(loginId: string): Promise<CustomerEntity | null> {
    return this.customerEntityRepo.findOne({
      where: {
        [Op.or]: [{ email: loginId }, { phone: loginId }],
      },
    })
  }

  async validateCustomerPassword(
    customer: CustomerEntity,
    password: string,
  ): Promise<void> {
    const customerAttributeMap = await customer.getAttributesMap()

    const { password_hash } = customerAttributeMap

    const suppliedPasswordHash = createHash('md5')
      .update(password)
      .digest('hex')

    if (password_hash !== suppliedPasswordHash) {
      throw new CustomerInvalidPasswordException('Invalid password provided!')
    }
  }

  private async _createCustomer(attributeMap?: MagentoCustomerAttributes) {
    const newCustomer = new CustomerEntity({
      entityTypeId: MAGENTO_ENTITY_TYPE_ID.CUSTOMER,
    })

    const customerAttributes = await this.eavService.getCustomerAttributes()
    newCustomer.CustomerEntityVarchars = this.buildCustomerVarcharAttributes(
      customerAttributes.filter(
        (attr) => attr.backendType === MAGENTO_ATTRIBUTE_BACKEND_TYPE.VARCHAR,
      ),
      attributeMap || {},
    )

    return newCustomer
  }

  async initiateRegistrationWithEmail(
    email: string,
    attributeMap?: MagentoCustomerAttributes,
  ): Promise<CustomerEntity> {
    const newCustomer = await this._createCustomer(attributeMap)
    newCustomer.email = email

    return newCustomer
  }

  generatePasswordHash(password: string | null): string {
    if (!password) {
      password = this._generateRandomPassword()
    }

    return createHash('md5').update(password).digest('hex')
  }

  private _generateRandomPassword(): string {
    return randomBytes(6)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
  }

  // async registerCustomer({
  //   firstName,
  //   lastName,
  //   email,
  //   password,
  //   phone,
  //   storeId = DEFAULT_STORE_ID,
  // }: RegisterCustomerInputDto): Promise<RegisterCustomerOutputDto> {
  //   const [customerByEmail, customerByPhone] = await Promise.all([
  //     this._getCustomerByLoginId(email),
  //     this._getCustomerByLoginId(phone),
  //   ])

  //   if (customerByPhone) {
  //     throw new CustomerAlreadyExistsException(
  //       'Customer already exists with provided phone number!',
  //     )
  //   }

  //   if (customerByEmail) {
  //     throw new CustomerAlreadyExistsException(
  //       'Customer already exists with provided email!',
  //     )
  //   }

  //   const otpVerified = await this.otpService.isOtpVerified({
  //     target: phone,
  //     purpose: AUTH_OTP_PURPOSE.SIGNUP,
  //   })

  //   if (otpVerified === false) {
  //     throw new CustomerSignupSessionExpireException(
  //       'Customer signup session expired, generate new OTP!',
  //     )
  //   }

  //   const [customerAttributes, store] = await Promise.all([
  //     ,
  //     this.storeService.getById(storeId),
  //   ])

  //   const newCustomer = new CustomerEntity({
  //     entityTypeId: MAGENTO_ENTITY_TYPE_ID.CUSTOMER,
  //     email,
  //     phone,
  //     storeId,
  //   })

  //   return this.magentoDbProvider.transaction(async (transaction) => {
  //     await newCustomer.save({
  //       transaction,
  //     })

  //     if (newCustomer.CustomerEntityVarchars) {
  //       await Promise.all(
  //         newCustomer.CustomerEntityVarchars.map(async (varchar) => {
  //           varchar.entityId = newCustomer.entityId
  //           varchar.entityTypeId = MAGENTO_ENTITY_TYPE_ID.CUSTOMER

  //           await varchar.save({ transaction })
  //         }),
  //       )
  //     }

  //     return {
  //       ...this.toCustomerDto(
  //         newCustomer,
  //         await this.getCustomerAttributesMap(customerAttributes, newCustomer),
  //       ),
  //     }
  //   })
  // }
}
