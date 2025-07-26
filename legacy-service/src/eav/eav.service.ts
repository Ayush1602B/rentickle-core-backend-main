import { MAGENTO_MODEL_NAME } from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { EavAttributeSetNotFoundException } from './eav.error'
import { MAGENTO_ENTITY_TYPE_CODE, MAGENTO_ENTITY_TYPE_ID } from './eav.types'
import { EavAttributeSet } from './models/eav-attribute-set.model'
import { EavAttribute } from './models/eav-attribute.model'
import { EavEntityAttribute } from './models/eav-entity-attribute.model'
import { EavEntityType } from './models/eav-entity-type.model'
import { EavAttributeSetRepo } from './repo/eav-attribute-set.repo'

interface IEavService {
  getAllEntityTypes(): Promise<EavEntityType[]>
  getByEntityTypeCode(
    entityTypeCode: MAGENTO_ENTITY_TYPE_CODE,
  ): Promise<EavEntityType | null>
  getAttributesByEntityTypeId(entityTypeId: number): Promise<EavAttribute[]>
  getCustomerAttributes(): Promise<EavAttribute[]>
  getCategoryAttributes(): Promise<EavAttribute[]>
  getProductAttributes(): Promise<EavAttribute[]>

  getAttributesBySetIds(attributeSetIds: number[]): Promise<EavAttribute[]>

  getAttributeSetsByIds(attributeSetIds: number[]): Promise<EavAttributeSet[]>

  validateAndGetAttributeSetById(
    attributeSetId: number,
  ): Promise<EavAttributeSet>
}

@Injectable()
export class EavService implements IEavService {
  constructor(
    @Inject(MAGENTO_MODEL_NAME.EAV_ENTITY_TYPE)
    private readonly magentoEavEntityTypeModel: typeof EavEntityType,
    @Inject(MAGENTO_MODEL_NAME.EAV_ATTRIBUTE)
    private readonly magentoEavAttributeModel: typeof EavAttribute,
    private readonly eavAttributeSetRepo: EavAttributeSetRepo,
  ) {}

  getAllEntityTypes(): Promise<EavEntityType[]> {
    return this.magentoEavEntityTypeModel.findAll()
  }

  getByEntityTypeCode(
    entityTypeCode: MAGENTO_ENTITY_TYPE_CODE,
  ): Promise<EavEntityType | null> {
    return this.magentoEavEntityTypeModel.findOne({
      where: {
        entityTypeCode,
      },
    })
  }

  async getAttributesByEntityTypeId(
    entityTypeId: number,
  ): Promise<EavAttribute[]> {
    const eavEntityType =
      await this.magentoEavEntityTypeModel.findByPk(entityTypeId)

    if (!eavEntityType) {
      return []
    }

    return eavEntityType.getEavAttributes()
  }

  async getCustomerAttributes(): Promise<EavAttribute[]> {
    const entityTypes = await this.getAllEntityTypes()
    const customerEntityType = entityTypes.find(
      (entityType) =>
        entityType.entityTypeCode === MAGENTO_ENTITY_TYPE_CODE.CUSTOMER,
    )

    if (!customerEntityType) {
      return []
    }

    return customerEntityType.getEavAttributes()
  }

  async getCustomerAddressAttributes(): Promise<EavAttribute[]> {
    const entityTypes = await this.getAllEntityTypes()
    const customerEntityType = entityTypes.find(
      (entityType) =>
        entityType.entityTypeCode === MAGENTO_ENTITY_TYPE_CODE.CUSTOMER_ADDRESS,
    )

    if (!customerEntityType) {
      return []
    }

    return customerEntityType.getEavAttributes()
  }

  async getCategoryAttributes(): Promise<EavAttribute[]> {
    const entityTypes = await this.getAllEntityTypes()
    const categoryEntityType = entityTypes.find(
      (entityType) =>
        entityType.entityTypeCode === MAGENTO_ENTITY_TYPE_CODE.CATALOG_CATEGORY,
    )

    if (!categoryEntityType) {
      return []
    }

    return categoryEntityType.getEavAttributes()
  }

  async getProductAttributes(): Promise<EavAttribute[]> {
    const entityTypes = await this.getAllEntityTypes()
    const categoryEntityType = entityTypes.find(
      (entityType) =>
        entityType.entityTypeCode === MAGENTO_ENTITY_TYPE_CODE.CATALOG_PRODUCT,
    )

    if (!categoryEntityType) {
      return []
    }

    return categoryEntityType.getEavAttributes()
  }

  getAttributeSetsByIds(attributeSetIds: number[]): Promise<EavAttributeSet[]> {
    return this.eavAttributeSetRepo.findAll({
      where: {
        attributeSetId: {
          [Op.in]: attributeSetIds,
        },
      },
    })
  }

  async validateAndGetAttributeSetById(
    attributeSetId: number,
  ): Promise<EavAttributeSet> {
    const attributeSet = await this.eavAttributeSetRepo.findOne({
      where: {
        attributeSetId,
      },
    })

    if (!attributeSet) {
      throw new EavAttributeSetNotFoundException(
        `Attribute set with ID ${attributeSetId} not found`,
      )
    }

    return attributeSet
  }

  async getAttributesBySetIds(
    attributeSetIds: number[],
  ): Promise<EavAttribute[]> {
    const attributeSets = await this.eavAttributeSetRepo.findAll({
      where: {
        attributeSetId: attributeSetIds,
      },
      include: [
        {
          model: EavEntityAttribute,
          where: {
            entityTypeId: MAGENTO_ENTITY_TYPE_ID.CATALOG_PRODUCT,
          },
          include: [
            {
              model: EavAttribute,
            },
          ],
        },
      ],
    })

    const entityAttributes = attributeSets
      .map((attributeSet) => attributeSet.EavEntityAttributes!)
      .flat()

    const attributeIds = entityAttributes.map(
      (entityAttr) => entityAttr.attributeId,
    )
    const uniqueAttributeIds = [...new Set(attributeIds)]

    const uniqueAttributes = entityAttributes
      .filter((entityAttr) => {
        if (uniqueAttributeIds.includes(entityAttr.EavAttribute.attributeId)) {
          return entityAttr.EavAttribute
        }
        return null
      })
      .map((entityAttr) => entityAttr.EavAttribute)
      .filter((attr) => attr !== null)

    return uniqueAttributes
  }
}
