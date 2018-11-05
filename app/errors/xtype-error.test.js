/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/errors/xtype-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const XTypeError = require('./xtype-error')

test('XTypeError(message, fileName)', (t) => {
  t.type(new XTypeError('message', 'file.js'), XTypeError, `[01] Returns instance of XTypeError when thrown with correctly set arguments`)
  t.throws(() => { new XTypeError() }, TypeError, `[02] Throws TypeError when no arguments given`)
  t.throws(() => { new XTypeError('message') }, TypeError, `[03] Throws TypeError when 2nd argument not given`)
  t.throws(() => { new XTypeError(null, 'file.js') }, TypeError, `[04] Throws TypeError when 1st argument is null`)
  t.throws(() => { new XTypeError(undefined, 'file.js') }, TypeError, `[05] Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new XTypeError(100, 'file.js') }, TypeError, `[06] Throws TypeError when 1st argument is a Number`)
  t.throws(() => { new XTypeError([], 'message') }, TypeError, `[07] Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new XTypeError({}, 'message') }, TypeError, `[08] Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new XTypeError(() => {}, 'message') }, TypeError, `[09] Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new XTypeError(Promise.resolve(1), 'message') }, TypeError, `[10] Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new XTypeError('', 'file.js') }, Error, `[11] Throws Error when 1st argument is given an empty string`)
  t.throws(() => { new XTypeError('message', null) }, TypeError, `[12] Throws TypeError when 2nd argument is null`)
  t.throws(() => { new XTypeError('message', undefined) }, TypeError, `[13] Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new XTypeError('message', 100) }, TypeError, `[14] Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new XTypeError('message', []) }, TypeError, `[15] Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new XTypeError('message', {}) }, TypeError, `[16] Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new XTypeError('message', () => {}) }, TypeError, `[17] Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new XTypeError('message', Promise.resolve(1)) }, TypeError, `[18] Throws TypeError when 2nd argument is a Promise`)
  t.throws(() => { new XTypeError('message', '') }, Error, `[19] Throws Error when 2nd argument is given an empty string`)
  t.end()
})
