import { Document as MongoDocument } from 'mongodb'
import { RmpBaseRepo } from './repo/base.repo'
export interface RMPEmbeddedUser {
  _id: string
  userName: string
}

export interface RMPRecordComment {
  _id: string
  type: string
  commentedAt?: string
  user: RMPEmbeddedUser
  status: string
  message: string
  action?: string
}

export interface RMPStatusLog {
  _id: string
  executedBy: string
  executedAt: string
  status: string
}

export class RmpBaseDocument implements MongoDocument {}

export class RMPRecordDocument<RecordDetails = object> extends RmpBaseDocument {
  state: string
  status: string
  user: RMPEmbeddedUser
  details: RecordDetails
  store: string
  comments: [RMPRecordComment]
  createdAt?: any
  updatedAt?: any
  statusLog: [RMPStatusLog]
}

export enum ADDRESS_TYPE {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export class AddressInfo {
  declare lineOne: string
  declare lineTwo: string
  declare addressType: ADDRESS_TYPE
  declare city: string
  declare region: string
  declare pincode: string
  declare country: string
}

export class BankInfo {
  declare name: string
  declare branch: string
  declare contact: string
  declare address: string
  declare city: string
  declare district: string
  declare state: string
  declare code: string
}

export abstract class RmpBaseService<T extends MongoDocument> {
  abstract getRepo(): RmpBaseRepo<T>
}
