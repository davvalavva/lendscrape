const staticTableTaskFactory = require('./staticTable-task-factory')

module.exports = function taskFactory(creditors) {
  const tasks = creditors
    .map((creditor) => {
      switch (creditor.task) {
        case 'staticTable': return staticTableTaskFactory(creditor)
        default: throw new Error('Not implemented!')
      }
    })

  return tasks
}
