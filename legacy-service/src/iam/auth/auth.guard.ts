import { BaseRequest } from '@/shared/api/api.types'
import { extractTokenFromHeader } from '@/shared/api/api.util'
import { AppLogger } from '@/shared/logging/logger.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppConfigService } from '@shared/config/config.service'
import { TokenValidationFailedException } from './auth.errors'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<BaseRequest>()
    const token = extractTokenFromHeader(request)

    if (!token) {
      throw new TokenValidationFailedException('Invalid token provided.')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })

      request.auth = {
        token,
        decoded: payload,
      }
    } catch {
      throw new TokenValidationFailedException('Invalid token provided.')
    }

    return true
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
    private logger: AppLogger,
  ) {}
  /**
   * This guard is used to extract the JWT token from the request header
   * and attach the decoded payload to the request object.
   * It does not throw an error if the token is invalid or missing.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<BaseRequest>()
    const token = extractTokenFromHeader(request)

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        })

        request.auth = {
          token,
          decoded: payload,
        }
      } catch (err) {
        this.logger.error('optional auth guard triggered', err)
        // Ignore invalid token, treat as unauthenticated
      }
    }

    return true // Always allow
  }
}
