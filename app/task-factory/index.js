/** @module task-factory/ */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name        Required    Description
 * ================================================================================================================================================
 * @param         {object[]}  creditors     yes       @todo write a description
 *
 *
 * @return {object[]} @todo write a description
 */
/* eslint-enable max-len */

const staticTableTaskFactory = require('./staticTable-task')
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
