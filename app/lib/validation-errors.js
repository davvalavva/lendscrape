const Ajv = require('ajv')
const typeName = require('type-name')
const schemas = require('../schemas')

const options = {
  allErrors: true,
  format: 'full',
  schemas: schemas.all,
  extendRefs: 'fail'
  /* , logger: myCustomLoggerFunction */
}

const ajv = new Ajv(options)


module.exports = ({ $id, subject }) => {
  if (typeName($id) !== 'string') {
    throw new TypeError(`Expected property '$id' to be a string in config object, found type '${typeName($id)}'.`)
  }
  const validate = ajv.getSchema($id)
  const valid = validate(subject)
  const errors = valid
    ? null
    : { schema_$id: $id, errors: validate.errors }

  return errors
}
