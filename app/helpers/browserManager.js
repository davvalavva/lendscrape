/**
 * @file Instantiates and configures a headless browser
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

/**
 *
 *
 * This module offers methods for instantiating a headless browser.
 * It also sets the most common configuration settings before
 * returning the browser handle to the caller. It uses 3rd party
 * library Puppeteer for launching and controlling the headless browser.
 *
 * @module helpers/browserManager
 */

const puppeteer = require('puppeteer')
const { TimeoutError } = require('puppeteer/Errors')
const browserAgents = require('browser-agents')

let browserInstance
const getBrowser = async () => {
  if (!browserInstance) browserInstance = await puppeteer.launch()
  return browserInstance
}

/**
 * TODO Detailed description
 *
 * @return {object} Returns a Page instance
 */
const newPage = async () => {
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.setUserAgent(browserAgents.random())
  await page.setViewport({ width: 1920, height: 1080 })
  await page.setCacheEnabled(false)
  await page.setExtraHTTPHeaders({ Referer: 'https://google.com/' })
  return page
}

/**
 * TODO Detailed description
 *
 * @return {undefined} TODO description
 */
const closeBrowser = async () => {
  if (browserInstance) return browserInstance.close()
  throw new Error(`Can't close non-existing browser`)
}

module.exports = { newPage, closeBrowser, TimeoutError }
