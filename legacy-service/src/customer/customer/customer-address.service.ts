import { CoreStore } from '@/core/store/models/core-store.model'
import { DirectoryCountryRegionRepo } from '@/core/store/repo/directory-country-region.repo'
import { DirectoryRegionCityRepo } from '@/core/store/repo/directory-region-city.repo'
import { MAGNETO_DB_PROVIDER } from '@/database/db.types'
import {
  MAGENTO_ATTRIBUTE_BACKEND_TYPE,
  MAGENTO_ENTITY_TYPE_ID,
} from '@/eav/eav.types'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { EavAttributeRepo } from '@/eav/repo/eav-attribute.repo'
import { MagentoRPCService } from '@/rpc/rpc.service'
import { MAGENTO_RPC_METHOD } from '@/rpc/rpc.types'
import { BaseAddressDto } from '@/shared/shared.interface'
import { Inject, Injectable } from '@nestjs/common'
import { Op, Sequelize } from 'sequelize'
import {
  CustomerAddressNotFoundException,
  CustomerAddressOwnershipException,
  CustomerAddressUpdateException,
} from './customer.errors'
import {
  MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE,
  MagentoCustomerAddressAttributes,
  MagentoCustomerAddressAttributeValueType,
} from './customer.types'
import { CustomerAddressEntityDecimal } from './models/customer-address-entity-decimal.model'
import { CustomerAddressEntityInt } from './models/customer-address-entity-int.model'
import { CustomerAddressEntityText } from './models/customer-address-entity-text.model'
import { CustomerAddressEntityVarchar } from './models/customer-address-entity-varchar.model'
import {
  CustomerAddressEntity,
  CustomerAddressEntityWithAttributeValues,
} from './models/customer-address-entity.model'
import { CustomerEntity } from './models/customer-entity.model'
import { CustomerAddressEntityRepo } from './repo/customer-address-entity.repo'
import { CustomerEntityRepo } from './repo/customer-entity.repo'

interface ICustomerAddressService {
  getCustomerAddressById(
    addressId: number,
  ): Promise<CustomerAddressEntity | null>

  validateAndGetCustomerAddressById(
    addressId: number,
  ): Promise<CustomerAddressEntity>

  getCustomerAddressesForStore(
    customer: CustomerEntity,
    store: CoreStore,
  ): Promise<CustomerAddressEntity[]>

  validateCustomerAddressOwnership(
    customerAddress: CustomerAddressEntity,
    customer: CustomerEntity,
  ): Promise<void>

  buildFromCustomerAddressAttributeMap(
    addressAttributeMap: MagentoCustomerAddressAttributes,
  ): Promise<CustomerAddressEntity>

  updateCustomerAddress(
    customerAddress: CustomerAddressEntity,
    addressInfo: BaseAddressDto,
    isDefaultBilling: boolean,
    isDefaultShipping: boolean,
  ): Promise<void>

  createCustomerAddress(
    customer: CustomerEntity,
    addressInfo: BaseAddressDto,
    isDefaultBilling: boolean,
    isDefaultShipping: boolean,
  ): Promise<void>

  // upsertCustomerAddress(
  //   customerId: number,
  //   {
  //     addressId,
  //     firstName,
  //     lastName,
  //     phone,
  //     line1,
  //     line2,
  //     landmark,
  //     country,
  //     state,
  //     city,
  //     pincode,
  //     regionId,
  //     cityId,
  //     latitude,
  //     longitude,
  //     addressType,
  //   }: UpsertCustomerInputDto,
  // ): Promise<UpsertCustomerOutputDto>
}

