/**
 * This module offers methods for instantiating a headless browser.
 * It also sets the most common configuration settings before
 * returning the browser handle to the caller. It uses 3rd party
 * library Puppeteer for launching and controlling the headless browser.
 *
 * @module libs/browser-manager
 */

const puppeteer = require('puppeteer')
const { TimeoutError } = require('puppeteer/Errors')
const browserAgents = require('browser-agents')
const path = require('path')
const printError = require('../errors/print-error')
const logError = require('./log-error')
const {
  OS,
  projectRoot
} = require('../config/env.json')
const {
  debugMode: debug,
  enableLogging: log
} = require('../config/runtime.json')

let browserInstance
const getBrowser = async () => {
  if (!browserInstance) browserInstance = await puppeteer.launch()
  return browserInstance
}

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

/**
 * Returns an instance of Page
 *
 * @return {object} Returns an instance of Page
 */
const newPage = async () => {
  let page
  try {
    const browser = await getBrowser()
    page = await browser.newPage()
    await page.setUserAgent(browserAgents.random())
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setCacheEnabled(false)
    await page.setExtraHTTPHeaders({ Referer: 'https://google.com/' })
  } catch (e) {
    if (debug) {
      e.path = filepath
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    throw e
  }
  return page
}

/**
 * Closes the browser. Throws an error if no browser instance exits
 *
 * @return {undefined}
 */
const closeBrowser = async () => {
  if (browserInstance) return browserInstance.close()
  throw new ReferenceError(`Can't close non-existing browser`)
}

module.exports = { newPage, closeBrowser, TimeoutError }
