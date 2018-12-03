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
const assert = require('assert')
const VError = require('verror')
const { staticTable } = require('../scrapers')
const toDocuments = require('../lib/to-documents')
const labelsChanged = require('../lib/labels-changed')
const realValidationErrors = require('../lib/validation-errors')
const { INVALID_ARG_ERR, MAP_ERR, VALIDATION_ERR, TRANSFORM_DATA_ERR } = require('../config/errors').errors.names

module.exports = async (cfg) => {
  try {
    assert.strictEqual(type(cfg), 'Object', `argument must be an object`)
    assert.strictEqual(type(cfg.task), 'Object', `property 'task' must be an object`)
    assert.strictEqual(type(cfg.creditor), 'Object', `property 'creditor' must be an object`)
  } catch (err) {
    const info = { argName: 'cfg', argValue: cfg, argType: type(cfg), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

  const {
    task,
    // the 'scraper'- and 'validationErrors' properties that are injected
    // into task is only meant for enabling the use of stubs in the tests file
    task: { documentSchemaId: $id, scraper = staticTable, validationErrors = realValidationErrors }
  } = cfg
  const { creditor: { labelMap, fieldInject } } = cfg
  const { labels, rows, response } = await scraper(task)

  if (labelsChanged({ labels, labelMap })) {
    const expected = labelMap.map(obj => obj.label)
    throw new VError({ name: MAP_ERR, info: { scraped: labels, expected } }, `failed mapping scraped labels to expected labels`)
  }

  let documents
  try {
    documents = toDocuments({ rows, labelMap, fieldInject })
  } catch (err) {
    throw new VError({ name: TRANSFORM_DATA_ERR, info: { rows, labelMap, fieldInject } }, `failed transforming scraped data to BSON documents`)
  }

  for (const document of documents) {
    const ajvErrors = validationErrors({ $id, subject: document })

    if (ajvErrors) throw new VError({ name: VALIDATION_ERR, info: { ajvErrors, document, $id } }, `invalid document object`)
  }

  return { documents, response }
}
