import { Inject, Injectable } from '@nestjs/common'
import { Sequelize, Transaction, TransactionOptions } from 'sequelize'
import { MAGNETO_DB_PROVIDER } from './db.types'

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(MAGNETO_DB_PROVIDER)
    private magentoDbProvider: Sequelize,
  ) {}

  startMagentoTransaction<T = any>(
    autoCallback: (t: Transaction) => PromiseLike<T>,
    options: TransactionOptions = {},
  ) {
    return this.magentoDbProvider.transaction<T>(options, autoCallback)
  }
}
