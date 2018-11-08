/* eslint-disable no-new */
const { test } = require('tap')
const ParseError = require('./parse-error')

test('ParseError(message)', (t) => {
  t.type(new ParseError('message'), ParseError, `[01] Returns instance of ParseError when thrown with correctly set arguments`)
  t.throws(() => { new ParseError() }, ReferenceError, `[02] Throws ReferenceError when no arguments given`)
  t.throws(() => { new ParseError(null) }, TypeError, `[03] Throws TypeError argument is null`)
  t.throws(() => { new ParseError(301) }, TypeError, `[04] Throws TypeError when argument is a Number`)
  t.throws(() => { new ParseError([12, 13]) }, TypeError, `[05] Throws TypeError when argument is an Array`)
  t.throws(() => { new ParseError({}) }, TypeError, `[06] Throws TypeError when argument is an Object`)
  t.throws(() => { new ParseError(() => {}) }, TypeError, `[07] Throws TypeError when argument is a Function`)
  t.throws(() => { new ParseError(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when argument is a Promise`)
  t.end()
})
