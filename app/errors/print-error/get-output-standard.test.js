/**
 * @file Tests for file {@link <install_folder>/errors/print-error/get-output-standard.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const getOutputStandard = require('./get-output-standard')

test('getOutputStandard(errObj)', (t) => {
  t.type(getOutputStandard(new Error('errMessage')), 'string', `[01] Returns a string when passed an Error instance`)
  t.type(getOutputStandard(new SyntaxError('errMessage')), 'string', `[02] Returns a string when passed an SyntaxError instance`)
  t.type(getOutputStandard(new TypeError('errMessage')), 'string', `[03] Returns a string when passed an TypeError instance`)
  t.type(getOutputStandard(new ReferenceError('errMessage')), 'string', `[04] Returns a string when passed an ReferenceError instance`)
  t.type(getOutputStandard(new RangeError('errMessage')), 'string', `[05] Returns a string when passed an RangeError instance`)
  t.type(getOutputStandard(new URIError('errMessage')), 'string', `[06] Returns a string when passed an URIError instance`)
  t.type(getOutputStandard(new EvalError('errMessage')), 'string', `[07] Returns a string when passed an EvalError instance`)
  t.throws(() => { getOutputStandard() }, TypeError, `[08] Throws TypeError when no arguments given`)
  t.throws(() => { getOutputStandard(null, 1) }, TypeError, `[09] Throws TypeError when 1st argument is null`)
  t.throws(() => { getOutputStandard(undefined, 1) }, TypeError, `[10] Throws TypeError when 1st argument is undefined`)
  t.throws(() => { getOutputStandard(301, 1) }, TypeError, `[11] Throws TypeError when 1st argument is a Number`)
  t.throws(() => { getOutputStandard([], 1) }, TypeError, `[12] Throws TypeError when 1st argument is an Array`)
  t.throws(() => { getOutputStandard({}, 1) }, TypeError, `[13] Throws TypeError when 1st argument is an Object`)
  t.throws(() => { getOutputStandard(() => {}, 1) }, TypeError, `[14] Throws TypeError when 1st argument is a Function`)
  t.throws(() => { getOutputStandard(Promise.resolve(1), 1) }, TypeError, `[15] Throws TypeError when 1st argument is a Promise`)
  t.end()
})
