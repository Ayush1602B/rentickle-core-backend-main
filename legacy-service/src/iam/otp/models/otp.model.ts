import { CORE_MODEL_NAME, CORE_TABLE_NAME } from '@/database/db.types'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'
import { otpHelper } from '../otp.helper'
import { OTP_MEDIUM } from '../otp.types'

export type OtpAttributes = InferAttributes<Otp>
export type OtpCreationAttributes = InferCreationAttributes<Otp>

export class Otp extends Model<OtpAttributes, OtpCreationAttributes> {
  declare id: CreationOptional<number>

  declare otp: string

  declare remainingVerifyAttempts: CreationOptional<number>
  declare remainingRetryAttempts: CreationOptional<number>

  declare target: string
  declare medium: OTP_MEDIUM
  declare purpose: string

  declare isUsed: CreationOptional<boolean | null>
  declare verifiedAt: CreationOptional<Date | null>

  declare expiresAt: Date
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare deletedAt: CreationOptional<Date | null>

  static initialize(sequelize: Sequelize) {
    Otp.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        otp: {
          type: DataTypes.STRING,
          allowNull: false,
          set(value: number) {
            // Convert the number to a string for encryption
            const stringValue = value.toString()
            const encrypted = otpHelper.encryptValue(stringValue) // Encrypt the stringified number
            this.setDataValue('otp', encrypted) // Store the encrypted value
          },
          get() {
            const encryptedValue = this.getDataValue('otp') // Retrieve the encrypted value
            const decrypted = otpHelper.decryptValue(encryptedValue) // Decrypt the value
            return decrypted
          },
        },
        remainingVerifyAttempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 3,
        },
        remainingRetryAttempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 3,
        },
        target: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        medium: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: Object.values(OTP_MEDIUM),
        },
        purpose: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isUsed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        verifiedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: CORE_MODEL_NAME.OTP,
        tableName: CORE_TABLE_NAME.OTP,
        timestamps: true,
        paranoid: true,
        underscored: true,
      },
    )
  }

  static associate() {}
}
