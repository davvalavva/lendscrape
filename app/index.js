const creditors = require('./config/creditors.json').filter(creditor => creditor.parse)
const taskFactory = require('./main/task-factory')
const taskRunner = require('./main/task-runner')
const main = require('./main');

(async () => {
  const settledTasks = (await main({ creditors, taskFactory, taskRunner }))
  console.log(JSON.stringify(settledTasks, null, 2))
})()
