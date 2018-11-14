/* eslint-disable no-await-in-loop */
const path = require('path')
const rp = require('request-promise')
const creditorsConfig = require('./config/creditors.json')
const tableScraper = require('./lib/table-scraper')
const printError = require('./errors/print-error')
const logError = require('./lib/log-error')
const { defaultMaxRetries } = require('./config/runtime.json')
const { OS, projectRoot } = require('./config/env.json')
const { debugMode, enableLogging } = require('./config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

const creditors = creditorsConfig
  .filter(creditor => creditor.parse)
  // .map(creditor => ({ ...creditor, attemptNo: 1 }))

const TABLE_SCRAPER = 'table-scraper'
const failed = []
let tryTasksAgain = []

const main = async () => {
  const tasks = tryTasksAgain.length > 0
    ? [...tryTasksAgain]
    : creditors
      .map((creditor) => {
        if (creditor.scraper.name === TABLE_SCRAPER) {
          return {
            attemptNo: 1,
            maxRetries: creditor.maxRetries,
            creditor: creditor.name,
            scraper: tableScraper,
            scraperName: creditor.scraper.name,
            payload: creditor.payload,
            targetURL: creditor.targetURL,
            hdSelector: creditor.scraper.hdSelector,
            tdSelector: creditor.scraper.tdSelector,
            labelMap: creditor.labelMap,
            fieldInject: creditor.fieldInject || null
          }
        }
        // return parseTasks[creditor.name]()
        throw new Error('Not implemented!')
      })

  // In contrast to using Promise.all(), a for...of loop over an array of promises doesn't
  // require all promises to be resolved to be able to retrieve any data from the scrapings.
  // This is a huge deal. And another great benefit is that rejected promises can easily be
  // tried again without needing to redo successful async operations again.
  let documents = []
  for (const task of tasks) {
    let taskSuccessful
    let options = {
      labelMap: task.labelMap,
      fieldInject: task.fieldInject
    }
    if (task.scraperName === TABLE_SCRAPER) {
      options = {
        ...options,
        hdSelector: task.hdSelector,
        tdSelector: task.tdSelector
      }
    }
    try {
      if (tryTasksAgain.length > 0) {
        console.log(`Retry #${task.attemptNo - 1} for '${task.creditor}'\n${task.targetURL}`)
        tryTasksAgain = []
      } else {
        console.log(`Retrieve/parse '${task.creditor}'\n${task.targetURL}`)
      }
      if (task.payload === 'html') {
        options = {
          ...options,
          html: await rp({ uri: task.targetURL })
        }
      }
      // test response codes
      let err
      if (task.creditor === 'site2') {
        err = new Error()
        // err.response = { statusCode: 404, message: 'File not found' }
        err.response = { statusCode: 408, message: 'Timeout for request' }
        throw err
      }
      if (!err) {
        documents = [...documents, ...await task.scraper(options)]
      }
      console.log(`...complete!\n`)
    } catch (e) {
      if (e && e.response && e.response.statusCode) {
        // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        switch (e.response.statusCode) {
          case 408: // Request Timeout
          case 429: // Too Many Requests (RFC 6585)
          case 499: // Client Closed Request (nginx)
          case 500: // Internal Server Error
          case 502: // Bad Gateway
          case 503: // Service Unavailable
          case 504: // Gateway Timeout
          case 524: // A Timeout Occurred (Cloudflare)
          case 527: // Railgun Error (Cloudflare)
            tryTasksAgain.push(task)
            break
          default:
            failed.push(creditors.filter(creditor => creditor.name === task.creditor)[0])
            console.log(`Unhandled HTTP ${e.response.statusCode} error.\nMessage: ${e.response.message}`)
        }
        console.log(`...fail!\n`)
      } else {
        throw e
      }
      /*
      e.options === {
        "uri": "http://localhost:3000/site3.html",
        "simple": true,
        "resolveWithFullResponse": false,
        "transform2xxOnly": false
      }
      */
    }
  }
  return documents
}

(async () => {
  const documents = await main()
  await (async function retryer() {
    tryTasksAgain = tryTasksAgain
      .filter((task) => {
        if (task.attemptNo > (task.maxRetries || defaultMaxRetries)) {
          failed.push(task)
          return false
        }
        return true
      })

    tryTasksAgain.forEach((task, i, arr) => {
      arr[i].attemptNo += 1 // eslint-disable-line
    })

    if (tryTasksAgain.length > 0) {
      await main()
      await retryer()
    }
  }())

  console.log(`\n************************************\nSuccessfully parsed ${documents.length} documents:\n${JSON.stringify(documents, null, 2)}`)
  if (failed.length > 0) {
    console.log(`\n************************************\nFailures:`)
    failed.forEach((task) => {
      console.log(`${task.creditor} [${task.targetURL}]: ${task.attemptNo > 1 ? `${task.attemptNo} attempts were made` : 'No attempts retrying'}`)
    })
  }
})()
  .catch((e) => {
    e.path = filepath
    if (debug) {
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    throw e
  })
