const rp = require('request-promise')
const paydaySimple1 = require('../schema/payday-simple-1.json')

const schemas = {
  'payday-simple-1': paydaySimple1
}

const TABLE_SCRAPER = 'table-scraper'

module.exports = async (task) => {
  const options = {}

  if (task.scraperName === TABLE_SCRAPER) {
    options.labelMap = task.labelMap
    options.fieldInject = task.fieldInject
    options.hdSelector = task.hdSelector
    options.tdSelector = task.tdSelector
  }
  if (task.payload === 'html') {
    options.html = await rp({ uri: task.targetURL })
  }
  switch (task.schema) {
    case 'payday-simple-1.json':
      options.schema = schemas['payday-simple-1']
      break
    default:
      throw new Error('Invalid schema for task')
  }

  return options
}
