const requestPromiseNative = require('request-promise-native')
const typeName = require('type-name')

module.exports = function defaultTaskFactory(creditor) {
  if (typeName(creditor) !== 'Object') {
    throw new TypeError(`Expected an object as argument, found type '${typeName(creditor)}'`)
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
