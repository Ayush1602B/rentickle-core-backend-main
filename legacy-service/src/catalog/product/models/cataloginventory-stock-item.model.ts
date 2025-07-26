import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize'
import { CatalogProductEntity } from './catalog-product-entity.model'

export class CataloginventoryStockItem extends Model<
  InferAttributes<CataloginventoryStockItem>,
  InferCreationAttributes<CataloginventoryStockItem>
> {
  declare itemId: CreationOptional<number>
  declare productId: number
  declare stockId: string
  declare qty: number
  declare minQty: number
  declare useConfigMinQty: number
  declare isQtyDecimal: number
  declare backorders: number
  declare useConfigBackorders: number
  declare minSaleQty: number
  declare useConfigMinSaleQty: number
  declare maxSaleQty: number
  declare useConfigMaxSaleQty: number
  declare isInStock: number
  declare lowStockDate: Date | null
  declare notifyStockQty: number | null
  declare useConfigNotifyStockQty: number
  declare manageStock: number
  declare useConfigManageStock: number
  declare stockStatusChangedAuto: number
  declare useConfigQtyIncrements: number
  declare qtyIncrements: number
  declare useConfigEnableQtyInc: number
  declare enableQtyIncrements: number
  declare isDecimalDivided: number

  declare CatalogProductEntity: NonAttribute<CatalogProductEntity>
  declare getCatalogProductEntity: BelongsToGetAssociationMixin<CatalogProductEntity>

  static associations: {
    CatalogProductEntity: Association<
      CataloginventoryStockItem,
      CatalogProductEntity
    >
  }

  static initialize(sequelize: Sequelize) {
    CataloginventoryStockItem.init(
      {
        itemId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        stockId: {
          type: DataTypes.STRING(32),
          allowNull: false,
        },
        qty: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
        },
        minQty: {
          type: DataTypes.DECIMAL(12, 4),
          defaultValue: 0,
        },
        useConfigMinQty: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        isQtyDecimal: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        backorders: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        useConfigBackorders: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        minSaleQty: {
          type: DataTypes.DECIMAL(12, 4),
          defaultValue: 1,
        },
        useConfigMinSaleQty: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        maxSaleQty: {
          type: DataTypes.DECIMAL(12, 4),
          defaultValue: 0,
        },
        useConfigMaxSaleQty: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        isInStock: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        lowStockDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notifyStockQty: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: true,
        },
        useConfigNotifyStockQty: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        manageStock: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        useConfigManageStock: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        stockStatusChangedAuto: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        useConfigQtyIncrements: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        qtyIncrements: {
          type: DataTypes.DECIMAL(12, 4),
          defaultValue: 0,
        },
        useConfigEnableQtyInc: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        enableQtyIncrements: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isDecimalDivided: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.CATALOGINVENTORY_STOCK_ITEM,
        tableName: MAGENTO_TABLE_NAME.CATALOGINVENTORY_STOCK_ITEM,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {
    CataloginventoryStockItem.belongsTo(CatalogProductEntity, {
      foreignKey: 'productId',
    })
  }
}
