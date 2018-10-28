const puppeteer = require('puppeteer')
const { TimeoutError } = require('puppeteer/Errors')
const browserAgents = require('browser-agents')

let browserInstance
const getBrowser = async () => {
  if (!browserInstance) browserInstance = await puppeteer.launch()
  return browserInstance
}

module.exports = {
  newPage: async () => {
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.setUserAgent(browserAgents.random())
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setCacheEnabled(false)
    await page.setExtraHTTPHeaders({ Referer: 'https://google.com/' })
    return page
  },
  closeBrowser: () => {
    if (browserInstance) return browserInstance.close()
    throw new Error(`Can't close non-existing browser`)
  },
  TimeoutError
}
