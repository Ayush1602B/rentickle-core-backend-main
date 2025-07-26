export enum QUERY_FILTER_TYPE {
  string = 'string',
  list_of_strings = 'list_of_strings',
  list_of_numbers = 'list_of_numbers',
  regex = 'regex',
  date = 'date',
  date_range = 'date_range',
  date_time = 'date_time',
  date_time_range = 'date_time_range',
  number = 'number',
  numeric_range = 'numeric_range',
  boolean = 'boolean',
}

export enum QUERY_SORT_TYPE {
  desc = 'desc',
  asc = 'asc',
}

export type QueryPagination = {
  limit?: number
  page?: number
  lastId?: string
}

export type QueryNumRange = { min: number; max: number }
export type QueryDateRange = { start: string; end: string }

export type QueryFilterType =
  | string
  | string[]
  | number
  | number[]
  | RegExp
  | QueryNumRange
  | QueryDateRange
  | boolean

export type QueryParsedFilter = Record<string, QueryFilterType>
export type QueryParsedSort = Record<string, QUERY_SORT_TYPE>
export type QueryParsedPagination = Required<
  Pick<QueryPagination, 'limit' | 'page'>
> &
  Pick<QueryPagination, 'lastId'>

export type ParsedQuery<DefinedQueryFilter = QueryParsedFilter> = {
  filters: DefinedQueryFilter
  sorts: QueryParsedSort
  pagination: QueryParsedPagination
}

const DEFAULT_PAGE_SIZE = 50
const DEFAULT_PAGE_NUMBER = 1
const MAX_PAGE_SIZE = 100
const MAX_RECORD_FETCH = 1000

export const DEFAULT_PAGINATION: Required<
  Pick<QueryPagination, 'page' | 'limit'>
> = {
  page: DEFAULT_PAGE_NUMBER,
  limit: DEFAULT_PAGE_SIZE,
}

/**
 * Parse query filter value string to a valid QUERY_FILTER_TYPE
 * @param value
 * @returns QUERY_FILTER_TYPE
 */
const getFilterType = (value: string) => {
  const regexCheck = /^\/.*\/$/
  const dateCheck = /^\d{4}-\d{2}-\d{2}$/
  const dateTimeCheckWithTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{3}Z$/
  const dateTimeCheckWithoutTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
  const numberCheck = /^-?\d*\.?\d+$/
  const numericRangeCheck = /^\d+-\d+$/
  const dateRangeCheck = /^\d{4}-\d{2}-\d{2}-\d{4}-\d{2}-\d{2}$/
  const dateTimeRangeCheckWithTimezone =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z-\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/gm
  const dateTimeRangeCheckWithoutTimezone =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/gm
  const booleanCheck = /^(true|false)$/
  const listOfNumberCheck = /^\d+(?:\|\d+$)*/

  if (regexCheck.test(value)) {
    return QUERY_FILTER_TYPE.regex
  }
  if (dateCheck.test(value)) {
    return QUERY_FILTER_TYPE.date
  }
  if (
    dateTimeCheckWithTimezone.test(value) ||
    dateTimeCheckWithoutTimezone.test(value)
  ) {
    return QUERY_FILTER_TYPE.date_time
  }
  if (numberCheck.test(value)) {
    return QUERY_FILTER_TYPE.number
  }
  if (numericRangeCheck.test(value)) {
    return QUERY_FILTER_TYPE.numeric_range
  }
  if (dateRangeCheck.test(value)) {
    return QUERY_FILTER_TYPE.date_range
  }
  if (
    dateTimeRangeCheckWithTimezone.test(value) ||
    dateTimeRangeCheckWithoutTimezone.test(value)
  ) {
    return QUERY_FILTER_TYPE.date_time_range
  }
  if (booleanCheck.test(value)) {
    return QUERY_FILTER_TYPE.boolean
  }
  if (value.indexOf('|') !== -1 && /^.*|.*/.test(value)) {
    if (listOfNumberCheck.test(value)) {
      return QUERY_FILTER_TYPE.list_of_numbers
    }
    return QUERY_FILTER_TYPE.list_of_strings
  }

  return QUERY_FILTER_TYPE.string
}

/**
 * parse the passed filters string into object
 * @param filters
 * @returns
 */
