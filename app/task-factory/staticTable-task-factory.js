const validationErrors = require('../lib/validation-errors')
const ValidationError = require('../errors/validation-error')
const defaultTaskFactory = require('./default-task-factory.js')
const executer = require('./staticTable-task-executor')

const schemaId = '/schemas/task-config/staticTable.json#'

module.exports = function staticTableTaskFactory(creditor) {
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
      return executer({ task: this, creditor })
    }
  }
}
