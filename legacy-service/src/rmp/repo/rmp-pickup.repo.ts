import { RMP_COLLECTION_NAME } from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Collection } from 'mongodb'
import { OrderDocument } from '../models/rmp-order.model'
import { RmpBaseRepo } from './base.repo'

@Injectable()
export class RmpPickupRepo extends RmpBaseRepo<OrderDocument> {
  constructor(
    @Inject(RMP_COLLECTION_NAME.PICKUP)
    private readonly rmpPickupCollection: Collection<OrderDocument>,
  ) {
    super(rmpPickupCollection)
  }
}
