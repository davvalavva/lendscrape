const {
  dont_run_tasks_for_black_listed_creditors: blacklist,
  blackListed_creditors: blacklisted
} = require('./config/runtime.json')

const creditors = require('./config/creditors.json')
  .filter(creditor => !creditor.disable)
  .filter(creditor => !blacklist || blacklisted.indexOf(creditor.name) === -1)

const taskFactory = require('./main/task-factory')
const taskRunner = require('./main/task-runner')
const main = require('./main');

(async () => {
  const settledTasks = await main({ creditors, taskFactory, taskRunner })
  const strippedTasks = settledTasks.map(task => ({ creditor: task.creditor, result: task.result }))

  console.log(`\n\n\nFINAL RESULTS:`)
  console.log(JSON.stringify(strippedTasks, null, 2))
})()
