const hasValidationErrors = require('../../lib/has-validation-errors')
const ValidationError = require('../../errors/validation-error')
const { staticTable: scraper } = require('../../scrapers')
const defaultTaskFactory = require('./default-task-factory.js')

module.exports = function staticTableTaskFactory(schema, creditor) {
  const task = defaultTaskFactory(creditor)
  const ajvErrors = hasValidationErrors(schema, creditor)
  if (ajvErrors) {
    const err = new ValidationError(`Can't create task because of invalid configuration of task user creditor '${creditor.name}'`)
    err.ajv = ajvErrors
    throw err
  }
  return {
    ...task,
    scraper,
    hdSelector: creditor.hdSelector,
    trSelector: creditor.trSelector,
    labelMap: creditor.labelMap,
    fieldInject: creditor.fieldInject,
    async execute() { return this.scraper(this) }
  }
}
