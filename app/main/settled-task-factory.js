const { defaultMaxAttempts } = require('../config/runtime.json')

module.exports = (task, err) => {
  const constructor = (err.constructor && err.constructor.name) || null
  const { response = {} } = err
  const maxAttempts = task.maxAttempts || defaultMaxAttempts
  const code = (response && Number.parseInt(response.statusCode, 10)) || 0
  const kasper = err.kasper || null
  const noRetry = [400, 401, 403, 404, 405, 410, 412, 429]
  const success = false

  if ((noRetry.indexOf(code)) !== -1 || task.attemptNo > maxAttempts) {
    return {
      ...task,
      result: {
        success, constructor, kasper, response
      }
    }
  }

  return null
}
