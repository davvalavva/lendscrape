const schemas = require('../schemas')

module.exports = async function main({ creditors, taskFactory, taskRunner }) {
  // Set up the task for each creditor that will determine the method to use for scraping
  // and what data to store and how it should be structured.
  const tasks = taskFactory(creditors)

  // taskRunner() executes the tasks and calls itself recursively
  // until all tasks are settled (either failed or succeeded)
  const settledTasks = await taskRunner(tasks, schemas)

  return settledTasks
}
