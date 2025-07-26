import { AuthenticatedRequest } from '@/shared/api/api.types'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>()
  if (!request.auth) {
    return null
  }

  if (!request.auth.decoded) {
    return null
  }

  return request.auth.decoded
})
