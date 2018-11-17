const path = require('path')

const printError = require('../errors/print-error')
const logError = require('../lib/log-error')
const {
  OS,
  projectRoot
} = require('../config/env.json')
const {
  debugMode,
  enableLogging
} = require('../config/runtime.json')

const filepath = (filename) => {
  if (OS === 'win') {
    return `${projectRoot}${path.win32.basename(filename)}`
  }
  return `${projectRoot}${path.posix.basename(filename)}`
}

module.exports = {
  printError,
  logError,
  filepath,
  debugMode,
  enableLogging
}
