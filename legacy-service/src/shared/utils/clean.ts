import _ from 'lodash'

function cleanDeep(obj: any): any {
  return _.transform(obj, (result, value, key) => {
    if (_.isObject(value)) {
      // Recursively clean objects and arrays
      const cleaned = cleanDeep(value)
      if (!_.isEmpty(cleaned)) {
        result[key] = cleaned
      }
    } else if (!_.isNil(value) && value !== '') {
      // Include non-null, non-undefined, non-empty-string values
      result[key] = value
    }
  })
}

export { cleanDeep }
