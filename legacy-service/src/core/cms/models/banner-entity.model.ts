import { MAGENTO_MODEL_NAME, MAGENTO_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'

export class BannerEntity extends Model<
  InferAttributes<BannerEntity>,
  InferCreationAttributes<BannerEntity>
> {
  declare banner7Id: CreationOptional<number>
  declare title: string
  declare title2: string | null
  declare title3: string | null
  declare link: string
  declare image: string
  declare image2: string | null
  declare image3: string | null
  declare order: number
  declare storeId: string
  declare description: string | null
  declare status: number
  declare created_time: CreationOptional<Date>
  declare update_time: CreationOptional<Date>

  // Initialize the model
  static initialize(sequelize: Sequelize) {
    BannerEntity.init(
      {
        banner7Id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title2: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        title3: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        link: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image2: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        image3: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        storeId: {
          type: DataTypes.CHAR(255),
          allowNull: false,
          defaultValue: 0,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        created_time: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        },
        update_time: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: MAGENTO_MODEL_NAME.BANNER_ENTITY,
        tableName: MAGENTO_TABLE_NAME.BANNER_ENTITY,
        timestamps: false,
        underscored: true,
      },
    )
  }

  static associate() {}
}
