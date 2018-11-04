/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/config/ParseError.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const ParseError = require('./ParseError')

test('ParseError(code, message, fileName)', (t) => {
  t.type(new ParseError(100, 'message', 'file.js'), ParseError, `Returns instance of ParseError when thrown with correctly set arguments`)
  t.throws(() => { new ParseError() }, TypeError, `Throws TypeError when no arguments given`)
  t.throws(() => { new ParseError(100) }, TypeError, `Throws TypeError when 2nd argument not given`)
  t.throws(() => { new ParseError(100, 'message') }, TypeError, `Throws TypeError when 3rd argument not given`)
  t.throws(() => { new ParseError(null, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is null`)
  t.throws(() => { new ParseError(undefined, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new ParseError('100', 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is a String`)
  t.throws(() => { new ParseError([], 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new ParseError({}, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new ParseError(() => {}, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new ParseError(Promise.resolve(1), 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new ParseError(100, null, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is null`)
  t.throws(() => { new ParseError(100, undefined, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new ParseError(100, 100, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new ParseError(100, [], 'file.js') }, TypeError, `Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new ParseError(100, {}, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new ParseError(100, () => {}, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new ParseError(100, Promise.resolve(1), 'file.js') }, TypeError, `Throws TypeError when 2nd argument is a Promise`)
  t.throws(() => { new ParseError(100, 'message', null) }, TypeError, `Throws TypeError when 3rd argument is null`)
  t.throws(() => { new ParseError(100, 'message', undefined) }, TypeError, `Throws TypeError when 3rd argument is undefined`)
  t.throws(() => { new ParseError(100, 'message', 100) }, TypeError, `Throws TypeError when 3rd argument is a Number`)
  t.throws(() => { new ParseError(100, 'message', []) }, TypeError, `Throws TypeError when 3rd argument is an Array`)
  t.throws(() => { new ParseError(100, 'message', {}) }, TypeError, `Throws TypeError when 3rd argument is an Object`)
  t.throws(() => { new ParseError(100, 'message', () => {}) }, TypeError, `Throws TypeError when 3rd argument is a Function`)
  t.throws(() => { new ParseError(100, 'message', Promise.resolve(1)) }, TypeError, `Throws TypeError when 3rd argument is a Promise`)
  t.throws(() => { new ParseError(-983, 'message', 'file.js') }, RangeError, `Throws RangeError when 1st argument is given a Number of a non-existing code`)
  t.throws(() => { new ParseError(100, 'OK', 'file.js') }, Error, `Throws Error when 2nd argument is given a string less than 3 characters`)
  t.throws(() => { new ParseError(100, 'message', '') }, Error, `Throws Error when 3rd argument is given an empty string`)
  t.end()
})
