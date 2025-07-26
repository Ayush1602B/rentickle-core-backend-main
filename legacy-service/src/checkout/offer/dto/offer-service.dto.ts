import { ParsedQuery } from '@/shared/utils/query-parser.util'

type OfferListFilters = {
  [key: string]: string
}

export type GetOfferListDto = ParsedQuery<OfferListFilters>
