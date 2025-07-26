import { setTimeout } from 'timers/promises'

import { AppLogger } from '@/shared/logging/logger.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RetryService {
  constructor(private readonly logger: AppLogger) {}

  /**
   * Retries a given operation a specified number of times with a delay between attempts.
   * @param operation - The async operation to retry.
   * @param retries - Maximum number of retries (default is 3).
   * @param delay - Delay in milliseconds between retries (default is 1000ms).
   * @returns The result of the operation if successful.
   * @throws The last error encountered if all retries fail.
   */
  async executeWithRetries<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000,
  ): Promise<T> {
    let lastError: unknown = null

    for (let attempt = 1; attempt <= retries; attempt = attempt + 1) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        if (attempt < retries) {
          this.logger.warn(
            `Operation failed on attempt ${attempt}. Retrying in ${delay}ms...`,
            { error },
          )
          await setTimeout(delay)
        }
      }
    }

    this.logger.error(`Operation failed after ${retries} attempts`, {
      error: lastError,
    })

    throw lastError instanceof Error
      ? lastError
      : new Error('Unknown error occurred during retries')
  }
}
