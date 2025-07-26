import { AppConfigService } from '@/shared/config/config.service'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import { createHash } from 'crypto'
import { PaymentPauyClientException } from '../../payment.error'
import { PayuPaymentApiRequestDto } from './payu.types'

interface IPayuClient {
  getTransactionDetails(
    params: PayuPaymentApiRequestDto,
  ): Promise<PayuPaymentApiRequestDto>
}

@Injectable()
export class PayuClient implements IPayuClient {
  private key: string
  private salt: string
  private host: string

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {
    this.host = this.appConfigService.getOrThrow('PAYU_BIZ_HOST')
    this.key = this.appConfigService.getOrThrow('PAYU_BIZ_MERCHANT_KEY')
    this.salt = this.appConfigService.getOrThrow('PAYU_BIZ_SALT')
  }

  get merchantKey(): string {
    return this.key
  }

  private async _makeCall<T>(opts: AxiosRequestConfig): Promise<T> {
    const axiosRef = this.httpService.axiosRef
    const dataToSend = this._redactParams(opts.data)

    try {
      const res = await axiosRef({
        ...opts,
        data: dataToSend,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return res.data
    } catch (err) {
      console.log(err)
      throw new PaymentPauyClientException()
    }
  }

  private _validateParams(params: Record<string, string>): void {
    const EMAIL_REGEX =
      /^(?=.{6,254}$)[A-Za-z0-9_\-\.]{1,64}\@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,}$/
    const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/

    Object.keys(params).forEach((k) => {
      if (typeof params[k] !== 'string') {
        throw new TypeError(`TypeError: Param "${k}" required of type String`)
      }
    })

    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
    } = params

    if (!EMAIL_REGEX.test(email)) {
      throw new Error('ArgumentError: Invalid Email')
    }
    if (!AMOUNT_REGEX.test(amount)) {
      throw new Error(
        'ArgumentError: amount should contain digits with up to 2 decimal places',
      )
    }
    if (txnid.length > 25) {
      throw new Error('ArgumentError: txnid length should be ≤ 25')
    }
    if (productinfo.length > 100) {
      throw new Error('ArgumentError: productinfo length should be ≤ 100')
    }
    if (firstname.length > 60) {
      throw new Error('ArgumentError: firstname length should be ≤ 60')
    }
    if (email.length > 50) {
      throw new Error('ArgumentError: email length should be ≤ 50')
    }

    for (const udf of [udf1, udf2, udf3, udf4, udf5]) {
      if (udf.length > 255) {
        throw new Error('ArgumentError: udf length should be ≤ 255')
      }
    }
  }

  generateHash(params: Record<string, string>): string {
    this._validateParams(params)

    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
    } = params

    const text = [
      this.key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      '',
      '',
      '',
      '',
      '',
      this.salt,
    ].join('|')

    return createHash('sha512').update(text).digest('hex')
  }

  validateHash(hash: string, params: Record<string, string>): boolean {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
      status,
      additionalCharges = '',
    } = params

    this._validateParams({ ...params, key: this.key, salt: this.salt })

    if (typeof status !== 'string') {
      throw new TypeError('TypeError: Param "status" must be of type string')
    }

    const reverseKeyArray = [
      this.key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      '',
      '',
      '',
      '',
      '',
    ]
      .join('|')
      .split('|')
      .reverse()

    let reverseKeyString = [this.salt, status, ...reverseKeyArray].join('|')
    if (additionalCharges) {
      reverseKeyString = `${additionalCharges}|${reverseKeyString}`
    }

    const calculatedHash = createHash('sha512')
      .update(reverseKeyString)
      .digest('hex')
    return calculatedHash === hash
  }

  private _convertToFormData(data: any): URLSearchParams {
    const formData = new URLSearchParams()
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key]) {
        formData.set(key, data[key])
      }
    }

    return formData
  }

  private _redactParams(
    params: Record<string, string>,
  ): Record<string, string> {
    const { salt, ...rest } = params

    if (salt) {
      delete rest.salt
    }

    const hash = this.generateHash(rest)
    return { ...rest, key: this.key, hash }
  }

  getTransactionDetails(): Promise<PayuPaymentApiRequestDto> {
    return Promise.resolve({} as PayuPaymentApiRequestDto)
  }

  getPaymentFormActionUrl(): string {
    return `${this.host}/_payment`
  }
}
