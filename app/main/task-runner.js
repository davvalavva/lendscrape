const settledTaskFactory = require('./settled-task-factory')

module.exports = async function taskRunner(tasks, schemas, accSettledTasks = []) {
  let tryAgain = []
  let settledTasks = accSettledTasks

  /* eslint-disable no-await-in-loop */
  for (const task of tasks) {
    try {
      console.log(`\nAttempt #${task.attemptNo} for '${task.creditor}' >>> ${task.targetURL}`)
      const result = await task.execute()
      task.result = { documents: result.documents }
      settledTasks = [...settledTasks, task]
      console.log(`...Completed!\n`)

    // OPERATIONAL ERRORS
    } catch (e) {
      const settledTask = settledTaskFactory(task, e)

      if (settledTask) {
        settledTasks = [...settledTasks, settledTask]
        console.log(`...Failed, aborting!\n`)
      } else {
        task.attemptNo += 1
        tryAgain = [...tryAgain, task]
        console.log(`...Failed, retrying!\n`)
      }
    }
  }
  if (tryAgain.length > 0) {
    settledTasks = await taskRunner(tryAgain, schemas, settledTasks)
  }

  return settledTasks
}
