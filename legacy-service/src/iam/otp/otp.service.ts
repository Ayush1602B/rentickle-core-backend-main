import { Injectable } from '@nestjs/common'
import { AppConfigService } from '@shared/config/config.service'
import { GLOBAL_TEST_OTP } from '@shared/constants'
import { Op } from 'sequelize'
import {
  GenerateAndSendOtpInputDto,
  GenerateAndSendOtpOutputDto,
  IsOtpVerifiedInputDto,
  VerifyOtpInputDto,
  VerifyOtpOutputDto,
} from './dto/otp-service.dto'
import { Otp } from './models/otp.model'
import {
  OtpAttempExhaustedException,
  OtpInvalidException,
  OtpInvalidTargetException,
} from './otp.errors'
import { OTP_MEDIUM } from './otp.types'
import { OtpRepo } from './repo/otp.repo'

interface IOtpService {
  generateAndSendOTP(
    generateOtpDTO: GenerateAndSendOtpInputDto,
  ): Promise<GenerateAndSendOtpOutputDto>
  verifyOtp(verifyOtpDto: VerifyOtpInputDto): Promise<VerifyOtpOutputDto | null>
  isOtpVerified(isOtpVerifiedDto: IsOtpVerifiedInputDto): Promise<boolean>
}

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    private readonly otpRepo: OtpRepo,
    private readonly appConfigService: AppConfigService,
  ) {}

  private extractOtpMedium(target: string): OTP_MEDIUM | null {
    if (target.includes('@')) {
      return OTP_MEDIUM.EMAIL
    }

    if (target.match(/^\+?\d{1,3}?\d{10}$/)) {
      return OTP_MEDIUM.PHONE
    }

    return null
  }

  async generateAndSendOTP({
    target,
    purpose,
    verifyAttempts = 3,
    retryAttempts = 10,
    expiryAt = new Date(Date.now() + 600000),
  }: GenerateAndSendOtpInputDto): Promise<GenerateAndSendOtpOutputDto> {
    const otpMedium = this.extractOtpMedium(target)
    if (!otpMedium) {
      throw new OtpInvalidTargetException(
        `Target should be either an email or a phone number! Received: ${target}`,
      )
    }

    let otpRecord = await this.otpRepo.findOne({
      where: {
        target,
        purpose,
        isUsed: false,
      },
    })

    if (!otpRecord) {
      const otp = this._generateOTP()
      otpRecord = await this.otpRepo.create({
        medium: otpMedium,
        expiresAt: expiryAt,
        remainingRetryAttempts: retryAttempts,
        remainingVerifyAttempts: verifyAttempts,
        otp,
        purpose,
        target,
      })
    } else {
      if (otpRecord.remainingRetryAttempts <= 0) {
        throw new OtpAttempExhaustedException(
          'Maximum retry attempts reached, please try again later in a few minutes',
        )
      }
      await otpRecord.decrement('remainingRetryAttempts')
      await otpRecord.update({
        expiresAt: expiryAt,
      })
    }

    const expiresIn = Math.ceil(
      (expiryAt.getTime() - new Date().getTime()) / 1000 / 60,
    )

    return {
      remainingVerifyAttempts: otpRecord.remainingVerifyAttempts,
      remainingRetryAttempts: otpRecord.remainingRetryAttempts,
      expiresIn: expiresIn + ' mins',
    }
  }

  private _generateOTP(): string {
    return this.appConfigService.isProd()
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : this.appConfigService.get('GLOBAL_TEST_OTP') ||
          GLOBAL_TEST_OTP.toString()
  }

  private validateOtpRecord(otpRecord: Otp | null): Otp {
    if (!otpRecord) {
      throw new OtpInvalidException('Invalid OTP')
    }

    const currentTime = new Date()
    if (currentTime > otpRecord.expiresAt) {
      throw new OtpInvalidException('OTP has expired')
    }

    if (otpRecord.remainingVerifyAttempts <= 0) {
      throw new OtpAttempExhaustedException(
        'No more attempts left to retry, please try again later in a few minutes',
      )
    }

    if (otpRecord.isUsed) {
      throw new OtpInvalidException('OTP has already been used')
    }

    return otpRecord
  }

  async verifyOtp({
    otp,
    target,
    purpose,
  }: VerifyOtpInputDto): Promise<VerifyOtpOutputDto> {
    const otpRecord = await this.otpRepo.findOne({
      where: {
        target,
        purpose,
        isUsed: false,
      },
    })

    const validatedOtpRecord = this.validateOtpRecord(otpRecord)

    if (validatedOtpRecord.otp !== otp) {
      await validatedOtpRecord.decrement('remainingVerifyAttempts')
      throw new OtpInvalidException('Invalid OTP')
    }

    await validatedOtpRecord.update({
      isUsed: true,
      verifiedAt: new Date(),
    })
    await validatedOtpRecord.destroy()

    return {
      verified: true,
    }
  }

  async isOtpVerified({
    target,
    purpose,
    allowedWindowInMinutes = 10,
  }: IsOtpVerifiedInputDto): Promise<boolean> {
    const now = new Date()
    const thresholdDate = new Date(
      now.getTime() - allowedWindowInMinutes * 60 * 1000,
    )

    const otpRecord = await this.otpRepo.findOne({
      where: {
        target,
        purpose,
        isUsed: true,
        verifiedAt: {
          [Op.gte]: thresholdDate,
        },
      },
      paranoid: false,
    })

    return Boolean(otpRecord) // true if exists and verified
  }
}
