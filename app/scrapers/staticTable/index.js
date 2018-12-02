/** @module scrapers/staticTable */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type      Name    Required  Default   Description
 * ================================================================================================================================================
 * @param         {object}  task      yes       {}      @todo write a description
 *                   ▼
 *                   ▼
 *                   ▼        Type        Name        Required  Description
 *                =======================================================================================================================
 *                @property   {function}  request       yes     @todo write a description
 *                @property   {string}    targetURL     yes     @todo write a description
 *                @property   {string}    hdSelector    yes     @todo write a description
 *                @property   {string}    trSelector    yes     @todo write a description
 *
 *
 * @return {object} @todo write a description
 */
/* eslint-enable max-len */

const assert = require('assert')
const type = require('type-name')
const VError = require('verror')
const extract = require('./extract')
const { debugMode } = require('../../config/runtime.json')
const { statusCodes } = require('../../errors').errors
const { INVALID_ARG_ERR, STATUS_CODE_ERR, REQUEST_ERR } = require('../../errors').errors.names

const staticTable = async (task) => {
  try {
    assert.strictEqual(type(task), 'Object', `argument must be an object`)
    assert.strictEqual(type(task.request), 'function', `property 'request' must be a function`)
    assert.strictEqual(type(task.targetURL), 'string', `property 'targetURL' must be a string`)
    assert.strictEqual(type(task.hdSelector), 'string', `property 'hdSelector' must be a string`)
    assert.strictEqual(type(task.trSelector), 'string', `property 'trSelector' must be a string`)
  } catch (err) {
    const info = { argName: 'task', argValue: task, argType: type(task), argPos: 0 } // eslint-disable-line
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

  const {
    request,
    targetURL: uri,
    hdSelector,
    trSelector
  } = task
  let response
  let html
  let url

  const urlObj = new URL(uri)

  try {
    const { hostname: remoteHostname, port: remotePort } = urlObj
    url = urlObj.href
    request.debug = debugMode === 1
    response = await request({ uri, simple: false, resolveWithFullResponse: true })
    html = response.body
    const { statusCode } = response

    if (statusCode < 200 || statusCode > 299) {
      const message = statusCodes[statusCode] ? statusCodes[statusCode].message : '[message unavailable]'
      throw new VError({
        name: STATUS_CODE_ERR,
        info: { remoteHostname, remotePort, statusCode, response } // eslint-disable-line
      }, 'HTTP %d - %s', statusCode, message)
    }
  } catch (err) {
    if (err.name === STATUS_CODE_ERR) throw err

    throw new VError({ name: REQUEST_ERR, cause: err, info: { url } }, `request failed`)
  }

  const { labels, rows } = extract({ html, hdSelector, trSelector })

  delete response.body
  return { labels, rows, response }
}

module.exports = staticTable
