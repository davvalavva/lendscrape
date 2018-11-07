/* eslint-disable no-new */
const { test } = require('tap')
const ValidationError = require('./validation-error')

test('ValidationError(message, fileName)', (t) => {
  t.type(new ValidationError('message'), ValidationError, `[01] Returns instance of ValidationError when thrown with correctly set arguments`)
  t.throws(() => { new ValidationError() }, ReferenceError, `[02] Throws ReferenceError when no argument given`)
  t.throws(() => { new ValidationError(null) }, TypeError, `[03] Throws TypeError when argument is null`)
  t.throws(() => { new ValidationError(100) }, TypeError, `[04] Throws TypeError when argument is a Number`)
  t.throws(() => { new ValidationError([]) }, TypeError, `[05] Throws TypeError when argument is an Array`)
  t.throws(() => { new ValidationError({}) }, TypeError, `[06] Throws TypeError when argument is an Object`)
  t.throws(() => { new ValidationError(() => {}) }, TypeError, `[07] Throws TypeError when argument is a Function`)
  t.throws(() => { new ValidationError(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new ValidationError('') }, Error, `[09] Throws Error when argument is an empty string`)
  t.throws(() => { new ValidationError('   ') }, Error, `[10] Throws Error when argument is a string with only whitespace`)
  t.end()
})
