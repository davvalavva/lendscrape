const rp = require('request-promise')

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

  return options
}
