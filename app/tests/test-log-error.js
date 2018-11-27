const { test } = require('tap')
const logError = require('../lib/log-error')

test('logError(errorInstance)', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { logError() }, TypeError, `[01] Throws TypeError when no argument given`, { todo: true })

  // [02] *****************************************************************************************
  t.throws(() => { logError(null) }, TypeError, `[02] Throws TypeError when argument is null`, { todo: true })

  // [03] *****************************************************************************************
  t.throws(() => { logError(undefined) }, TypeError, `[03] Throws TypeError when argument is undefined`, { todo: true })

  // [04] *****************************************************************************************
  t.throws(() => { logError([]) }, TypeError, `[04] Throws TypeError when argument is an array`, { todo: true })

  // [05] *****************************************************************************************
  t.throws(() => { logError(() => {}) }, TypeError, `[05] Throws TypeError when argument is a function`, { todo: true })

  // [06] *****************************************************************************************
  t.throws(() => { logError(Promise.resolve(1)) }, TypeError, `[06] Throws TypeError when argument is a promise`, { todo: true })

  // [07] *****************************************************************************************
  t.throws(() => { logError(12) }, TypeError, `[07] Throws TypeError when argument is a number`, { todo: true })

  // [08] *****************************************************************************************
  t.throws(() => { logError('12') }, TypeError, `[08] Throws TypeError when argument is a string`, { todo: true })

  // [09] *****************************************************************************************
  t.throws(() => { logError({}) }, TypeError, `[09] Throws TypeError when argument is an object that is not an instance of Error`, { todo: true })

  t.end()
})
