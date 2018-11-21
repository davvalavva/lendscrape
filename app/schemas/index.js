// const creditor = require('./creditor.json')
const taskSchemas = require('./task-schemas/')
const bsonDocSchemas = require('./bson-document-schemas/')

/** ***************** TO BE REPLACED ******************* */
const creditor = require('./deprecated/creditor.js')

module.exports = {
  creditor,
  staticTable: taskSchemas.staticTable,
  paydayVariant1: bsonDocSchemas.paydayVariant1
}
