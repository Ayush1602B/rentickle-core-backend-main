import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { AppConfigService } from '@shared/config/config.service'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import * as xmlrpc from 'xmlrpc'
import { RPCUnavailableException } from './rpc.errors'
import { MAGENTO_RPC_METHOD } from './rpc.types'

@Injectable()
export class MagentoRPCService implements OnModuleInit, OnModuleDestroy {
  private rpcClient: xmlrpc.Client
  private httpClient: AxiosInstance
  private sessionId: string | null = null

  constructor(private readonly appConfigService: AppConfigService) {}

  onModuleInit() {
    // Create the SOAP client during module initialization
    this.rpcClient = xmlrpc.createSecureClient({
      url: `${this.appConfigService.getOrThrow('MAGENTO_API_URL')}/api/xmlrpc`,
    })
    this.httpClient = axios.create()
  }

  login() {
    return new Promise<string>((resolve, reject) => {
      this.rpcClient.methodCall(
        'login',
        [
          this.appConfigService.getOrThrow('MAGENTO_API_USER'),
          this.appConfigService.getOrThrow('MAGENTO_API_KEY'),
        ],
        (error: any, sessionId: string) => {
          if (error) {
            return reject(error)
          }
          this.sessionId = sessionId
          resolve(sessionId)
        },
      )
    })
  }

  private methodCall(method: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.rpcClient.methodCall(method, params, (error: any, result: any) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }

  async call(method: MAGENTO_RPC_METHOD, args?: any): Promise<any> {
    try {
      const sessionId = await this.ensureSession()
      const result = await this.methodCall('call', [sessionId, method, args])
      return result
    } catch (error) {
      if (this.isSessionExpired(error)) {
        await this.refreshSession()
        return this.call(method, args) // Retry the call
      }
      throw error // If it's not session-related, rethrow the error
    }
  }

  async multiCall(
    calls: Array<{ method: MAGENTO_RPC_METHOD; args?: any }>,
  ): Promise<any[]> {
    try {
      const sessionId = await this.ensureSession()
      const formattedCalls = calls.map((call) => [
        call.method,
        [sessionId, ...(call.args || [])],
      ])
      return await this.methodCall('multiCall', [sessionId, formattedCalls])
    } catch (error) {
      if (this.isSessionExpired(error)) {
        await this.refreshSession()
        return this.multiCall(calls) // Retry the call
      }
      throw error
    }
  }

  private async ensureSession(): Promise<string> {
    if (!this.sessionId) {
      const sessionId = await this.login()
      if (!sessionId) {
        throw new RPCUnavailableException(
          'Failed to establish a session with the RPC server',
        )
      }

      return sessionId
    }

    return this.sessionId
  }

  private async refreshSession() {
    this.sessionId = null // Invalidate the current session
    await this.login() // Re-login to get a new session
  }

  private isSessionExpired(error: any): boolean {
    // Check for specific error messages or codes indicating session expiration
    return error?.message?.includes('Session expired') || error?.code === '401'
  }

  async endSession() {
    if (this.sessionId) {
      await this.methodCall('endSession', [this.sessionId])
      this.sessionId = null
    }
  }

  async onModuleDestroy() {
    // End session when the module is destroyed
    await this.endSession()
  }

  async makeApiCall<T>(opts: AxiosRequestConfig) {
    const apiResponse = await this.httpClient.request<T>({
      ...opts,
      baseURL: this.appConfigService.getOrThrow('MAGENTO_API_URL'),
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        ...(opts.headers || {}),
      },
    })

    return apiResponse.data
  }
}
