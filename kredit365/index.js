const puppeteer = require('puppeteer')
const { TimeoutError } = require('puppeteer/Errors')
const browserAgents = require('browser-agents')

try {
  const scrape = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setUserAgent(browserAgents.random())
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setCacheEnabled(false)
    await page.setExtraHTTPHeaders({ Referer: 'https://google.com/' })
    await page.goto('https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n')

    const extracted = await page.evaluate(() => {
      const EXPECTED_HEADERS = ['belopp', 'uppl. avg', 'fakt. avg', 'ränta', 'total', 'eff. ränta', 'nom. ränta']
      const headers = Array.from(document.querySelectorAll('.content > article > table > thead > tr > th'))

      // Fånga upp om tabellrubriker förändrats eller bytt ordning och avbryt i så fall med Error
      if (!headers.every((el, i) => el.innerText.trim().toLowerCase() === EXPECTED_HEADERS[i])) {
        throw new Error('Unexpected header(s)')
      }

      // Extrahera och typomvandla (String till Number) datan i HTML-tabellen till en 2D-array
      return Array.from(document.querySelectorAll('.content > article > table > tbody > tr'))
        .map(
          row => Array.from(row.querySelectorAll('td'))
            .map(el => el.innerText.trim().toLowerCase().match(/^\d\s{0,1}\d+/g))
            .map(el => (el && el[0] ? parseInt(el[0].replace(/\s/ig, ''), 10) : null))
        )
    })
    browser.close()

    // Transformera datan till den struktur som för databasen
    const STORE_KEYS = ['belopp', 'uppl.avg', 'fakt.avg', 'ränta (kr)', 'betala totalt', 'eff. ränta (%)', 'nom. ränta (%)']
    const ADDED_KEYS = [{ key: 'löptid (d)', value: 30 }]
    const transformed = extracted.reduce(
      (loans, row) => {
        const loan = {}
        row.forEach((val, i) => {
          loan[STORE_KEYS[i]] = val
        })
        ADDED_KEYS.forEach((el) => { loan[el.key] = el.value })
        loans.push(loan)
        return loans
      },
      []
    )

    return transformed
  }

  scrape().then((data) => {
    global.console.log(JSON.stringify(data))
    // TODO: Serialize and store data
  })
} catch (error) {
  if (error instanceof TimeoutError) {
    throw error
  } else {
    throw error
  }
}
