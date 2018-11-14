
const creditorsCfg = require('../config/creditors.json')
const runTasks = require('../main/run-tasks.js')
const createTasks = require('../main/create-tasks.js')

const creditors = creditorsCfg.filter(creditor => creditor.parse)

module.exports = async function main(tryAgain = []) {
  const tasks = createTasks(creditors, tryAgain)
  const result = await runTasks(tasks, creditors, tryAgain)
  return result
}
