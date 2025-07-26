import { Db } from 'mongodb'
import { Sequelize } from 'sequelize'
import {
  CORE_DB_PROVIDER,
  CORE_MODEL_NAME,
  MAGENTO_MODEL_NAME,
  MAGNETO_DB_PROVIDER,
  RMP_COLLECTION_NAME,
  RMP_DB_PROVIDER,
} from './db.types'

export function provideMagentoModel(modelName: MAGENTO_MODEL_NAME) {
  return {
    provide: modelName,
    useFactory: (sequelize: Sequelize) => sequelize.model(modelName),
    inject: [MAGNETO_DB_PROVIDER],
  }
}

export function provideCoreModel(modelName: CORE_MODEL_NAME) {
  return {
    provide: modelName,
    useFactory: (sequelize: Sequelize) => sequelize.model(modelName),
    inject: [CORE_DB_PROVIDER],
  }
}

export function provideRmpCollection(collectionName: RMP_COLLECTION_NAME) {
  return {
    provide: collectionName,
    useFactory: (rmpDatabase: Db) => rmpDatabase.collection(collectionName),
    inject: [RMP_DB_PROVIDER],
  }
}
