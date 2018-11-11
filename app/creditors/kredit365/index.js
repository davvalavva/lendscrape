const tableScraper = require('../../libs/table-scraper')
const labelMap = require('./label-map.json')
const fieldInject = require('./field-inject.json')

const hdSelector = '.content > article > table > thead > tr > th'
const tdSelector = '.content > article > table > tbody > tr'
const PARSE_TARGET_URL = 'http://localhost:3000'
const options = {
  targetURL: PARSE_TARGET_URL,
  hdSelector,
  tdSelector,
  labelMap,
  fieldInject
};

(async () => {
  try {
    const documents = await tableScraper(options)

    console.log(JSON.stringify(documents, null, 2))
  } catch (err) {
    throw err
  }
})()
