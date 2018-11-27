/* eslint-disable no-new */
const { test } = require('tap')
const ValidationError = require('../errors/validation-error')

test('ValidationError(message)', (t) => {
  // [01] *****************************************************************************************
  t.type(new ValidationError('message'), ValidationError, `[01] Returns instance of ValidationError when thrown with correctly set arguments`)

  // [02] *****************************************************************************************
  t.throws(() => { new ValidationError() }, ReferenceError, `[02] Throws ReferenceError when no argument given`)

  // [03] *****************************************************************************************
  t.throws(() => { new ValidationError(null) }, TypeError, `[03] Throws TypeError when argument is null`)

  // [04] *****************************************************************************************
  t.throws(() => { new ValidationError(100) }, TypeError, `[04] Throws TypeError when argument is a Number`)

  // [05] *****************************************************************************************
  t.throws(() => { new ValidationError([]) }, TypeError, `[05] Throws TypeError when argument is an Array`)

  // [06] *****************************************************************************************
  t.throws(() => { new ValidationError({}) }, TypeError, `[06] Throws TypeError when argument is an Object`)

  // [07] *****************************************************************************************
  t.throws(() => { new ValidationError(() => {}) }, TypeError, `[07] Throws TypeError when argument is a Function`)

  // [08] *****************************************************************************************
  t.throws(() => { new ValidationError(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when 1st argument is a Promise`)

  t.end()
})
