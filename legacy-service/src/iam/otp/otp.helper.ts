import { Injectable } from '@nestjs/common'
import { AppConfigService } from '@shared/config/config.service'
import { createHash, createCipheriv, createDecipheriv } from 'crypto'

@Injectable()
export class OtpHelper {
  constructor(private readonly appConfigService: AppConfigService) {}

  encryptValue = (value: string) => {
    const saltkey = this.appConfigService.get('ENCRYPTION_SALT_KEY')
    if (!saltkey) {
      throw new Error(
        'ENCRYPTION_SALT_KEY is not defined in the environment variables.',
      )
    }
    const key = createHash('sha256').update(saltkey).digest()
    const cipher = createCipheriv('aes-256-ecb', key, null)

    let encrypted = cipher.update(value, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
  }

  decryptValue = (value: string) => {
    const saltkey = this.appConfigService.get('ENCRYPTION_SALT_KEY')
    if (!saltkey) {
      throw new Error(
        'ENCRYPTION_SALT_KEY is not defined in the environment variables.',
      )
    }
    const key = createHash('sha256').update(saltkey).digest()
    const decipher = createDecipheriv('aes-256-ecb', key, null)

    let decrypted = decipher.update(value, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }
}

export const otpHelper = new OtpHelper(new AppConfigService())
