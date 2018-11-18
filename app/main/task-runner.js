/* eslint-disable no-await-in-loop */
const { defaultMaxAttempts } = require('../config/runtime.json')

module.exports = async function taskRunner(tasks, accSettledTasks = []) {
  let retryTasks = []
  let settledTasks = accSettledTasks

  for (const task of tasks) {
    let success = true
    try {
      console.log(`Attempt #${task.attemptNo} for '${task.creditor}'\n${task.targetURL}`)
      const docs = task.isAsyncScraper ? await task.scraper(task) : task.scraper(task)
      if (success) {
        task.result = { success: true, documents: docs }
        settledTasks = [...settledTasks, task]
      }
      console.log(`...success!\n`)
    } catch (e) {
      if (e.constructor.name === 'StatusCodeError') {
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
            if (task.attemptNo > (task.maxAttempts || defaultMaxAttempts)) {
              task.result = { success: false }
              settledTasks = [...settledTasks, task]
            } else {
              task.attemptNo += 1
              retryTasks = [...retryTasks, task]
            }
            break
          default:
            task.result = { success: false }
            settledTasks = [...settledTasks, task]
            console.log(`Unhandled HTTP ${e.response.statusCode} error.\nMessage: ${e.response.message}`)
        }
        success = false
        console.log(`...fail!\n`)
      } else {
        throw e
      }
    }
  }
  if (retryTasks.length > 0) {
    await taskRunner(retryTasks, settledTasks)
  }
  return settledTasks
}
