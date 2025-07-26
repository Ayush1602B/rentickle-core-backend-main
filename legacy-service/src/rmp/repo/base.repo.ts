import { Injectable } from '@nestjs/common'
import {
  Abortable,
  Collection,
  DeleteOptions,
  DeleteResult,
  Document,
  Filter,
  FindCursor,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertManyResult,
  InsertOneResult,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
  WithId,
} from 'mongodb'

@Injectable()
export class RmpBaseRepo<T extends Document> {
  private collection: Collection<T>
  constructor(collection: Collection<T>) {
    this.collection = collection
  }

  findAll(
    filters: Filter<T>,
    opts: FindOptions<T> & Abortable = {},
  ): FindCursor<WithId<T>> {
    return this.collection.find(filters, opts)
  }

  findOne(filters: Filter<T>): Promise<WithId<T> | null> {
    return this.collection.findOne(filters)
  }

  async insertOne(
    doc: OptionalUnlessRequiredId<T>,
  ): Promise<InsertOneResult<T>> {
    const result = await this.collection.insertOne(doc)
    return result
  }

  async insertMany(
    docs: OptionalUnlessRequiredId<T>[],
  ): Promise<InsertManyResult<T>> {
    const result = await this.collection.insertMany(docs)
    return result
  }

  async findOneAndUpdate(
    filters: Filter<T>,
    update: UpdateFilter<T>,
    opts: FindOneAndUpdateOptions = {},
  ): Promise<WithId<T> | null> {
    const result = await this.collection.findOneAndUpdate(filters, update, opts)
    return result
  }

  async updateMany(
    filters: Filter<T>,
    update: UpdateFilter<T>,
    opts: UpdateOptions = {},
  ): Promise<UpdateResult<T>> {
    const result = await this.collection.updateMany(filters, update, opts)
    return result
  }

  async findOneAndDelete(filters: Filter<T>): Promise<WithId<T> | null> {
    const result = await this.collection.findOneAndDelete(filters)
    return result
  }

  async deleteMany(
    filters: Filter<T>,
    opts: DeleteOptions = {},
  ): Promise<DeleteResult> {
    const result = await this.collection.deleteMany(filters, opts)
    return result
  }
}
