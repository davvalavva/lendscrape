/** @module task-factory/staticTable-executor */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name        Required    Description
 * ================================================================================================================================================
 * @param         {object}    cfg           yes       @todo write a description
 *
 *
 * @return {object} @todo write a description
 */
/* eslint-enable max-len */

const type = require('type-name')
const { staticTable } = require('../scrapers')
const toDocuments = require('../lib/to-documents')
const labelsChanged = require('../lib/labels-changed')
const ValidationError = require('../errors/validation-error')
const realValidationErrors = require('../lib/validation-errors')

module.exports = async (cfg) => {
  if (type(cfg) !== 'Object') throw new TypeError(`Expected an object as argument, found type '${type(cfg)}'`)
  if (type(cfg.task) !== 'Object') throw new TypeError(`Expected property 'task' in argument to be an object, found type '${type(cfg.task)}'`)
  if (type(cfg.creditor) !== 'Object') throw new TypeError(`Expected property 'creditor' in argument to be an object, found type '${type(cfg.creditor)}'`)

  const {
    task,
    // the 'scraper'- and 'validationError' properties that are injected
    // into task is only meant for enabling the use of stubs in the tests file
    task: { documentSchemaId: $id, scraper = staticTable, validationErrors = realValidationErrors }
  } = cfg
  const { creditor: { labelMap, fieldInject } } = cfg
  const { labels, rows, response } = await scraper(task)

  // headers changed on webpage?
  if (labelsChanged({ labels, labelMap })) throw new ValidationError(`Couldn't map headers given to doc. fields using 'labelMap' property.`)

  const documents = toDocuments({ rows, labelMap, fieldInject })

  for (const document of documents) {
    const ajvErrors = validationErrors({ $id, subject: document })
    if (ajvErrors) {
      const err = new ValidationError(`Invalid document`)
      err.ajv = ajvErrors
      throw err
    }
  }

  return { documents, response }
}
