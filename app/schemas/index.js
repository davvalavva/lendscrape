const taskConfigDefs = require('./task-config/defs.json')
const defaultTaskConfig = require('./task-config/default.json')
const staticTableTaskConfig = require('./task-config/staticTable.json')
const paydayVariant1 = require('./documents/paydayVariant1.json')

module.exports = {
  taskConfigDefs,
  defaultTaskConfig,
  staticTableTaskConfig,
  paydayVariant1,
  all: [
    taskConfigDefs,
    defaultTaskConfig,
    staticTableTaskConfig,
    paydayVariant1
  ]
}
