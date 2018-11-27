const staticTableTaskFactory = require('./staticTable-task-factory')
const ValidationError = require('../errors/validation-error')

module.exports = function taskFactory(creditors) {
  return creditors
    .map((creditor) => {
      switch (creditor.task) {
        case 'staticTable': return staticTableTaskFactory(creditor)
        default: throw new ValidationError(`Task '${creditor.task}' not implemented!`)
      }
    })
}