const parseFilters = (filterQueryString: string): QueryParsedFilter => {
  const parsedFilters: QueryParsedFilter = {}
  const filterSegments = filterQueryString.split(',')
  let start: string
  let end: string

  for (const segment of filterSegments) {
    const key = segment.substring(0, segment.indexOf(':'))
    const value = segment.substring(segment.indexOf(':') + 1)

    if (!key || !value) {
      continue
    }

    const filterType = getFilterType(value)
    switch (filterType) {
      case QUERY_FILTER_TYPE.string:
      case QUERY_FILTER_TYPE.regex:
        parsedFilters[key] = value
        break
      case QUERY_FILTER_TYPE.boolean:
        parsedFilters[key] = value === 'true'
        break
      case QUERY_FILTER_TYPE.list_of_strings:
        parsedFilters[key] = value.split('|')
        break
      case QUERY_FILTER_TYPE.list_of_numbers:
        parsedFilters[key] = value.split('|').map(Number)
        break
      case QUERY_FILTER_TYPE.number:
        parsedFilters[key] = Number(value)
        break
      case QUERY_FILTER_TYPE.numeric_range:
        const [min, max] = value.split('-').map(Number)
        parsedFilters[key] = { min, max }
        break
      case QUERY_FILTER_TYPE.date:
        parsedFilters[key] = new Date(value).toISOString().split('T')[0]
        break
      case QUERY_FILTER_TYPE.date_time:
        parsedFilters[key] = new Date(value).toISOString()
        break
      case QUERY_FILTER_TYPE.date_range:
        start = value.substring(0, 10)
        end = value.substring(10 + 1)
        parsedFilters[key] = { start, end }
        break
      case QUERY_FILTER_TYPE.date_time_range:
        start = value.substring(
          0,

          10 * 2 + 4,
        )
        end = value.substring(10 * 2 + 4 + 1)
        parsedFilters[key] = { start, end }
        break
      default:
        parsedFilters[key] = value
    }
  }

  return parsedFilters
}

/**
 * parse sorts
 * @param sorts
 * @returns
 */
const parseSorts = (sorts: string): QueryParsedSort => {
  const sortObject: QueryParsedSort = {}
  if (!sorts) {
    return sortObject
  }

  sorts.split(',').forEach((sort) => {
    const [key, value] = sort.split(':')

    if (
      key &&
      Object.values(QUERY_SORT_TYPE).includes(
        QUERY_SORT_TYPE[value as QUERY_SORT_TYPE],
      )
    ) {
      sortObject[key] = QUERY_SORT_TYPE[value as QUERY_SORT_TYPE]
    }
  })

  return sortObject
}

/**
 * parse pagination
 * @param params
 * @returns
 */
const parsePagination = (params: URLSearchParams): QueryParsedPagination => {
  const queryPage = Number(params.get('page'))
  const queryLimit = Number(params.get('limit'))

  const pagination: QueryParsedPagination = {
    limit: queryLimit,
    page: queryPage,
  }

  const lastId = params.get('lastId')
  if (!isNaN(queryLimit) && queryLimit > 0) {
    pagination.limit = queryLimit
  } else {
    pagination.limit = DEFAULT_PAGE_SIZE
  }

  if (lastId) {
    pagination.lastId = lastId
  } else if (!isNaN(queryPage) && queryPage > 0) {
    pagination.page = queryPage
  } else {
    pagination.page = DEFAULT_PAGE_NUMBER
  }

  const { limit, page } = pagination
  if (limit && page) {
    if (limit > MAX_PAGE_SIZE) {
      pagination.limit = MAX_PAGE_SIZE
    }

    if ((page - 1) * DEFAULT_PAGE_SIZE + limit > MAX_RECORD_FETCH) {
      pagination.limit = DEFAULT_PAGE_SIZE
      pagination.page = DEFAULT_PAGE_NUMBER
    }
  }

  return pagination
}

/**
 * parse given query string
 * @param queryString
 * @returns
 */

export const parseQueryString = (queryString: string): ParsedQuery => {
  const params = new URLSearchParams(decodeURIComponent(queryString))

  const filters = parseFilters(params.get('filters') || '')
  const sorts = parseSorts(params.get('sorts') || '')
  const pagination = parsePagination(params)

  return { filters, sorts, pagination }
}
