import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'IsEmailOrMobile', async: false })
export class IsEmailOrMobileConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    // Check if the value is a valid email or mobile phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    const isMobile = /^\+?[1-9]\d{1,14}$/.test(value) // Adjust regex for your mobile format
    return isEmail || isMobile
  }

  defaultMessage() {
    return 'Login ID must be a valid email address or mobile number'
  }
}
