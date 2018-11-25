/** @module lib/validation-errors */

/* eslint-disable max-len */
/**
 * @function
 * This function validates data (that can be represented as JSON) against a JSON schema using the specification found
 * at http://json-schema.org (draft-07).
 *
 * PARAMETERS     Type      Name      Required    Description
 * =====================================================================================================================================================
 * @param         {Object}  {}        yes         An object with a reference to schema to be used and the subject of the validation.
 *                   ▼
 *                   ▼
 *                   ▼      Type      Name        Required    Description
 *                ============================================================================================================================
 *                @property {String}  $id         yes         The schema URI defined in the schemas $id property.
 *                @property {any}     subject     yes         The subject of the validation. Any value that can be transformed to valid JSON.
 *
 *
 * @return {null|Object}    Returns null if no validation errors found, otherwise an object with details about the error.
 */
/* eslint-enable max-len */

const Ajv = require('ajv')
const typeName = require('type-name')
const schemas = require('../schemas')

const options = {
  allErrors: true,
  format: 'full',
  // load all schemas so that they can be referenced through their $id uri
  schemas: schemas.all,
  extendRefs: 'fail'
  /* , logger: myCustomLoggerFunction */
}

const ajv = new Ajv(options)


module.exports = ({ $id, subject } = {}) => {
  if (typeName($id) !== 'string') {
    throw new TypeError(`Expected property '$id' to be a string (uri) in object passed, found type '${typeName($id)}'.`)
  }
  const validate = ajv.getSchema($id)
  const valid = validate(subject)
  const errors = valid
    ? null
    : { schema_$id: $id, errors: validate.errors }

  return errors
}
