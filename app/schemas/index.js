const creditorSchema = require('./creditor-schema.js')
const taskSchema = require('./task-schema.js')
const documentSchema = require('./document-schema.js')

module.exports = {
  creditor: creditorSchema,
  'static-table': taskSchema['static-table'],
  'payday-simple-1': documentSchema['payday-simple-1']
}
