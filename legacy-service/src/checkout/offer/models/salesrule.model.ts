import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'

import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import { SalesRuleCoupon } from './salesrule-coupon.model'

export type SalesRuleAttributes = InferAttributes<SalesRule>
export type SalesRuleCreationAttributes = InferCreationAttributes<SalesRule>

export class SalesRule extends Model<
  SalesRuleAttributes,
  SalesRuleCreationAttributes
> {
  declare ruleId: CreationOptional<number>
  declare name: string
  declare description: string | null
  declare fromDate: Date
  declare toDate: Date
  declare usesPerCustomer: number
  declare isActive: boolean
  declare conditionsSerialized: string | null
  declare actionsSerialized: string | null
  declare stopRulesProcessing: boolean
  declare isAdvanced: boolean
  declare productIds: string | null
  declare sortOrder: number
  declare simpleAction: string
  declare discountAmount: number
  declare discountQty: number | null
  declare discountStep: number | null
  declare simpleFreeShipping: boolean
  declare applyToShipping: boolean
  declare timesUsed: number
  declare isRss: boolean
  declare couponType: number
  declare useAutoGeneration: boolean
  declare usesPerCoupon: number

  declare SalesRuleCoupons?: NonAttribute<SalesRuleCoupon[]>
  declare getSalesRuleCoupons: HasManyGetAssociationsMixin<SalesRuleCoupon>

  static associations: {
    SalesRuleCoupons: Association<SalesRuleCoupon, SalesRule>
  }

  static initialize(sequelize: Sequelize) {
    SalesRule.init(
      {
        ruleId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fromDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        toDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        usesPerCustomer: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        conditionsSerialized: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        actionsSerialized: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        stopRulesProcessing: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        isAdvanced: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        productIds: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        sortOrder: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        simpleAction: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        discountQty: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        discountStep: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        simpleFreeShipping: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        applyToShipping: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        timesUsed: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isRss: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        couponType: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        useAutoGeneration: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        usesPerCoupon: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALESRULE,
        tableName: MAGENTO_TABLE_NAME.SALESRULE,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesRule.hasMany(SalesRuleCoupon, {
      foreignKey: 'ruleId',
    })
  }
}
