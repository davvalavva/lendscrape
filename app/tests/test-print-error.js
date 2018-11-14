const { test } = require('tap')
const printError = require('../errors/print-error/index')

test('printError(errorInstance)', (t) => {
  t.type(printError(new Error('errMessage')), 'boolean', `[01] Returns a boolean if no errors`)
  t.same(printError(new Error('errMessage')), true, `[02] Returns true if no errors`)
  t.throws(() => { printError(null) }, TypeError, `[03] Throws TypeError when argument is null`)
  t.throws(() => { printError(undefined) }, TypeError, `[04] Throws TypeError when argument is undefined`)
  t.throws(() => { printError([]) }, TypeError, `[05] Throws TypeError when argument is an array`)
  t.throws(() => { printError(() => {}) }, TypeError, `[06] Throws TypeError when argument is a function`)
  t.throws(() => { printError(Promise.resolve(1)) }, TypeError, `[07] Throws TypeError when argument is a promise`)
  t.throws(() => { printError(12) }, TypeError, `[08] Throws TypeError when argument is a number`)
  t.throws(() => { printError('12') }, TypeError, `[09] Throws TypeError when argument is a string`)
  t.throws(() => { printError({}) }, TypeError, `[10] Throws TypeError when argument is an object that is not an instance of Error`)

  t.end()
})
