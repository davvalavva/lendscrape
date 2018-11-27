const { test } = require('tap')
const printError = require('../errors/print-error/index')

test('printError(errorInstance)', (t) => {
  // [01] *****************************************************************************************
  t.type(printError(new Error('errMessage')), 'boolean', `[01] Returns a boolean if no errors`)

  // [02] *****************************************************************************************
  t.equal(printError(new Error('errMessage')), true, `[02] Returns true if no errors`)

  // [03] *****************************************************************************************
  t.throws(() => { printError(null) }, TypeError, `[03] Throws TypeError when argument is null`)

  // [04] *****************************************************************************************
  t.throws(() => { printError(undefined) }, TypeError, `[04] Throws TypeError when argument is undefined`)

  // [05] *****************************************************************************************
  t.throws(() => { printError([]) }, TypeError, `[05] Throws TypeError when argument is an array`)

  // [06] *****************************************************************************************
  t.throws(() => { printError(() => {}) }, TypeError, `[06] Throws TypeError when argument is a function`)

  // [07] *****************************************************************************************
  t.throws(() => { printError(Promise.resolve(1)) }, TypeError, `[07] Throws TypeError when argument is a promise`)

  // [08] *****************************************************************************************
  t.throws(() => { printError(12) }, TypeError, `[08] Throws TypeError when argument is a number`)

  // [09] *****************************************************************************************
  t.throws(() => { printError('12') }, TypeError, `[09] Throws TypeError when argument is a string`)

  // [10] *****************************************************************************************
  t.throws(() => { printError({}) }, TypeError, `[10] Throws TypeError when argument is an object that is not an instance of Error`)

  t.end()
})
