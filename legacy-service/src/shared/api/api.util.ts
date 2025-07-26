import { BaseRequest } from './api.types'

export const extractTokenFromHeader = (request: BaseRequest): string | null => {
  const [type, token] = request.headers.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : null
}
