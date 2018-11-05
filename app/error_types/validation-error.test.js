/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/error_types/validation-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const ValidationError = require('./validation-error')

test('ValidationError(message, fileName)', (t) => {
  t.type(new ValidationError('message', 'file.js'), ValidationError, `Returns instance of ValidationError when thrown with correctly set arguments`)
  t.throws(() => { new ValidationError() }, TypeError, `Throws TypeError when no arguments given`)
  t.throws(() => { new ValidationError('message') }, TypeError, `Throws TypeError when 2nd argument not given`)
  t.throws(() => { new ValidationError(null, 'file.js') }, TypeError, `Throws TypeError when 1st argument is null`)
  t.throws(() => { new ValidationError(undefined, 'file.js') }, TypeError, `Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new ValidationError(100, 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Number`)
  t.throws(() => { new ValidationError([], 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new ValidationError({}, 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new ValidationError(() => {}, 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new ValidationError('', 'file.js') }, Error, `Throws Error when 1st argument is an empty string`)
  t.throws(() => { new ValidationError(Promise.resolve(1), 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new ValidationError('message', null) }, TypeError, `Throws TypeError when 2nd argument is null`)
  t.throws(() => { new ValidationError('message', undefined) }, TypeError, `Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new ValidationError('message', 100) }, TypeError, `Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new ValidationError('message', []) }, TypeError, `Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new ValidationError('message', {}) }, TypeError, `Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new ValidationError('message', () => {}) }, TypeError, `Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new ValidationError('message', '') }, Error, `Throws Error when 2nd argument is an empty string`)
  t.throws(() => { new ValidationError('message', Promise.resolve(1)) }, TypeError, `Throws TypeError when 2nd argument is a Promise`)
  t.end()
})
