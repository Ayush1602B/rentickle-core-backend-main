import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Model, Sequelize } from 'sequelize'
import { MAGENTO_ENTITY_TYPE_ID } from '../eav.types'
import { CatalogEavAttribute } from '../models/catalog-eav-attribute.model'
import { EavAttribute } from '../models/eav-attribute.model'

@Injectable()
export class EavAttributeRepo extends BaseSequelizeRepo<EavAttribute> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE)
    private eavAttributeModel: typeof EavAttribute,
  ) {
    super(sequelize, eavAttributeModel)
  }

  async findProductAttributes(): Promise<EavAttribute[]> {
    const productAttributes = await this.findAll({
      where: {
        entityTypeId: MAGENTO_ENTITY_TYPE_ID.CATALOG_PRODUCT,
      },
    })
    return productAttributes
  }

  async findCustomerAttributes(): Promise<EavAttribute[]> {
    const customerAttributes = await this.findAll({
      where: {
        entityTypeId: MAGENTO_ENTITY_TYPE_ID.CUSTOMER,
      },
    })
    return customerAttributes
  }

  async findCategoryAttributes(): Promise<EavAttribute[]> {
    const categoryAttributes = await this.findAll({
      where: {
        entityTypeId: MAGENTO_ENTITY_TYPE_ID.CATALOG_CATEGORY,
      },
    })
    return categoryAttributes
  }

  async findFilterableProductAttributes(): Promise<EavAttribute[]> {
    const filterableProductAttributes = await this.findAll({
      where: {
        entityTypeId: MAGENTO_ENTITY_TYPE_ID.CATALOG_PRODUCT,
      },
      include: [
        {
          model: CatalogEavAttribute,
          where: {
            isFilterable: 1,
          },
        },
      ],
    })

    return filterableProductAttributes
  }

  async getCustomerAddressAttributes(): Promise<EavAttribute[]> {
    const customerAddressAttributes = await this.findAll({
      where: {
        entityTypeId: MAGENTO_ENTITY_TYPE_ID.CUSTOMER_ADDRESS,
      },
    })

    return customerAddressAttributes
  }

  createEntityAttributeInstance<
    T extends Model & {
      attributeId: number
      value: string | number | null
      entityId?: number
      entityTypeId?: number
    },
  >(
    entityTypeId: MAGENTO_ENTITY_TYPE_ID,
    entityAttributes: EavAttribute[],
    attributeMap: Record<string, any>,
    EntityClass: { new (): T },
  ): T[] {
    return entityAttributes.map((attr) => {
      const { attributeId, attributeCode } = attr

      // If entityId doesn't exist, just create a new entity
      const entity = new EntityClass()
      entity.entityTypeId = entityTypeId
      entity.attributeId = attributeId
      entity.value =
        attributeMap[attributeCode as keyof typeof attributeMap] || null

      return entity
    })
  }
}
