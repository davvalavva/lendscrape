/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/errors/xrange-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const XRangeError = require('./xrange-error')

test('XRangeError(message, fileName)', (t) => {
  t.type(new XRangeError('message', 'file.js'), XRangeError, `[01] Returns instance of XRangeError when thrown with correctly set args`)
  t.throws(() => { new XRangeError() }, TypeError, `[02] Throws TypeError when no args given`)
  t.throws(() => { new XRangeError('message') }, TypeError, `[03] Throws TypeError when 2nd arg. not given`)
  t.throws(() => { new XRangeError(null, 'file.js') }, TypeError, `[04] Throws TypeError when 1st arg. is null`)
  t.throws(() => { new XRangeError(undefined, 'file.js') }, TypeError, `[05] Throws TypeError when 1st arg. is undefined`)
  t.throws(() => { new XRangeError(123, 'file.js') }, TypeError, `[06] Throws TypeError when 1st arg. is a Number`)
  t.throws(() => { new XRangeError([], 'file.js') }, TypeError, `[07] Throws TypeError when 1st arg. is an Array`)
  t.throws(() => { new XRangeError({}, 'file.js') }, TypeError, `[08] Throws TypeError when 1st arg. is an Object`)
  t.throws(() => { new XRangeError(() => {}, 'file.js') }, TypeError, `[09] Throws TypeError when 1st arg. is a Function`)
  t.throws(() => { new XRangeError(Promise.resolve(1), 'file.js') }, TypeError, `[10] Throws TypeError when 1st arg. is a Promise`)
  t.throws(() => { new XRangeError('', 'file.js') }, Error, `[11] Throws Error when 1st arg. is given an empty string`)
  t.throws(() => { new XRangeError('message', null) }, TypeError, `[12] Throws TypeError when 2nd arg. is null`)
  t.throws(() => { new XRangeError('message', undefined) }, TypeError, `[13] Throws TypeError when 2nd arg. is undefined`)
  t.throws(() => { new XRangeError('message', 123) }, TypeError, `[14] Throws TypeError when 2nd arg. is a Number`)
  t.throws(() => { new XRangeError('message', []) }, TypeError, `[15] Throws TypeError when 2nd arg. is an Array`)
  t.throws(() => { new XRangeError('message', {}) }, TypeError, `[16] Throws TypeError when 2nd arg. is an Object`)
  t.throws(() => { new XRangeError('message', () => {}) }, TypeError, `[17] Throws TypeError when 2nd arg. is a Function`)
  t.throws(() => { new XRangeError('message', Promise.resolve(1)) }, TypeError, `[18] Throws TypeError when 2nd arg. is a Promise`)
  t.throws(() => { new XRangeError('message', '') }, Error, `[19] Throws Error when 2nd arg. is given an empty string`)

  t.end()
})
