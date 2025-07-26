import { AppConfigService } from '@/shared/config/config.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CatalogHelper {
  constructor(private readonly appConfigService: AppConfigService) {}

  formatProductImageUrl(imageUrl: string): string {
    const baseMediaUrl = this.appConfigService.getOrThrow('MEDIA_BASE_URL')

    if (!imageUrl) {
      return ''
    }
    // Ensure the URL starts with 'http' or 'https'
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // If the URL is relative, prepend the base media URL
    return `${baseMediaUrl}/media/catalog/product${imageUrl}`
  }

  formatImageUrl(imageUrl: string): string {
    const baseMediaUrl = this.appConfigService.getOrThrow('MEDIA_BASE_URL')

    if (!imageUrl) {
      return ''
    }
    // Ensure the URL starts with 'http' or 'https'
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // If the URL is relative, prepend the base media URL
    return `${baseMediaUrl}/media/${imageUrl}`
  }

  formatCategoryImageUrl(imageUrl: string): string {
    const baseMediaUrl = this.appConfigService.getOrThrow('MEDIA_BASE_URL')

    if (!imageUrl) {
      return ''
    }
    // Ensure the URL starts with 'http' or 'https'
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // If the URL is relative, prepend the base media URL
    return `${baseMediaUrl}/media/catalog/category/${imageUrl}`
  }
}
