const { staticTable: scraper } = require('../scrapers')
const toDocuments = require('../lib/to-documents')
const labelsChanged = require('../lib/labels-changed')
const ValidationError = require('../errors/validation-error')
const validationErrors = require('../lib/validation-errors')

module.exports = async ({ task, creditor }) => {
  const { labels, rows, response } = await scraper(task)
  const { labelMap, fieldInject } = creditor

  // headers changed on webpage?
  if (labelsChanged({ labels, labelMap })) {
    throw new ValidationError(`Couldn't map all headers given to a corresponding field using map found in 'labelMap' property.`)
  }

  // array of arrays becomes array of objects (bson documents)
  const docsPartial = toDocuments({ rows, labelMap })

  // merge manual (not parsed) fields into every document
  const documents = docsPartial.map(document => ({ ...document, ...fieldInject }))

  for (const document of documents) {
    const ajvErrors = validationErrors({ $id: task.documentSchemaId, subject: document })
    if (ajvErrors) {
      const err = new ValidationError(`Invalid document`)
      err.ajv = ajvErrors
      throw err
    }
  }

  return { documents, response }
}
