/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/errors/validation-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const ValidationError = require('./validation-error')

test('ValidationError(message, fileName)', (t) => {
  t.type(new ValidationError('message', 'file.js'), ValidationError, `[01] Returns instance of ValidationError when thrown with correctly set arguments`)
  t.throws(() => { new ValidationError() }, TypeError, `[02] Throws TypeError when no arguments given`)
  t.throws(() => { new ValidationError('message') }, TypeError, `[03] Throws TypeError when 2nd argument not given`)
  t.throws(() => { new ValidationError(null, 'file.js') }, TypeError, `[04] Throws TypeError when 1st argument is null`)
  t.throws(() => { new ValidationError(undefined, 'file.js') }, TypeError, `[05] Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new ValidationError(100, 'file.js') }, TypeError, `[06] Throws TypeError when 1st argument is a Number`)
  t.throws(() => { new ValidationError([], 'file.js') }, TypeError, `[07] Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new ValidationError({}, 'file.js') }, TypeError, `[08] Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new ValidationError(() => {}, 'file.js') }, TypeError, `[09] Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new ValidationError('', 'file.js') }, Error, `[10] Throws Error when 1st argument is an empty string`)
  t.throws(() => { new ValidationError(Promise.resolve(1), 'file.js') }, TypeError, `[11] Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new ValidationError('message', null) }, TypeError, `[12] Throws TypeError when 2nd argument is null`)
  t.throws(() => { new ValidationError('message', undefined) }, TypeError, `[13] Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new ValidationError('message', 100) }, TypeError, `[14] Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new ValidationError('message', []) }, TypeError, `[15] Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new ValidationError('message', {}) }, TypeError, `[16] Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new ValidationError('message', () => {}) }, TypeError, `[17] Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new ValidationError('message', '') }, Error, `[18] Throws Error when 2nd argument is an empty string`)
  t.throws(() => { new ValidationError('message', Promise.resolve(1)) }, TypeError, `[19] Throws TypeError when 2nd argument is a Promise`)
  t.end()
})
