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

const requestPromiseNative = require('request-promise-native')
const typeName = require('type-name')

module.exports = function defaultTaskFactory(creditor) {
  if (typeName(creditor) !== 'Object') throw new TypeError(`Expected an object as argument, found type '${typeName(creditor)}'`)

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
