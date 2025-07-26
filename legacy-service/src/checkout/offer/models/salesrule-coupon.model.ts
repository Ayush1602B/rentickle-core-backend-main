import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { SalesRule } from './salesrule.model'

export type SalesRuleCouponAttributes = InferAttributes<SalesRuleCoupon>
export type SalesRuleCouponCreationAttributes =
  InferCreationAttributes<SalesRuleCoupon>

export class SalesRuleCoupon extends Model<
  SalesRuleCouponAttributes,
  SalesRuleCouponCreationAttributes
> {
  declare couponId: CreationOptional<number>
  declare ruleId: number
  declare code: string
  declare usageLimit: number | null
  declare usagePerCustomer: number | null
  declare timesUsed: number
  declare expirationDate: Date
  declare isPrimary: boolean

  static initialize(sequelize: Sequelize) {
    SalesRuleCoupon.init(
      {
        couponId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ruleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        usageLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        usagePerCustomer: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        timesUsed: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isPrimary: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.SALESRULE_COUPON,
        tableName: MAGENTO_TABLE_NAME.SALESRULE_COUPON,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    SalesRuleCoupon.belongsTo(SalesRule, {
      foreignKey: 'ruleId',
    })
  }
}
