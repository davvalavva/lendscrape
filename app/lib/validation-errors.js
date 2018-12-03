/** @module lib/validation-errors */

/* eslint-disable max-len */
/**
 * @function
 * This function validates data (that can be represented as JSON) against a JSON schema using the specification found
 * at http://json-schema.org (draft-07).
 *
 * PARAMETERS     Type      Name            Required    Description
 * =====================================================================================================================================================
 * @param         {object}  <unavailable>     yes       An object with a reference to schema to be used and the subject of the validation.
 *                   ▼
 *                   ▼
 *                   ▼      Type      Name        Required    Description
 *                ============================================================================================================================
 *                @property {string}  $id           yes       The schema URI defined in the schemas $id property.
 *                @property {any}     subject       yes       The subject of the validation. Any value that can be transformed to valid JSON.
 *
 *
 * @return {null|object}    Returns null if no validation errors found, otherwise an object with details about the error.
 */
/* eslint-enable max-len */

const Ajv = require('ajv')
const assert = require('assert')
const type = require('type-name')
const VError = require('verror')
const schemas = require('../schemas')
const { INVALID_ARG_ERR, URI_ERR } = require('../config/errors').errors.names

const options = {
  allErrors: true,
  format: 'full',
  // load all schemas so that they can be referenced through their $id uri
  schemas: schemas.all,
  extendRefs: 'fail'
  /* , logger: myCustomLoggerFunction */
}

const ajv = new Ajv(options)


const validationErrors = (cfg) => {
  try {
    assert.strictEqual(type(cfg), 'Object', `argument must be an object`)
    assert.strictEqual(type(cfg.$id), 'string', `property '$id' must be a string`)
  } catch (err) {
    const info = { argName: 'cfg', argValue: cfg, argType: type(cfg), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

  const { $id, subject } = cfg
  const validate = ajv.getSchema($id)
  try {
    assert.strictEqual(type(validate), 'function', `given schema uri in property '$id' doesn't resolve into a validate() function`)
  } catch (err) {
    throw new VError({ name: URI_ERR, cause: err, info: { uri: $id } }, `invalid schema uri`)
  }

  const valid = validate(subject)

  const errors = valid
    ? null
    : { schema_$id: $id, errors: validate.errors }

  return errors
}

module.exports = validationErrors
