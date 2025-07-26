import {
  BaseSequelizeRepo,
  CORE_DB_PROVIDER,
  CORE_MODEL_NAME,
} from '@/database/db.types'
import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { Otp } from '../models/otp.model'

@Injectable()
export class OtpRepo extends BaseSequelizeRepo<Otp> {
  constructor(
    @Inject(CORE_DB_PROVIDER)
    protected readonly sequelize: Sequelize,
    @Inject(CORE_MODEL_NAME.OTP)
    private otpModel: typeof Otp,
  ) {
    super(sequelize, otpModel)
  }
}
