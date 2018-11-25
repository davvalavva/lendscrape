const staticTableTaskFactory = require('./staticTable-task-factory')

module.exports = function taskFactory(creditors) {
  return creditors
    .map((creditor) => {
      switch (creditor.task) {
        case 'staticTable': return staticTableTaskFactory(creditor)
        default: throw new Error(`Task '${creditor.task}' not implemented!`)
      }
    })
}
