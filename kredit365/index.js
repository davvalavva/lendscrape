// const parseNum = require('parse-num')
const { newPage, closeBrowser, TimeoutError } = require('../browserManager')

try {
  const scrape = async () => {
    const page = await newPage()
    await page.goto('https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n')

    const extracted = await page.evaluate(() => {
      const EXPECTED_HEADERS = ['belopp', 'uppl. avg', 'fakt. avg', 'ränta', 'total', 'eff. ränta', 'nom. ränta']
      const headers = Array.from(document.querySelectorAll('.content > article > table > thead > tr > th'))

      // Kontrollera så att inte tabellrubriker förändrats eller bytt ordning
      if (!headers.every((el, i) => el.innerText.trim().toLowerCase() === EXPECTED_HEADERS[i])) {
        throw new Error('Unexpected header(s)')
      }

      // Extrahera och typomvandla tabelldatan
      return Array.from(document.querySelectorAll('.content > article > table > tbody > tr'))
        .map(
          row => Array.from(row.querySelectorAll('td'))
            .map(el => el.innerText.trim().toLowerCase().match(/^\d\s{0,1}\d+/g))
            .map(el => (el && el[0] ? parseInt(el[0].replace(/\s/ig, ''), 10) : null))
        )
    })
    closeBrowser()

    // Transformera datan till "rätt" struktur för databaslagring
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
