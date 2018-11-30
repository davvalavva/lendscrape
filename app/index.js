const { blacklist, blacklisted } = require('./config/runtime.json')

const creditors = require('./config/creditors.json')
  // The 'disable' setting can be set per creditor in 'config/creditor.json'
  .filter(creditor => !creditor.disable)
  // The 'blacklist' and 'blacklisted' settings can be set in 'config/runtime.json'
  .filter(creditor => !blacklist || blacklisted.indexOf(creditor.name) === -1)

const taskFactory = require('./task-factory')
const taskRunner = require('./task-runner')

async function startApp() {
  const tasks = taskFactory(creditors)
  const settledTasks = await taskRunner({ tasks })

  const cleanedUpTasks = settledTasks
    .map(task => ({ creditor: task.creditor, result: task.result }))

  console.log(`\n\n\nFINAL RESULTS:`)
  console.log(JSON.stringify(cleanedUpTasks, null, 2))
}

startApp()
