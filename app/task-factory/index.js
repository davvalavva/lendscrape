/** @module task-factory/ */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name        Required    Description
 * ================================================================================================================================================
 * @param         {object[]}  creditors     yes       @todo write a description
 *
 *
 * @return {object[]} @todo write a description
 */
/* eslint-enable max-len */

const VError = require('verror')
const assert = require('assert')
const type = require('type-name')
const staticTableTaskFactory = require('./staticTable-task')
const { NOT_IMPL_ERR, INVALID_ARG_ERR } = require('../config/errors').errors.names

module.exports = function taskFactory(creditors) {
  try {
    assert.strictEqual(type(creditors), 'Array', `argument must be an array`)
  } catch (err) {
    const info = { argName: 'creditors', argValue: creditors, argType: type(creditors), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }
  return creditors
    .map((creditor) => {
      switch (creditor.task) {
        case 'staticTable': return staticTableTaskFactory(creditor)
        default: throw new VError({ name: NOT_IMPL_ERR }, `Task '${creditor.task}' not implemented!`)
      }
    })
}
