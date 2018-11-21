const Ajv = require('ajv')
const schemas = require('./index')

const ajv = new Ajv({ allErrors: true })

module.exports = (schemaName, subject) => {
  const validate = ajv.compile(schemas[schemaName])
  const valid = validate(subject)
  const errors = valid
    ? null
    : {
      schema: schemaName,
      errors: validate.errors
    }
  return errors
}
