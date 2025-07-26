import {
  BaseSequelizeRepo,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
} from '@/database/db.types'

import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { SalesFlatQuoteAddress } from '../models/sales-flat-quote-address.model'
import { SalesFlatQuoteItemOption } from '../models/sales-flat-quote-item-option.model'
import { SalesFlatQuoteItem } from '../models/sales-flat-quote-item.model'
import { SalesFlatQuote } from '../models/sales-flat-quote.model'
import { CatalogProductEntity } from '@/catalog/product/models/catalog-product-entity.model'
import { SalesFlatQuoteShippingRate } from '../models/sales-flat-quote-shipping-rate.model'

@Injectable()
export class SalesFlatQuoteRepo extends BaseSequelizeRepo<SalesFlatQuote> {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(MAGENTO_MODEL_NAME.SALES_FLAT_QUOTE)
    private salesFlatQuoteModel: typeof SalesFlatQuote,
  ) {
    super(sequelize, salesFlatQuoteModel)
  }

  async findCartWithItemsAndAddresses(
    cartId: number,
  ): Promise<SalesFlatQuote | null> {
    const cart = await this.findOne({
      where: {
        entityId: cartId,
      },
      include: [
        {
          model: SalesFlatQuoteItem,
          include: [
            {
              model: SalesFlatQuoteItemOption,
            },
            {
              model: CatalogProductEntity,
            },
          ],
        },
        {
          model: SalesFlatQuoteAddress,
          include: [
            {
              model: SalesFlatQuoteShippingRate,
            },
          ],
        },
      ],
    })

    return cart
  }
}
