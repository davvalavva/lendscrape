/**
 * @file Tests for file {@link <install_folder>/errors/print-error/get-output.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const getOutput = require('./get-output')

test('getOutput(errObj)', (t) => {
  t.type(getOutput(new Error('errMessage')), 'string', `[01] Returns a string when passed an Error instance`)
  t.type(getOutput(new SyntaxError('errMessage')), 'string', `[02] Returns a string when passed an SyntaxError instance`)
  t.type(getOutput(new TypeError('errMessage')), 'string', `[03] Returns a string when passed an TypeError instance`)
  t.type(getOutput(new ReferenceError('errMessage')), 'string', `[04] Returns a string when passed an ReferenceError instance`)
  t.type(getOutput(new RangeError('errMessage')), 'string', `[05] Returns a string when passed an RangeError instance`)
  t.type(getOutput(new URIError('errMessage')), 'string', `[06] Returns a string when passed an URIError instance`)
  t.type(getOutput(new EvalError('errMessage')), 'string', `[07] Returns a string when passed an EvalError instance`)
  t.throws(() => { getOutput() }, TypeError, `[08] Throws TypeError when no arguments given`)
  t.throws(() => { getOutput(null) }, TypeError, `[09] Throws TypeError when 1st argument is null`)
  t.throws(() => { getOutput(undefined) }, TypeError, `[10] Throws TypeError when 1st argument is undefined`)
  t.throws(() => { getOutput(301) }, TypeError, `[11] Throws TypeError when 1st argument is a Number`)
  t.throws(() => { getOutput([]) }, TypeError, `[12] Throws TypeError when 1st argument is an Array`)
  t.throws(() => { getOutput({}) }, TypeError, `[13] Throws TypeError when 1st argument is an Object`)
  t.throws(() => { getOutput(() => {}) }, TypeError, `[14] Throws TypeError when 1st argument is a Function`)
  t.throws(() => { getOutput(Promise.resolve(1)) }, TypeError, `[15] Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { getOutput('') }, Error, `[16] Throws Error when 1st argument is given an empty string`)
  t.end()
})
