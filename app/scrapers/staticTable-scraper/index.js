const typeName = require('type-name')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../../helpers/common-debug-tools.js') // eslint-disable-line
const StatusCodeError = require('../../errors/status-code-error')
const extract = require('./extract')

module.exports = async (task) => {
  let labels
  let rows
  let response
  try {
    const { request, targetURL: uri, hdSelector, trSelector } = task || {} // eslint-disable-line

    if (typeName(task) !== 'Object') {
      throw new TypeError(`Argument must be an object, found type '${typeName(task)}'`)
    }

    request.debug = debug === 1
    response = await request({ uri, simple: false, resolveWithFullResponse: true })

    // throw status codes other than 2xx
    if (!(/^2/.test(response.statusCode.toString()))) {
      const err = new StatusCodeError(`A HTTP ${response.statusCode} response was returned from the request`)
      err.response = response
      throw err
    }

    ({ labels, rows } = extract({ html: response.body, hdSelector, trSelector }))
  //
  } catch (e) {
    e.path = filepath(__filename)
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }

  delete response.body
  return { labels, rows, response }
}
