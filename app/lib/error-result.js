/** @module lib/error-result */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name    Required    Description
 * ================================================================================================================================================
 * @param         {object}    task      yes       @todo write a description
 * @param         {error}     err       yes       @todo write a description
 *
 *
 * @return {object|null} @todo write a description
 */
/* eslint-enable max-len */

const assert = require('assert')
const VError = require('verror')
const type = require('type-name')
const { defaultMaxAttempts } = require('../config/runtime.json')
const { INVALID_ARG_ERR } = require('../config/errors').errors.names

module.exports = (task, err) => {
  try {
    assert.strictEqual(type(task), 'Object', `first argument must be an object`)
  } catch (e) {
    const info = { argName: 'task', argValue: task, argType: type(task), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: e, info }, `invalid argument`)
  }
  try {
    assert.ok(err instanceof Error, `second argument must be an instance of Error`)
  } catch (e) {
    const info = { argName: 'err', argValue: err, argType: type(err), argPos: 1 }
    throw new VError({ name: INVALID_ARG_ERR, cause: e, info }, `invalid argument`)
  }

  const { isInteger: isInt, parseInt } = Number
  const { response } = err
  const maxAttempts = task.maxAttempts || defaultMaxAttempts
  const code = response && isInt(response.statusCode) && parseInt(response.statusCode, 10)
  const noRetry = [400, 401, 403, 404, 405, 410, 412, 429]
  let result

  if (err.ajv) {
    result = { error: { jsonValidationError: err.ajv } }
  }

  if (noRetry.indexOf(code) !== -1 || task.attemptNo >= maxAttempts) {
    result = result || { error: {} }
    if (response) {
      result.response = response
      delete result.response.body
    }
    if (isInt(code)) {
      result.error.statusCode = code
    }
    result.error.attemptsMade = task.attemptNo
  }

  return result || null
}
