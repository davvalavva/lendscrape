const puppeteer = require('puppeteer')
const { TimeoutError } = require('puppeteer/Errors')
const browserAgents = require('browser-agents')
const extract = require('./extract')

const SOURCE = ['https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n']

const scrape = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const frame = page.mainFrame()
  page.setUserAgent(browserAgents.random())
  page.setViewport({ width: 1920, height: 1080 })

  try {
    await frame.goto(SOURCE)
    const extracted = await extract(frame)
    browser.close()

    // TODO: Clean and transform data
    const transformed = extracted

    return transformed
  } catch (error) {
    if (error instanceof TimeoutError) {
    // TODO
    } else {
      // TODO
    }
  }

  return {}
}

scrape().then((data) => {
  global.console.log(data)
  // TODO: Serialize and store data
})
