/* eslint-disable no-await-in-loop */
// In contrast to using Promise.all(), a for...of loop over an array of promises doesn't
// require all promises to be resolved to be able to retrieve any data from the scrapings.
// This is a huge deal. And another great benefit is that rejected promises can easily be
// tried again without needing to redo successful async operations again.

const options = require('./options.js')

module.exports = async (tasks, creditors, _tryAgain) => {
  const tryAgain = []
  const halted = []
  let documents = []
  for (const task of tasks) {
    try {
      if (_tryAgain.length > 0) {
        console.log(`Retry #${task.attemptNo - 1} for '${task.creditor}'\n${task.targetURL}`)
      } else {
        console.log(`Retrieve/parse '${task.creditor}'\n${task.targetURL}`)
      }
      // test of response codes
      let err
      if (task.creditor === 'site2') {
        err = new Error()
        // err.response = { statusCode: 404, message: 'File not found' }
        err.response = { statusCode: 408, message: 'Timeout for request' }
        throw err
      }
      if (!err) {
        const opts = await options(task)
        const result = task.asyncScraper
          ? await task.scraper(opts)
          : task.scraper(opts)

        documents = [...documents, ...result]
      }
      console.log(`...complete!\n`)
    } catch (e) {
      if (e.response && e.response.statusCode) {
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
            tryAgain.push(task)
            break
          default:
            halted.push(creditors.filter(creditor => creditor.name === task.creditor)[0])
            console.log(`Unhandled HTTP ${e.response.statusCode} error.\nMessage: ${e.response.message}`)
        }
        console.log(`...fail!\n`)
      } else {
        throw e
      }
    }
  }

  return { documents, tryAgain, halted }
}
