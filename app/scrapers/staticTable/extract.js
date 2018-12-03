/** @module scrapers/staticTable/extract */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type      Name    Required  Default   Description
 * ================================================================================================================================================
 * @param         {object}  config    yes       {}      @todo write a description
 *                   ▼
 *                   ▼
 *                   ▼        Type        Name        Required  Description
 *                =======================================================================================================================
 *                @property   {string}    html          yes     @todo write a description
 *                @property   {string}    hdSelector    yes     @todo write a description
 *                @property   {string}    trSelector    yes     @todo write a description
 *
 *
 * @return {object} @todo write a description
 */
/* eslint-enable max-len */

const assert = require('assert')
const type = require('type-name')
const VError = require('verror')
const cheerio = require('cheerio')
const parseNum = require('../../lib/parse-number')
const { INVALID_ARG_ERR } = require('../../config/errors').errors.names

const staticTableExtract = (config) => {
  try {
    assert.strictEqual(type(config), 'Object', `argument must be an object`)
    assert.strictEqual(type(config.html), 'string', `property 'html' must be a string`)
    assert.strictEqual(type(config.hdSelector), 'string', `property 'hdSelector' must be a string`)
    assert.strictEqual(type(config.trSelector), 'string', `property 'trSelector' must be a string`)
  } catch (err) {
    const info = { argName: 'config', argValue: config, argType: type(config), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

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

module.exports = staticTableExtract
