import { RMP_COLLECTION_NAME } from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Collection } from 'mongodb'
import { OrderDocument } from '../models/rmp-order.model'
import { RmpBaseRepo } from './base.repo'

@Injectable()
export class RmpOrderRepo extends RmpBaseRepo<OrderDocument> {
  constructor(
    @Inject(RMP_COLLECTION_NAME.ORDER)
    private readonly rmpOrderCollection: Collection<OrderDocument>,
  ) {
    super(rmpOrderCollection)
  }
  async getOrderByIncrementId(
    incrementId: string,
  ): Promise<OrderDocument | null> {
    const order = await this.rmpOrderCollection.findOne({
      'details.0.orderId': incrementId,
    })

    return order
  }
}
