/** @module task-factory/staticTable-task */

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

const VError = require('verror')
const validationErrors = require('../lib/validation-errors')
const defaultTaskFactory = require('./default-task.js')
const executor = require('./staticTable-executor')
const { VALIDATION_ERR } = require('../config/errors').errors.names

const $id = '/schemas/task-config/staticTable.json#'

module.exports = function staticTableTask(creditor) {
  const task = defaultTaskFactory(creditor)
  const ajvErrors = validationErrors({ $id, subject: creditor })

  if (ajvErrors) {
    throw new VError({ name: VALIDATION_ERR, info: { ajvErrors, creditor: creditor.name } }, `invalid creditor configuration`)
  }

  return {
    ...task,
    hdSelector: creditor.hdSelector,
    trSelector: creditor.trSelector,
    async execute() {
      return executor({ task: this, creditor })
    }
  }
}
