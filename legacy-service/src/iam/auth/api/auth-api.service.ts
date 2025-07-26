import { StoreService } from '@/core/store/store.service'
import { CustomerService } from '@/customer/customer/customer.service'
import { OtpService } from '@/iam/otp/otp.service'
import { Injectable } from '@nestjs/common'
import {
  AuthSignupOtpExpiredException,
  AuthUserAlreadyExistsException,
  BadCredentialsException,
} from '../auth.errors'
import { AuthHelper } from '../auth.helper'
import { AUTH_OTP_PURPOSE } from '../auth.types'
import { CheckUserInputDto, CheckUserOutputDto } from './dto/check-user.dto'
import { IntrospectInputDto, IntrospectOutputDto } from './dto/introspect.dto'
import {
  LoginWithOtpInputDto,
  LoginWithOtpOutputDto,
} from './dto/login-with-otp.dto'
import {
  LoginWithPasswordInputDto,
  LoginWithPasswordOutputDto,
} from './dto/login-with-password.dto'
import {
  RegisterCustomerInputDto,
  RegisterCustomerOutputDto,
} from './dto/register-customer.dto'
import { RequestOtpInputDto, RequestOtpOutputDto } from './dto/request-otp.dto'
import { VerifyOtpInputDto, VerifyOtpOutputDto } from './dto/verify-otp.dto'

interface IAuthApiService {
  loginWithPassword(
    body: LoginWithPasswordInputDto,
  ): Promise<LoginWithPasswordOutputDto>
  loginWithOtp(body: LoginWithOtpInputDto): Promise<LoginWithOtpOutputDto>
  requestOtp(body: RequestOtpInputDto): Promise<RequestOtpOutputDto>
  verifyOtp(body: VerifyOtpInputDto): Promise<VerifyOtpOutputDto>
  checkUserExists(body: CheckUserInputDto): Promise<CheckUserOutputDto>
  registerCustomer(
    body: RegisterCustomerInputDto,
  ): Promise<RegisterCustomerOutputDto>
  logout(): Promise<void>
  introspect(dto: IntrospectInputDto): Promise<IntrospectOutputDto>
}

@Injectable()
export class AuthApiService implements IAuthApiService {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly otpService: OtpService,
    private readonly storeService: StoreService,
    private readonly customerService: CustomerService,
  ) {}

  async loginWithPassword({
    loginId,
    password,
  }: LoginWithPasswordInputDto): Promise<LoginWithPasswordOutputDto> {
    const customer = await this.customerService.getCustomerByLoginId(loginId)
    if (!customer) {
      throw new BadCredentialsException('Invalid email or password')
    }

    await this.customerService.validateCustomerPassword(customer, password)

    const accessToken = this.authHelper.generateAccessToken(
      this.authHelper.generateTokenPayload(customer),
    )

    return {
      accessToken,
    }
  }

  async loginWithOtp({
    loginId,
    otp,
  }: LoginWithOtpInputDto): Promise<LoginWithOtpOutputDto> {
    const customer = await this.customerService.getCustomerByLoginId(loginId)

    if (!customer) {
      throw new BadCredentialsException('Invalid email or password')
    }

    const { verified } = await this.otpService.verifyOtp({
      target: loginId,
      otp,
      purpose: AUTH_OTP_PURPOSE.LOGIN,
    })

    if (!verified) {
      throw new BadCredentialsException('Invalid OTP')
    }

    const accessToken = this.authHelper.generateAccessToken(
      this.authHelper.generateTokenPayload(customer),
    )

    return {
      accessToken,
    }
  }

  async requestOtp(body: RequestOtpInputDto): Promise<RequestOtpOutputDto> {
    const { target, purpose } = body

    const { expiresIn } = await this.otpService.generateAndSendOTP({
      target,
      purpose,
    })

    return {
      message: 'OTP sent successfully',
      expiresIn,
    }
  }

  async verifyOtp(body: VerifyOtpInputDto): Promise<VerifyOtpOutputDto> {
    await this.otpService.verifyOtp(body)
    return {
      message: 'OTP verified successfully',
    }
  }

  async checkUserExists({
    loginId,
  }: CheckUserInputDto): Promise<CheckUserOutputDto> {
    const customer = await this.customerService.getCustomerByLoginId(loginId)

    return {
      userExists: Boolean(customer),
    }
  }

  async registerCustomer({
    firstName,
    lastName,
    phone,
    email,
    password,
    storeId,
  }: RegisterCustomerInputDto): Promise<RegisterCustomerOutputDto> {
    const [customerByEmail, customerByPhone, store] = await Promise.all([
      this.customerService.getCustomerByLoginId(email),
      this.customerService.getCustomerByLoginId(phone),
      this.storeService.validateAndGetStoreById(storeId),
    ])

    if (customerByPhone) {
      throw new AuthUserAlreadyExistsException(
        'Customer already exists with provided phone number!',
      )
    }

    if (customerByEmail) {
      throw new AuthUserAlreadyExistsException(
        'Customer already exists with provided email!',
      )
    }

    const otpVerified = await this.otpService.isOtpVerified({
      target: phone,
      purpose: AUTH_OTP_PURPOSE.SIGNUP,
    })

    if (otpVerified === false) {
      throw new AuthSignupOtpExpiredException(
        'Customer signup session expired, generate new OTP!',
      )
    }

    const newCustomer =
      await this.customerService.initiateRegistrationWithEmail(email, {
        firstname: firstName,
        lastname: lastName,
        password_hash: this.customerService.generatePasswordHash(password),
        confirmation: '1',
        created_in: store.name,
      })

    newCustomer.phone = phone
    newCustomer.storeId = storeId
    newCustomer.groupId = 1
    newCustomer.websiteId = store.websiteId

    await newCustomer.save()

    const accessToken = this.authHelper.generateAccessToken(
      this.authHelper.generateTokenPayload(newCustomer),
    )

    return new RegisterCustomerOutputDto({
      accessToken,
      message: 'Customer registered successfully',
    })
  }

  logout(): Promise<void> {
    return Promise.resolve()
  }

  async introspect({
    tokenPayload: { email },
    storeId,
  }: IntrospectInputDto): Promise<IntrospectOutputDto> {
    const customer = await this.customerService.getCustomerByLoginId(email)
    if (!customer) {
      throw new BadCredentialsException('Invalid email or password')
    }

    const activeCart = await this.customerService.getActiveCart(
      customer.entityId,
      storeId,
    )
    return IntrospectOutputDto.fromEntity(customer, activeCart)
  }
}
