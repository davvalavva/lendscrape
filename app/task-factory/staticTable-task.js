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

const validationErrors = require('../lib/validation-errors')
const ValidationError = require('../errors/validation-error')
const defaultTaskFactory = require('./default-task.js')
const executor = require('./staticTable-executor')

const schemaId = '/schemas/task-config/staticTable.json#'

module.exports = function staticTableTask(creditor) {
  const task = defaultTaskFactory(creditor)
  const ajvErrors = validationErrors({ $id: schemaId, subject: creditor })

  if (ajvErrors) {
    const err = new ValidationError(`Invalid configuration of task for creditor '${creditor.name}'`)
    err.ajv = ajvErrors
    throw err
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
