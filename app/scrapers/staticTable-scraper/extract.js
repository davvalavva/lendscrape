const cheerio = require('cheerio')
const parseNum = require('../../lib/parse-number')

module.exports = ({ html, hdSelector, trSelector }) => {
  const $ = cheerio.load(html)
  const elementContent = el => $(el).text()
  const toStringsArray = nodes => nodes.toArray().map(elementContent)
  const labels = toStringsArray($(hdSelector))
  const rowsStr = $(trSelector).toArray().map(trArr => toStringsArray($(trArr).children('td')))

  // strings to numbers
  const rows = rowsStr.map(row => row.map(strVal => parseNum(strVal)))

  return { labels, rows }
}
