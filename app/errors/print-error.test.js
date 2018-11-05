/**
 * @file Tests for file {@link <install_folder>/helpers/print-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const printError = require('./print-error')
// const ValidationError = require('./validation-error')
// const ParseError = require('./parse-error')
// const XTypeError = require('./xtype-error')
// const XRangeError = require('./xrange-error')

test('printError(errorInstance)', (t) => {
  t.throws(() => { printError() }, TypeError, `[01] Throws TypeError when no argument given`)
  t.throws(() => { printError(null) }, TypeError, `[02] Throws TypeError when argument is null`)
  t.throws(() => { printError(undefined) }, TypeError, `[03] Throws TypeError when argument is undefined`)
  t.throws(() => { printError([]) }, TypeError, `[04] Throws TypeError when argument is an array`)
  t.throws(() => { printError(() => {}) }, TypeError, `[05] Throws TypeError when argument is a function`)
  t.throws(() => { printError(Promise.resolve(1)) }, TypeError, `[06] Throws TypeError when argument is a promise`)
  t.throws(() => { printError(12) }, TypeError, `[07] Throws TypeError when argument is a number`)
  t.throws(() => { printError('12') }, TypeError, `[08] Throws TypeError when argument is a string`)
  t.throws(() => { printError({}) }, TypeError, `[09] Throws TypeError when argument is an object that is not an instance of Error`)

  t.end()
})
