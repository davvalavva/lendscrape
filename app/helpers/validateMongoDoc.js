const { ValidationError } = require('./customErrors')

module.exports = (mongoDocs, schema) => {
  if (mongoDocs == null || schema == null) {
    throw new ReferenceError('undefined or null not allowed as arguments')
  }
  if ((mongoDocs instanceof Array) === false) {
    throw new TypeError('Invalid type for first argument')
  }
  if (schema.constructor !== Object) {
    throw new TypeError('Invalid type for second argument')
  }
  const mandatoryKeys = Object.keys(schema)
    .map(keyStr => ({ name: keyStr, ...schema[keyStr] }))
    .filter(obj => obj.mandatory)

  mongoDocs.forEach((doc) => {
    mandatoryKeys.forEach((obj) => {
      if (doc[obj.name] == null) {
        throw new ValidationError(`Mandatory key "${obj.name}" is missing in document object`)
      }
    })
  })
  return true
}
