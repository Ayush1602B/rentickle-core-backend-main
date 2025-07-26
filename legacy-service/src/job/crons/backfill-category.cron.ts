import { CatalogCategoryEntityVarchar } from '@/catalog/category/models/catalog-category-entity-varchar.model'
import { CatalogCategoryEntity } from '@/catalog/category/models/catalog-category-entity.model'
import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { CatalogProductEntityRepo } from '@/catalog/product/repo/catalog-product-entity.repo'
import { EavAttribute } from '@/eav/models/eav-attribute.model'
import { OrderDocument, OrderItem } from '@/rmp/models/rmp-order.model'
import { RmpOrderRepo } from '@/rmp/repo/rmp-order.repo'
import { RmpPickupRepo } from '@/rmp/repo/rmp-pickup.repo'
import { AppLogger } from '@/shared/logging/logger.service'
import { CoreStoreGroup } from '@/core/store/models/core-store-group.model'
import { CoreStore } from '@/core/store/models/core-store.model'
import { CoreStoreRepo } from '@/core/store/repo/core-store.repo'
import { Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { BaseCron } from '../job.types'

@Injectable()
export class BackfillCategoryCron implements BaseCron {
  private batchSize: number = 500

  constructor(
    private logger: AppLogger,
    private rmpOrderRepo: RmpOrderRepo,
    private rmpPickupRepo: RmpPickupRepo,
    private catalogProductEntityRepo: CatalogProductEntityRepo,
    private coreStoreRepo: CoreStoreRepo,
  ) {}

  async run() {
    console.log('Starting backfill process...for RMP category path')
    let page = 0
    let orders: OrderDocument[]

    do {
      orders = await this.getOrders(page)
      if (orders.length === 0) {
        break
      }

      for (const order of orders) {
        await this.processOrder(order)
      }

      page += 1
    } while (orders.length === this.batchSize)

    console.log('Backfill process completed...for RMP category path')
  }

  private getOrders(page: number): Promise<OrderDocument[]> {
    return this.rmpOrderRepo
      .findAll({ 'details.1.product.categoryPath': { $exists: false } })
      .limit(this.batchSize)
      .skip(page * this.batchSize)
      .toArray()
  }

  private async processOrder(order: OrderDocument) {
    const storeCode = order.store
    const store = await this.coreStoreRepo.findOne({
      where: { code: storeCode },
      include: [{ model: CoreStoreGroup }],
    })

    if (!store) {
      this.logger.error(
        `Store not found for order ${order.details[0][0]?.orderId}`,
      )
      return
    }

    const productIds = this.extractProductIds(order)
    const magentoProducts = await this.catalogProductEntityRepo.findAll({
      where: { entityId: { [Op.in]: productIds } },
      include: [
        {
          model: CatalogCategoryEntity,
          include: [
            {
              model: CatalogCategoryEntityVarchar,
              include: [{ model: EavAttribute }],
            },
          ],
        },
      ],
    })

    for (const item of order.details[1] || []) {
      await this.processOrderItem(order, item, magentoProducts, store)
    }

    await Promise.all([
      this.rmpOrderRepo.findOneAndUpdate(
        { _id: order._id },
        { $set: { ...order } },
        {},
      ),
      this.rmpPickupRepo.findOneAndUpdate(
        { _id: order._id },
        { $set: { ...order } },
        {},
      ),
    ])
  }

  private async processOrderItem(
    order: OrderDocument,
    orderItem: OrderItem,
    magentoProducts: CatalogProductEntity[],
    store: CoreStore,
  ) {
    const magentoProduct = magentoProducts.find(
      (p) => p.entityId === Number(orderItem.product.id),
    )

    if (!magentoProduct) {
      this.logger.error(
        `Product not found for order item ${orderItem.product.id} in order ${order.details[0][0]?.orderId}`,
      )
      return
    }

    const categoryPath = await this.extractCategoryPath(
      orderItem,
      magentoProduct,
      store,
    )
    orderItem.product.categoryPath = categoryPath
  }

  private async extractCategoryPath(
    orderItem: OrderItem,
    product: CatalogProductEntity,
    store: CoreStore,
  ): Promise<string> {
    const allPaths: string[] = []
    const rootCategoryId = store.CoreStoreGroup.rootCategoryId

    if (product.CatalogCategoryEntities) {
      for (const category of product.CatalogCategoryEntities) {
        allPaths.push(category.path)
      }
    }

    allPaths.sort((a, b) => a.length - b.length)
    const categoryIds = allPaths.filter((path) =>
      path.split('/').includes(rootCategoryId.toString()),
    )

    if (categoryIds.length === 0) {
      return ''
    }

    const categoryPath = categoryIds[categoryIds.length - 1].split('/').slice(1)
    const categoryNames: string[] = []

    for (const categoryId of categoryPath) {
      const category = await CatalogCategoryEntityVarchar.findOne({
        where: { entityId: categoryId },
        include: [{ model: EavAttribute, where: { attributeCode: 'name' } }],
      })

      if (category?.value) {
        categoryNames.push(category.value)
      }
    }
    return categoryNames.join(' > ')
  }

  private extractProductIds(order: OrderDocument): number[] {
    return (order.details[1] || [])
      .map((item) => item.product?.id)
      .filter((id) => id)
  }
}
