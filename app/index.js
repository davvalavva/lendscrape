const creditors = require('./config/creditors.json').filter(creditor => creditor.parse)
const taskFactory = require('./main/task-factory')
const taskRunner = require('./main/task-runner')
const main = require('./main');

(async () => {
  const settledTasks = (await main({ creditors, taskFactory, taskRunner }))
  const strippedTasks = settledTasks
    .map((task) => {
      let obj = { creditor: task.creditor, result: task.result }
      // if (task.result)

      // if (task.result.response) {
      //   obj.response = task.result.response
      // }
      // if (task.result.response && task.result.response.statusCode) {
      //   obj.statusCode = task.result.response.statusCode
      // }
      // if (task.result.validationError) {
      //   obj.validationError = task.result.validationError
      // }
      // if (task.result.documents) {
      //   obj = { ...obj, documents: task.result.documents }
      // }
      return obj
    })
  console.log(`\n\n\nFINAL RESULTS:`)
  console.log(JSON.stringify(strippedTasks, null, 2))
})()
