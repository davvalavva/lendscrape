const staticTableTaskFactory = require('./staticTable-task-factory')

module.exports = function taskFactory(creditors, schemas) {
  const tasks = creditors
    .map((creditor) => {
      switch (creditor.task) {
        case 'staticTable':
          return staticTableTaskFactory(schemas.staticTableTaskConfig, creditor)
        default:
          throw new Error('Not implemented!')
      }
    })

  return tasks
}
