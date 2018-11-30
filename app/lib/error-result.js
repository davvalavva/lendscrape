const typeName = require('type-name')
const { defaultMaxAttempts } = require('../config/runtime.json')

module.exports = (task, err) => {
  if (typeName(task) !== 'Object') {
    throw TypeError(`Expected first argument to be an object, found type ${typeName(task)}`)
  }
  if (!(err instanceof Error)) {
    throw TypeError(`Expected second argument to be an instance of Error, found type ${typeName(err)}. instanceof err === ${typeof err}`)
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
