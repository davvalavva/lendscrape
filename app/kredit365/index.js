const parseNum = require('parse-num')
const { newPage, closeBrowser, TimeoutError } = require('../helpers/browserManager')
const toMongoDoc = require('../helpers/toMongoDoc')
const validateMongoDoc = require('../helpers/validateMongoDoc')
const mappings = require('./mappings.json')
const schema = require('../schemas/type-1.json')

try {
  const scrape = async () => {
    const page = await newPage()
    await page.goto('https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n',
      { waitUntil: 'networkidle2', timeout: 20000 })
    await page.waitForSelector('.content > article > table')

    // extrahera tabellrubrikerna till strängar i en array
    const headers = await page.evaluate(() => {
      const thNodeList = document.querySelectorAll('.content > article > table > thead > tr > th')
      const thNodes = Array.from(thNodeList)
      return thNodes.map(element => element.innerText)
    })

    // Försäkra oss om att inte tabellrubriker förändrats
    const clean = str => str.trim().toLowerCase()
    if (!headers.every(
      (element, i) => clean(element) === clean(mappings.keys.scraped[i].scrapedKey)
    )) {
      throw new Error('Unexpected header(s)')
    }

    // extrahera värdena (som strängar) i tabellraderna till en array (tvådimensionell)
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

    // Omvandla tabelldata från strängar till nummer
    const data = rows.map(row => row.map(strVal => parseNum(strVal)))
    console.log(JSON.stringify(data, null, 2))

    // Stänga ned headless browser
    await closeBrowser()

    // Transformera datan till "rätt" struktur för databaslagring
    return toMongoDoc(data, mappings)
  }

  scrape().then((data) => {
    validateMongoDoc(data, schema)
    console.log(JSON.stringify(data, null, 2))
    // TODO: Serialize and store data
  })
} catch (error) {
  if (error instanceof TimeoutError) {
    throw error
  } else {
    throw error
  }
}
