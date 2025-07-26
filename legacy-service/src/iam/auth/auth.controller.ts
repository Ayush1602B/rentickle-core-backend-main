import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

import {
  AuthenticatedRequest,
  BaseRequest,
  HTTP_STATUS_CODE,
} from '@/shared/api/api.types'
import { ApiHeader, ApiResponse } from '@nestjs/swagger'
import { AuthApiService } from './api/auth-api.service'
import { CheckUserInputDto, CheckUserOutputDto } from './api/dto/check-user.dto'
import {
  IntrospectInputDto,
  IntrospectOutputDto,
} from './api/dto/introspect.dto'
import {
  LoginWithOtpInputDto,
  LoginWithOtpOutputDto,
} from './api/dto/login-with-otp.dto'
import {
  LoginWithPasswordInputDto,
  LoginWithPasswordOutputDto,
} from './api/dto/login-with-password.dto'
import {
  RegisterCustomerInputDto,
  RegisterCustomerOutputDto,
} from './api/dto/register-customer.dto'
import {
  RequestOtpInputDto,
  RequestOtpOutputDto,
} from './api/dto/request-otp.dto'
import { VerifyOtpInputDto, VerifyOtpOutputDto } from './api/dto/verify-otp.dto'
import { AuthGuard } from './auth.guard'

// Define the AuthController to handle authentication-related endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authApiService: AuthApiService) {} // Inject AuthService to handle authentication logic

  /**
   * Endpoint to authenticate a user with email and password.
   * This method verifies the provided credentials and, if valid, returns an access token and expiry time.
   *
   * @param {LoginWithPasswordBodyDTO} body - The request body containing the user's email and password
   * @returns {Promise<LoginWithPasswordResponseDTO>} - A response with access token and expiration time
   */

  @Post('login-with-password')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: LoginWithPasswordOutputDto,
  })
  async loginWithPassword(
    @Body() body: LoginWithPasswordInputDto,
  ): Promise<LoginWithPasswordOutputDto> {
    const { accessToken } = await this.authApiService.loginWithPassword(
      plainToInstance(LoginWithPasswordInputDto, body),
    )

    return { accessToken }
  }

  @Post('login-with-otp')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: LoginWithOtpOutputDto,
  })
  async loginWithOtp(
    @Body() loginWithOtpBody: LoginWithOtpInputDto,
  ): Promise<LoginWithOtpOutputDto> {
    const { accessToken } = await this.authApiService.loginWithOtp(
      plainToInstance(LoginWithOtpInputDto, loginWithOtpBody),
    )

    return { accessToken }
  }

  @Post('request-otp')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: RequestOtpOutputDto,
  })
  async requestOtp(
    @Body() dto: RequestOtpInputDto,
  ): Promise<RequestOtpOutputDto> {
    const res = await this.authApiService.requestOtp(
      plainToInstance(RequestOtpInputDto, dto),
    )

    return res
  }

  @Post('verify-otp')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: VerifyOtpOutputDto,
  })
  async verifyOtp(@Body() dto: VerifyOtpInputDto): Promise<VerifyOtpOutputDto> {
    const res = await this.authApiService.verifyOtp(
      plainToInstance(VerifyOtpInputDto, dto),
    )

    return res
  }

  @Post('register')
  @HttpCode(HTTP_STATUS_CODE.Created)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Created,
    type: RegisterCustomerOutputDto,
  })
  async registerCustomer(
    @Req() req: BaseRequest,
    @Body() body: RegisterCustomerInputDto,
  ): Promise<RegisterCustomerOutputDto> {
    const storeId = req.storeId
    const res = await this.authApiService.registerCustomer(
      plainToInstance(RegisterCustomerInputDto, { ...body, storeId }),
    )

    return res
  }

  @Post('check-user')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: CheckUserOutputDto,
  })
  checkUserExists(
    @Body() checkUserDto: CheckUserInputDto,
  ): Promise<CheckUserOutputDto> {
    return this.authApiService.checkUserExists(
      plainToInstance(CheckUserInputDto, checkUserDto),
    )
  }

  @Post('logout')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    required: true,
  })
  logout(): Promise<void> {
    return this.authApiService.logout()
  }

  @UseGuards(AuthGuard)
  @Post('me')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: IntrospectOutputDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    required: true,
  })
  me(@Req() req: AuthenticatedRequest): Promise<IntrospectOutputDto> {
    return this.authApiService.introspect(
      plainToInstance(IntrospectInputDto, {
        tokenPayload: req.user,
      }),
    )
  }

  @UseGuards(AuthGuard)
  @Post('introspect')
  @HttpCode(HTTP_STATUS_CODE.Ok)
  @ApiResponse({
    status: HTTP_STATUS_CODE.Ok,
    type: IntrospectOutputDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    required: true,
  })
  introspect(@Req() req: AuthenticatedRequest): Promise<IntrospectOutputDto> {
    return this.authApiService.introspect(
      plainToInstance(IntrospectInputDto, {
        tokenPayload: req.auth.decoded,
        storeId: req.storeId,
      }),
    )
  }
}
