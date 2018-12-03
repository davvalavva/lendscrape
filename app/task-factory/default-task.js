/** @module task-factory/default-task */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name        Required    Description
 * ================================================================================================================================================
 * @param         {object}    creditor      yes       @todo write a description
 *
 *
 * @return {object} @todo write a description
 */
/* eslint-enable max-len */

const assert = require('assert')
const VError = require('verror')
const requestPromiseNative = require('request-promise-native')
const type = require('type-name')
const { INVALID_ARG_ERR } = require('../errors').errors.names

module.exports = function defaultTaskFactory(creditor) {
  try {
    assert.strictEqual(type(creditor), 'Object', `argument must be an object`)
  } catch (err) {
    const info = { argName: 'creditor', argValue: creditor, argType: type(creditor), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

  const task = {
    attemptNo: 1,
    maxAttempts: creditor.maxAttempts,
    creditor: creditor.name,
    request: requestPromiseNative,
    targetURL: creditor.targetURL,
    documentSchemaId: creditor.documentSchemaId
  }

  return task
}
