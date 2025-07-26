import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { CategoryTreeNodeDto } from './api/dto/category-get-tree.dto'
import { MAGENTO_CATEGORY_ATTRIBUTE_CODE } from './category.types'
import { CatalogCategoryEntity } from './models/catalog-category-entity.model'

export class CategoryTree {
  private root: CatalogCategoryEntity
  private categoryMap: Map<number, CatalogCategoryEntity>
  private categoryAttributes: EavAttribute[] = []

  constructor(
    root: CatalogCategoryEntity,
    categoryMap: Map<number, CatalogCategoryEntity>,
    categoryAttributes: EavAttribute[] = [],
  ) {
    this.root = root
    this.categoryMap = categoryMap
    this.categoryAttributes = categoryAttributes
  }

  getRoot(): CatalogCategoryEntity {
    return this.root
  }

  static buildTree(
    treeRoot: CatalogCategoryEntity,
    allCategories: CatalogCategoryEntity[],
    categoryAttributes: EavAttribute[] = [],
  ): CategoryTree {
    const categoryMap = new Map<number, CatalogCategoryEntity>()
    allCategories.forEach((category) =>
      categoryMap.set(category.entityId, category),
    )

    let root = categoryMap.get(treeRoot.entityId)
    if (!root) {
      categoryMap.set(treeRoot.entityId, treeRoot)
      root = treeRoot
    }

    const buildChildren = (parent: CatalogCategoryEntity): void => {
      parent.CatalogCategoryEntities = allCategories.filter(
        (category) => category.parentId === parent.entityId,
      )
      parent.CatalogCategoryEntities.forEach((child) => buildChildren(child))
    }

    buildChildren(root)
    return new CategoryTree(root, categoryMap, categoryAttributes)
  }

  getCategory(categoryId: number): CatalogCategoryEntity | null {
    return this.categoryMap.get(categoryId) || null
  }

  getChildren(categoryId: number): CatalogCategoryEntity[] | null {
    const category = this.categoryMap.get(categoryId)
    return category ? category.CatalogCategoryEntities || [] : null
  }

  toJSON(): CategoryTreeNodeDto {
    const serialize = (node: CatalogCategoryEntity): CategoryTreeNodeDto => {
      const nameAttribute = this.categoryAttributes.find(
        (attr) => attr.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.NAME,
      )
      const urlKeyAttribute = this.categoryAttributes.find(
        (attr) =>
          attr.attributeCode === MAGENTO_CATEGORY_ATTRIBUTE_CODE.URL_KEY,
      )
      const nameAttributeValue = node.CatalogCategoryEntityVarchars?.find(
        (varchar) => varchar.attributeId === nameAttribute?.attributeId,
      )
      const urlKeyAttributeValue = node.CatalogCategoryEntityVarchars?.find(
        (varchar) => varchar.attributeId === urlKeyAttribute?.attributeId,
      )

      return {
        id: node.entityId,
        level: node.level,
        name: nameAttributeValue ? nameAttributeValue?.value : null,
        urlKey: urlKeyAttributeValue ? urlKeyAttributeValue?.value : null,
        children: (node.CatalogCategoryEntities || []).map(serialize),
      }
    }

    return serialize(this.root)
  }
}
