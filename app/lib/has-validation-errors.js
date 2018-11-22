const Ajv = require('ajv')
const typeName = require('type-name')
const schemas = require('../schemas/')

const ajv = new Ajv({ allErrors: true })

module.exports = (schemaOpt, subject) => {
  let schema
  let schemaName = 'unavailable'

  if (typeName(schemaOpt) === 'string') {
    schema = schemas[schemaOpt]
    schemaName = schemaOpt
  //
  } else if (typeName(schemaOpt) === 'Object') {
    schema = schemaOpt
  //
  } else {
    throw new TypeError(`Expected a string or an object as first argument, found type '${typeName(schemaOpt)}'`)
  }

  const validate = ajv.compile(schema)
  const valid = validate(subject)
  const errors = valid
    ? null
    : { schema: schemaName, errors: validate.errors }

  return errors
}
