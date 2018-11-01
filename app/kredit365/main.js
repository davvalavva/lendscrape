/**
 * @file Bootstraps web scraping of website kredit365.se
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

const parseNum = require('../helpers/parse-to-number')
const { newPage, closeBrowser, TimeoutError } = require('../helpers/browser-manager')
const transform = require('../helpers/transform-data')
const headersChanged = require('./headers-changed')
const validate = require('../helpers/validate-documents')
const schema = require('../config/schemas.json')['type-1']
const headersKeysMap = require('./headers-keys-map.json')
const manualData = require('./manual-data.json')

const PARSE_TARGET_URL = 'https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n'

module.exports = () => {
  try {
    const scrape = async () => {
      const page = await newPage()
      await page.goto(PARSE_TARGET_URL, { waitUntil: 'networkidle2', timeout: 20000 })
      await page.waitForSelector('.content > article > table')

      // scrape HTML table headers into an array of strings
      const headers = await page.evaluate(() => {
        const thNodeList = document.querySelectorAll('.content > article > table > thead > tr > th')
        const thNodes = Array.from(thNodeList)
        return thNodes.map(element => element.innerText)
      })

      // make sure headers haven't been changed
      if (headersChanged(headers, headersKeysMap)) {
        throw new Error('Unexpected header(s) in page')
      }

      // extract HTML table rows data into an array (becomes array of arrays)
      const rows = await page.evaluate(() => {
        const rowsArr = []
        document.querySelectorAll('.content > article > table > tbody > tr').forEach((trNode, i) => {
          rowsArr[i] = []
          trNode.childNodes.forEach((tdNode) => {
            if (tdNode.nodeType === 1) {
              rowsArr[i].push(tdNode.innerText)
            }
          })
        })
        return rowsArr
      })

      // transform data from strings from numbers
      const data = rows.map(row => row.map(strVal => parseNum(strVal)))
      console.log(JSON.stringify(data, null, 2))

      await closeBrowser()

      // transform data to documents
      return transform(data, headersKeysMap, manualData)
    }

    scrape().then((documents) => {
      validate(documents, schema)
      console.log(JSON.stringify(documents, null, 2))
      // TODO: Serialize and store data
    })
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw error
    } else {
      throw error
    }
  }
}
