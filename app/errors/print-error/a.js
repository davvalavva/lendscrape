
const printError = require('.')

const a = new Error('errMessage')
const b = printError(a, 1)
// console.log(a)