@Injectable()
export class CustomerAddressService implements ICustomerAddressService {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    private readonly magentoDbProvider: Sequelize,
    private readonly customerEntityRepo: CustomerEntityRepo,
    private readonly customerAddressEntityRepo: CustomerAddressEntityRepo,
    private readonly directoryRegionCityRepo: DirectoryRegionCityRepo,
    private readonly directoryCountryRegionRepo: DirectoryCountryRegionRepo,
    private readonly eavAttributeRepo: EavAttributeRepo,
    private readonly magentoRpcService: MagentoRPCService,
  ) {}

  getCustomerAddressById(
    addressId: number,
  ): Promise<CustomerAddressEntity | null> {
    return this.customerAddressEntityRepo.findOneByPk(addressId.toString())
  }

  async validateAndGetCustomerAddressById(
    addressId: number,
  ): Promise<CustomerAddressEntity> {
    const customerAddress = await this.customerAddressEntityRepo.findOneByPk(
      addressId.toString(),
    )

    if (!customerAddress) {
      throw new CustomerAddressNotFoundException('Customer address not found!')
    }

    return customerAddress
  }

  async getCustomerAddressesForStore(
    customer: CustomerEntity,
    store: CoreStore,
  ): Promise<CustomerAddressEntity[]> {
    const [storeAssociatedCities, customerAddressAttributes] =
      await Promise.all([
        this.directoryRegionCityRepo.findAll({
          where: {
            storeId: store.storeId,
          },
        }),
        this.eavAttributeRepo.getCustomerAddressAttributes(),
      ])

    const cityIds = storeAssociatedCities.map((city) => city.cityId)
    const cityIdAttribute = customerAddressAttributes.find(
      (attr) =>
        attr.attributeCode === MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.CITY_ID,
    )!

    const customerStoreAddresses = await this.customerAddressEntityRepo.findAll(
      {
        where: {
          parentId: customer.entityId,
        },
        include: [
          {
            model: CustomerAddressEntityInt,
            required: true,
            where: {
              [Op.and]: [
                {
                  attributeId: cityIdAttribute.attributeId,
                },
                {
                  value: {
                    [Op.in]: cityIds,
                  },
                },
              ],
            },
          },
        ],
      },
    )

    return customerStoreAddresses
  }

  async buildFromCustomerAddressAttributeMap(
    addressAttributeMap: MagentoCustomerAddressAttributes = {},
  ): Promise<CustomerAddressEntity> {
    const newCustomerAddress = new CustomerAddressEntity({
      entityTypeId: MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
      parentId: 0,
    })

    await this._buildCustomerAddressAttributes(
      newCustomerAddress,
      addressAttributeMap,
    )

    return newCustomerAddress
  }

  private async _buildCustomerAddressAttributes(
    newCustomerAddress: CustomerAddressEntity,
    attributeMap?: MagentoCustomerAddressAttributes,
  ) {
    const customerAddressAttributes =
      await this.eavAttributeRepo.getCustomerAddressAttributes()

    const filterAttributesWithValues = (
      attributes: EavAttribute[],
      backendType: MAGENTO_ATTRIBUTE_BACKEND_TYPE,
    ) => {
      return attributes.filter(
        (attr) =>
          attr.backendType === backendType &&
          attributeMap &&
          attributeMap[
            attr.attributeCode as keyof MagentoCustomerAddressAttributes
          ] !== undefined,
      )
    }

    newCustomerAddress.CustomerAddressEntityVarchars =
      this.eavAttributeRepo.createEntityAttributeInstance(
        MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
        filterAttributesWithValues(
          customerAddressAttributes,
          MAGENTO_ATTRIBUTE_BACKEND_TYPE.VARCHAR,
        ),
        attributeMap || {},
        CustomerAddressEntityVarchar,
      )

    newCustomerAddress.CustomerAddressEntityTexts =
      this.eavAttributeRepo.createEntityAttributeInstance(
        MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
        filterAttributesWithValues(
          customerAddressAttributes,
          MAGENTO_ATTRIBUTE_BACKEND_TYPE.TEXT,
        ),
        attributeMap || {},
        CustomerAddressEntityText,
      )

    newCustomerAddress.CustomerAddressEntityInts =
      this.eavAttributeRepo.createEntityAttributeInstance(
        MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
        filterAttributesWithValues(
          customerAddressAttributes,
          MAGENTO_ATTRIBUTE_BACKEND_TYPE.INT,
        ),
        attributeMap || {},
        CustomerAddressEntityInt,
      )

    newCustomerAddress.CustomerAddressEntityDecimals =
      this.eavAttributeRepo.createEntityAttributeInstance(
        MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
        filterAttributesWithValues(
          customerAddressAttributes,
          MAGENTO_ATTRIBUTE_BACKEND_TYPE.DECIMAL,
        ),
        attributeMap || {},
        CustomerAddressEntityDecimal,
      )

    return newCustomerAddress
  }

  // async upsertCustomerAddress(
  //   customerId: number,
  //   {
  //     addressId,
  //     firstName,
  //     lastName,
  //     phone,
  //     line1,
  //     line2,
  //     landmark,
  //     country,
  //     state,
  //     city,
  //     pincode,
  //     regionId,
  //     cityId,
  //     latitude,
  //     longitude,
  //     addressType,
  //   }: UpsertCustomerInputDto,
  // ): Promise<UpsertCustomerOutputDto> {
  //   const magentoCustomer = await this.customerEntityRepo.findOneByPk(
  //     customerId.toString(),
  //   )

  //   if (!magentoCustomer) {
  //     throw new CustomerNotFoundException('Customer not found!')
  //   }

  //   let customerAddressEntity: CustomerAddressEntity | null

  //   if (addressId) {
  //     // Updating existing address
  //     customerAddressEntity = await this._getCustomerAddressById(addressId)

  //     if (!customerAddressEntity) {
  //       throw new CustomerAddressNotFoundException(
  //         'Customer address not found!',
  //       )
  //     }
  //   } else {
  //     customerAddressEntity = new CustomerAddressEntity({
  //       entityTypeId: MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
  //       parentId: magentoCustomer.entityId,
  //     })
  //   }

  //   const customerAddressAttributes =
  //     await this.eavService.getCustomerAddressAttributes()

  //   const [
  //     customerAddressEntityVarchars,
  //     customerAddressEntityTexts,
  //     customerAddressEntityInts,
  //     customerAddressEntityDecimals,
  //   ] = await Promise.all([
  //     this.buildCustomerAddressAttributes(
  //       customerAddressAttributes,
  //       [
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.FIRSTNAME, firstName],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.LASTNAME, lastName],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.TELEPHONE, phone],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.POSTCODE, pincode],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.COUNTRY_ID, country],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.CITY, city],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.REGION, state],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.ADDRESS_TYPE, addressType],
  //       ],
  //       CustomerAddressEntityVarchar,
  //     ),
  //     this.buildCustomerAddressAttributes(
  //       customerAddressAttributes,
  //       [
  //         [
  //           MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.STREET,
  //           `${line1}, ${line2}, ${landmark}`,
  //         ],
  //       ],
  //       CustomerAddressEntityText,
  //     ),
  //     this.buildCustomerAddressAttributes(
  //       customerAddressAttributes,
  //       [
  //         [
  //           MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.REGION_ID,
  //           regionId.toString(),
  //         ],
  //         [MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.CITY_ID, cityId.toString()],
  //       ],
  //       CustomerAddressEntityInt,
  //     ),
  //     this.buildCustomerAddressAttributes(
  //       customerAddressAttributes,
  //       [
  //         [
  //           MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.LATTITUDE,
  //           latitude.toString(),
  //         ],
  //         [
  //           MAGENTO_CUSTOMER_ADDRESS_ATTRIBUTE_CODE.LONGITUDE,
  //           longitude.toString(),
  //         ],
  //       ],
  //       CustomerAddressEntityDecimal,
  //     ),
  //   ])

  //   customerAddressEntity.CustomerAddressEntityVarchars = [
  //     ...customerAddressEntityVarchars,
  //     ...(customerAddressEntity.CustomerAddressEntityVarchars || []),
  //   ]
  //   customerAddressEntity.CustomerAddressEntityTexts = [
  //     ...customerAddressEntityTexts,
  //     ...(customerAddressEntity.CustomerAddressEntityTexts || []),
  //   ]
  //   customerAddressEntity.CustomerAddressEntityInts = [
  //     ...customerAddressEntityInts,
  //     ...(customerAddressEntity.CustomerAddressEntityInts || []),
  //   ]
  //   customerAddressEntity.CustomerAddressEntityDecimals = [
  //     ...customerAddressEntityDecimals,
  //     ...(customerAddressEntity.CustomerAddressEntityDecimals || []),
  //   ]

  //   return this.magentoDbProvider.transaction(async (transaction) => {
  //     await customerAddressEntity.save({ transaction })

  //     if (customerAddressEntity.CustomerAddressEntityVarchars) {
  //       await Promise.all(
  //         customerAddressEntity.CustomerAddressEntityVarchars.map(
  //           async (varchar) => {
  //             varchar.entityId = customerAddressEntity.entityId
  //             varchar.entityTypeId = MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS

  //             await varchar.save({ transaction })
  //           },
  //         ),
  //       )
  //     }

  //     if (customerAddressEntity.CustomerAddressEntityTexts) {
  //       await Promise.all(
  //         customerAddressEntity.CustomerAddressEntityTexts.map(async (text) => {
  //           text.entityId = customerAddressEntity.entityId
  //           text.entityTypeId = MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS
  //           await text.save({ transaction })
  //         }),
  //       )
  //     }

  //     if (customerAddressEntity.CustomerAddressEntityInts) {
  //       await Promise.all(
  //         customerAddressEntity.CustomerAddressEntityInts.map(async (int) => {
  //           int.entityId = customerAddressEntity.entityId
  //           int.entityTypeId = MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS
  //           await int.save({ transaction })
  //         }),
  //       )
  //     }

  //     if (customerAddressEntity.CustomerAddressEntityDecimals) {
  //       await Promise.all(
  //         customerAddressEntity.CustomerAddressEntityDecimals.map(
  //           async (decimal) => {
  //             decimal.entityId = customerAddressEntity.entityId
  //             decimal.entityTypeId = MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS
  //             await decimal.save({ transaction })
  //           },
  //         ),
  //       )
  //     }

  //     return {
  //       ...this.toCustomerAddressDto(
  //         customerAddressEntity,
  //         this.getCustomerAddressAttributesMap(
  //           customerAddressAttributes,
  //           customerAddressEntity,
  //         ),
  //       ),
  //     }
  //   })
  // }

  async getCustomerAddressByIdWithAttributeValues(
    addressId: number,
  ): Promise<CustomerAddressEntityWithAttributeValues | null> {
    const customerAddress =
      await this.customerAddressEntityRepo.findOneWithAttributeValues({
        where: {
          entityId: addressId,
        },
      })

    return customerAddress
  }

  validateCustomerAddressOwnership(
    customerAddress: CustomerAddressEntity,
    customer: CustomerEntity,
  ): Promise<void> {
    if (customerAddress.parentId !== customer.entityId) {
      throw new CustomerAddressOwnershipException(
        'Customer address does not belong to the customer',
      )
    }

    return Promise.resolve()
  }

  async updateCustomerAddress(
    customerAddress: CustomerAddressEntity,
    addressInfo: BaseAddressDto,
    isDefaultBilling: boolean = false,
    isDefaultShipping: boolean = false,
  ): Promise<void> {
    const [addressCity, addressRegion] = await Promise.all([
      this.directoryRegionCityRepo.findOne({
        where: {
          cityId: addressInfo.cityId,
        },
      }),
      this.directoryRegionCityRepo.findOne({
        where: {
          regionId: addressInfo.regionId,
        },
      }),
    ])

    if (!addressCity || !addressRegion) {
      throw new CustomerAddressUpdateException(
        'Invalid city or region for the address',
      )
    }

    const res = await this.magentoRpcService.call(
      MAGENTO_RPC_METHOD.CUSTOMER_ADDRESS_UPDATE,
      [
        customerAddress.entityId,
        {
          city: addressCity.defaultName,
          city_id: addressInfo.cityId,
          company: addressInfo.company,
          country_id: addressInfo.countryId,
          firstname: addressInfo.firstName,
          lastname: addressInfo.lastName,
          postcode: addressInfo.postcode,
          region_id: addressInfo.regionId,
          region: addressRegion.defaultName,
          street: [addressInfo.line1, addressInfo.line2],
          telephone: addressInfo.phone,
          is_default_billing: isDefaultBilling,
          is_default_shipping: isDefaultShipping,
        },
      ],
    )
    return res
  }

  async createCustomerAddress(
    customer: CustomerEntity,
    addressInfo: BaseAddressDto,
    isDefaultBilling: boolean = false,
    isDefaultShipping: boolean = false,
  ): Promise<void> {
    const [addressCity, addressRegion] = await Promise.all([
      this.directoryRegionCityRepo.findOne({
        where: {
          cityId: addressInfo.cityId,
        },
      }),
      this.directoryRegionCityRepo.findOne({
        where: {
          regionId: addressInfo.regionId,
        },
      }),
    ])

    if (!addressCity || !addressRegion) {
      throw new CustomerAddressUpdateException(
        'Invalid city or region for the address',
      )
    }

    const res = await this.magentoRpcService.call(
      MAGENTO_RPC_METHOD.CUSTOMER_ADDRESS_CREATE,
      [
        customer.entityId,
        {
          city: addressCity.defaultName,
          city_id: addressInfo.cityId,
          company: addressInfo.company,
          country_id: addressInfo.countryId,
          firstname: addressInfo.firstName,
          lastname: addressInfo.lastName,
          postcode: addressInfo.postcode,
          region_id: addressInfo.regionId,
          region: addressRegion.defaultName,
          street: [addressInfo.line1, addressInfo.line2],
          telephone: addressInfo.phone,
          is_default_billing: isDefaultBilling,
          is_default_shipping: isDefaultShipping,
        },
      ],
    )
    return res
  }

  private _upsertAttributeValue(
    customerAddress: CustomerAddressEntity,
    attribute: EavAttribute,
    value: MagentoCustomerAddressAttributeValueType,
  ): void {
    const attributeValue = customerAddress.getAttributeValue(attribute)

    if (attributeValue) {
      attributeValue.value = value
      return
    }

    const newAttributeValue =
      this.eavAttributeRepo.createEntityAttributeInstance(
        MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
        [attribute],
        {
          [attribute.attributeCode]: value,
        },
        CustomerAddressEntityVarchar,
      )[0]

    customerAddress.CustomerAddressEntityVarchars.push(newAttributeValue)
  }

  // async compareCustomerAddresses(
  //   newAddress: CustomerAddressEntity,
  //   customer: CustomerEntity,
  // ) {
  //   const newAddressHash = await newAddress.generateHash()
  //   const existingHashes = await Promise.all(
  //     customer.CustomerAddressEntities.map(async (addr) => {
  //       await addr.loadAttributeValues()
  //       return addr.generateHash()
  //     }),
  //   )

  //   if (existingHashes.includes(newAddressHash)) {
  //     return
  //   }
  // }
}
