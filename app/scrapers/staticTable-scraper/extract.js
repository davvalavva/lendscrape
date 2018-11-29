const typeName = require('type-name')
const cheerio = require('cheerio')
const parseNum = require('../../lib/parse-number')

module.exports = (config) => {
  if (typeName(config) !== 'Object') throw new TypeError(`Argument must be an object, found type '${typeName(config)}'`)
  if (typeName(config.html) !== 'string') throw new TypeError(`Property 'html' of argument must be a string, found type '${typeName(config.html)}'`)
  if (typeName(config.hdSelector) !== 'string') throw new TypeError(`Property 'hdSelector' of argument must be a string, found type '${typeName(config.hdSelector)}'`)
  if (typeName(config.trSelector) !== 'string') throw new TypeError(`Property 'trSelector' of argument must be a string, found type '${typeName(config.trSelector)}'`)

  const { html, hdSelector, trSelector } = config
  const $ = cheerio.load(html)
  const elementContent = el => $(el).text().trim()
  const toStringsArray = nodes => nodes.toArray().map(elementContent)
  const labels = toStringsArray($(hdSelector))
  const rowsStr = $(trSelector).toArray().map(trArr => toStringsArray($(trArr).children('td')))

  // strings to numbers
  const rows = rowsStr.map(row => row.map(strVal => parseNum(strVal)))

  return { labels, rows }
}
