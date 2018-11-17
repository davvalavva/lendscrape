const taskSchema = require('./task-schema.js')
const documentSchema = require('./document-schema.js')

module.exports = {
  'static-table': taskSchema['static-table'],
  'payday-simple-1': documentSchema['payday-simple-1']
}
