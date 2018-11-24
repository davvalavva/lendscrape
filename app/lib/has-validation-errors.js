const Ajv = require('ajv')
const typeName = require('type-name')
const schemas = require('../schemas/')

const options = {
  allErrors: true,
  format: 'full',
  schemas: schemas.all
  /* , logger: myCustomLoggerFunction */
}

const ajv = new Ajv(options)


module.exports = (s, subject) => {
  let schema
  let schemaName = 'unavailable'

  if (typeName(s) === 'string') {
    schema = schemas[s]
    schemaName = s
  //
  } else if (typeName(s) === 'Object') {
    schema = s
  //
  } else {
    throw new TypeError(`Expected a string or an object as first argument, found type '${typeName(s)}'`)
  }

  const validate = ajv.compile(schema)
  const valid = validate(subject)
  const errors = valid
    ? null
    : { schema: schemaName, errors: validate.errors }

  return errors
}
